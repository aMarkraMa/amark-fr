from functools import lru_cache

import chromadb
from langchain_openai import OpenAIEmbeddings

from app.config import (
    CHROMA_PATH,
    DISTANCE_THRESHOLD,
    EMBEDDING_MODEL_NAME,
    RAG_COLLECTION_NAME,
    RAG_FALLBACK_MAX_DISTANCE,
    RAG_FALLBACK_TOP_N,
    TOP_K,
)


@lru_cache(maxsize=1)
def _get_embedding_model():
    return OpenAIEmbeddings(model=EMBEDDING_MODEL_NAME)


@lru_cache(maxsize=1)
def _get_collection():
    chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
    collection = chroma_client.get_or_create_collection(
        name=RAG_COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )
    return collection


def retrieve_context(query: str, top_k: int = TOP_K) -> list[str]:
    query = query.strip()
    if not query:
        return []

    embedding = _get_embedding_model()
    query_vector = embedding.embed_query(query)
    collection = _get_collection()

    # documents/distances 是 batch 形态: [[d1, d2, ...]]，因为 query 支持一次多条
    result = collection.query(query_embeddings=[query_vector], n_results=top_k)

    documents_batch = result.get("documents") or []
    distances_batch = result.get("distances") or []
    if not documents_batch or not distances_batch:
        return []

    documents = documents_batch[0]
    distances = distances_batch[0]

    pairs = [
        (doc, dist)
        for doc, dist in zip(documents, distances)
        if isinstance(doc, str) and doc.strip()
    ]
    if not pairs:
        return []

    filtered = [doc for doc, dist in pairs if dist <= DISTANCE_THRESHOLD]
    if filtered:
        return filtered

    pairs.sort(key=lambda x: x[1])
    best_dist = pairs[0][1]
    if best_dist > RAG_FALLBACK_MAX_DISTANCE:
        return []

    n = min(RAG_FALLBACK_TOP_N, len(pairs))
    return [pairs[i][0] for i in range(n)]
