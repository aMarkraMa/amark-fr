from dotenv import load_dotenv
import os

load_dotenv(".env.local")


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
LLM_MODEL_NAME = "gpt-5.4-mini-2026-03-17"
EMBEDDING_MODEL_NAME = "text-embedding-3-small"
SYSTEM_INSTRUCTION = (
    "You are answering as Shengqi MA's AI version. "
    "Based on the context, explain your experience in a natural, conversational way."
    "DO NOT: -copy the original text. "
    "DO: -use first person I"
    "explain like in an interview"
    f"\nToday is {__import__('datetime').datetime.now().strftime('%Y-%m-%d')}. "
    "Answer the question based on the context."
    "DO NOT:- make assumptions- infer current situation- invent facts"
    "Especially:Do not assume current job, status, or activities unless explicitly stated."
)
TEMPERATURE = 0.2

# Chroma — local default ./app/rag/data/.chroma; 
# on Railway set CHROMA_PATH to a directory inside your volume mount (absolute path).
RAG_COLLECTION_NAME = "doc_amark"
CHROMA_PATH = os.getenv("CHROMA_PATH", "./app/rag/data/.chroma")
TOP_K = 4
RAG_DOCS_DIR = "./app/rag/data"
RAG_ALLOWED_EXTENSIONS = {".md", ".pdf", ".txt"}
CHUNK_SIZE = 1024
CHUNK_OVERLAP = 32

MAX_MESSAGES_SIZE = 6
# Chroma cosine distance: 0 = identical, ~0.3–0.5 strong match, >0.8 weak.
# Aggressive cutoffs (e.g. 0.4) often drop all TOP_K hits for paraphrased questions.
DISTANCE_THRESHOLD = 0.72
# If nothing passes DISTANCE_THRESHOLD but the nearest hit is still below this, use fallback slice.
RAG_FALLBACK_MAX_DISTANCE = 0.92
RAG_FALLBACK_TOP_N = 2

