import re
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

# Second query appended only when the question is about a fact the profile
# states in a short line (contact links, school). The original query is always kept.
_QUERY_EXPANSIONS: tuple[tuple[re.Pattern[str], str], ...] = (
    (
        re.compile(
            r"\b(school|university|college|education|degree|diploma|bachelor|master)\b"
            r"|école|universit|diplôme|学校|大学|学历|本科|硕士",
            re.IGNORECASE,
        ),
        "university institution education degree master bachelor",
    ),
    (
        re.compile(
            r"\b(website|homepage|portfolio)\b|\bsite\b|网站|主页|站点",
            re.IGNORECASE,
        ),
        "personal website Website www.amark.fr",
    ),
    (
        re.compile(r"github|git hub", re.IGNORECASE),
        "GitHub github.com/aMarkraMa",
    ),
    (
        re.compile(r"linkedin|linked[\s-]?in|领英", re.IGNORECASE),
        "LinkedIn linkedin.com/in/shengqi-ma",
    ),
    (
        re.compile(
            r"where can i find you|find you online|social link|profil en ligne|联系方式|社交账号",
            re.IGNORECASE,
        ),
        "personal website Website www.amark.fr "
        "GitHub github.com/aMarkraMa "
        "LinkedIn linkedin.com/in/shengqi-ma",
    ),
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


def _build_query_variants(query: str) -> list[str]:
    query = query.strip()
    if not query:
        return []

    extras: list[str] = []
    for pattern, expansion in _QUERY_EXPANSIONS:
        if pattern.search(query) and expansion not in extras:
            extras.append(expansion)
    if not extras:
        return [query]
    return [query, f"{query} {' '.join(extras)}"]


def query_needs_retrieval(query: str) -> bool:
    query = query.strip()
    if not query:
        return False
    # Greetings stay cheap. Short factual lookups such as "github" still search.
    if len(query) > 6:
        return True
    return len(_build_query_variants(query)) > 1


def _rank_documents(
    documents_batch: list[list[str | None]],
    distances_batch: list[list[float]],
) -> list[tuple[str, float]]:
    best: dict[str, float] = {}
    for documents, distances in zip(documents_batch, distances_batch):
        for doc, dist in zip(documents or [], distances or []):
            if not isinstance(doc, str) or not doc.strip():
                continue
            previous = best.get(doc)
            if previous is None or dist < previous:
                best[doc] = float(dist)
    return sorted(best.items(), key=lambda item: item[1])


def retrieve_context(query: str, top_k: int = TOP_K) -> list[str]:
    variants = _build_query_variants(query)
    if not variants:
        return []

    embedding = _get_embedding_model()
    # documents/distances 是 batch 形态: [[d1, d2, ...]]，因为 query 支持一次多条
    query_vectors = embedding.embed_documents(variants)
    collection = _get_collection()
    result = collection.query(query_embeddings=query_vectors, n_results=top_k)

    ranked = _rank_documents(
        result.get("documents") or [],
        result.get("distances") or [],
    )
    if not ranked:
        return []

    filtered = [doc for doc, dist in ranked if dist <= DISTANCE_THRESHOLD]
    if filtered:
        return filtered[:top_k]

    if ranked[0][1] > RAG_FALLBACK_MAX_DISTANCE:
        return []

    n = min(RAG_FALLBACK_TOP_N, len(ranked))
    return [ranked[i][0] for i in range(n)]
