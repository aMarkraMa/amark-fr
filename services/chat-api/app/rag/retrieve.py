import chromadb
from app.config import (
    GEMINI_API_KEY,
    EMBEDDING_MODEL_NAME,
    CHROMA_PATH,
    RAG_COLLECTION_NAME,
    TOP_K,
    DOCUMENTS,
    IDS,
    METADATAS,
)

from langchain_google_genai import GoogleGenerativeAIEmbeddings


def _get_embedding_model() -> GoogleGenerativeAIEmbeddings:
    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL_NAME,
        google_api_key=GEMINI_API_KEY,
    )

def _get_collection():
    chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
    collection = chroma_client.get_or_create_collection(name=RAG_COLLECTION_NAME)
    return collection


def retrieve_context(query: str, top_k:int = TOP_K) -> list[str]:
    query = query.strip()
    if not query:
        return []

    embedding = _get_embedding_model()
    query_vector = embedding.embed_query(query)
    collection = _get_collection()

    vectors_docs = embedding.embed_documents(DOCUMENTS)
    collection.upsert(
        ids=IDS,
        documents=DOCUMENTS,
        embeddings=vectors_docs,
        metadatas=METADATAS,
    )

    #取到前k个最相关的结果 result.documents中存储的是所有query的结果,可以同时查多个query [[n个结果,"", ""..][][]]
    result = collection.query(query_embeddings=[query_vector], n_results=top_k)

    documents = result.get("documents", [])
    if not documents:
        return []
    return [doc for doc in documents[0] if isinstance(doc, str) and doc.strip()]
