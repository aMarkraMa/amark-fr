from dotenv import load_dotenv
import os

load_dotenv(".env.local")

#Google Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
LLM_MODEL_NAME = "gemini-3-flash-preview"
EMBEDDING_MODEL_NAME = "gemini-embedding-001"
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

#Chroma
RAG_COLLECTION_NAME = "doc_amark"
CHROMA_PATH = "./.chroma"
TOP_K = 4
RAG_DOCS_DIR = "./app/rag/data"
RAG_ALLOWED_EXTENSIONS = {".md", ".pdf", ".txt"}
CHUNK_SIZE = 1024
CHUNK_OVERLAP = 32

