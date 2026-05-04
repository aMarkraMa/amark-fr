import hashlib
from pathlib import Path
from typing import Iterable
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from datetime import datetime, timezone
import chromadb
from app.config import (
    RAG_ALLOWED_EXTENSIONS,
    RAG_DOCS_DIR,
    CHUNK_SIZE,
    CHUNK_OVERLAP,
    EMBEDDING_MODEL_NAME,
    GEMINI_API_KEY,
    CHROMA_PATH,
    RAG_COLLECTION_NAME,
)
# def _get_embedding_model() -> GoogleGenerativeAIEmbeddings:
#     return GoogleGenerativeAIEmbeddings(
#         model=EMBEDDING_MODEL_NAME,
#         google_api_key=GEMINI_API_KEY,
#     )


def _get_embedding_model():
    return HuggingFaceEmbeddings(
        model_name="BAAI/bge-m3",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

def _get_collection():
    chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
    collection = chroma_client.get_or_create_collection(name=RAG_COLLECTION_NAME)
    return collection

    
def _iter_document_paths(root: Path, allowed_extensions: set[str]) -> Iterable[Path]:
    for path in root.rglob("*"):
        if path.is_file() and path.suffix.lower() in allowed_extensions:
            yield path

def _read_file(file_path: Path) -> str:
    suffix = file_path.suffix.lower()

    if suffix in {".md", ".txt"}:
        return file_path.read_text(encoding="utf-8")

    if suffix == ".pdf":
        reader = PdfReader(str(file_path))
        parts: list[str] = []
        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                parts.append(text)
        return "\n".join(parts)
    return ""

def _chunk_text(text:str, chunk_size:int, chunk_overlap:int)->list[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""]
    )
    list_chunk: list[str] = []
    for chunk in splitter.split_text(text):
        if chunk.strip():
            list_chunk.append(chunk)
    return list_chunk


def _file_hash(file_path: Path) -> str:
    h = hashlib.sha1()
    with file_path.open("rb") as f:
        for block in iter(lambda: f.read(8192), b""):
            h.update(block)
    return h.hexdigest()


def _stable_chunk_id(source: str, idx: int) -> str:
    return f"{source}::chunk_{idx}"


def _standard_chunk_id_metadata(
    path: Path, chunks: list[str], file_hash: str
) -> tuple[list[str], list[dict]]:
    file_ids: list[str] = []
    file_metadatas: list[dict] = []
    source = path.relative_to(Path(RAG_DOCS_DIR)).as_posix()
    now_iso = datetime.now(timezone.utc).isoformat()
    for idx, _ in enumerate(chunks):
        file_ids.append(_stable_chunk_id(source, idx))
        file_metadatas.append({
            "source": source,
            "chunk_index": idx,
            "updated_at": now_iso,
            "file_hash": file_hash,
        })
    return file_ids, file_metadatas


def _existing_source_hashes(collection) -> dict[str, str]:
    existing = collection.get(include=["metadatas"])
    metadatas = existing.get("metadatas") or []
    result: dict[str, str] = {}
    for m in metadatas:
        if not m:
            continue
        source = m.get("source")
        file_hash = m.get("file_hash")
        if isinstance(source, str) and isinstance(file_hash, str):
            result[source] = file_hash
    return result

def create_update_vector_database():
    root = Path(RAG_DOCS_DIR)
    if not root.exists():
        return {
            "indexed_files": 0,
            "indexed_chunks": 0,
            "skipped_files": 0,
            "deleted_sources": 0,
            "warning": f"docs dir not found: {root}",
        }

    collection = _get_collection()
    embedding_model = _get_embedding_model()

    existing_hashes = _existing_source_hashes(collection)
    disk_sources: set[str] = set()

    indexed_files = 0
    indexed_chunks = 0
    skipped_files = 0

    for path in _iter_document_paths(root, RAG_ALLOWED_EXTENSIONS):
        try:
            text = _read_file(path)
        except Exception:
            continue
        if not text.strip():
            continue

        source = path.relative_to(root).as_posix()
        disk_sources.add(source)

        file_hash = _file_hash(path)
        if existing_hashes.get(source) == file_hash:
            skipped_files += 1
            continue

        chunks = _chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
        if not chunks:
            continue

        ids, metas = _standard_chunk_id_metadata(path, chunks, file_hash)
        vectors = embedding_model.embed_documents(chunks)

        collection.delete(where={"source": source})
        collection.upsert(
            documents=chunks,
            ids=ids,
            embeddings=vectors,
            metadatas=metas,
        )

        indexed_files += 1
        indexed_chunks += len(chunks)

    stale_sources = set(existing_hashes.keys()) - disk_sources
    for s in stale_sources:
        collection.delete(where={"source": s})

    return {
        "indexed_files": indexed_files,
        "indexed_chunks": indexed_chunks,
        "skipped_files": skipped_files,
        "deleted_sources": len(stale_sources),
    }


if __name__ == "__main__":
    print(create_update_vector_database())
