from dotenv import load_dotenv
import os

load_dotenv(".env.local")

#Google Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
LLM_MODEL_NAME = "gemini-3-flash-preview"
EMBEDDING_MODEL_NAME = "gemini-embedding-2"
SYSTEM_INSTRUCTION = "respond shortly"
TEMPERATURE = 0.2

#Chroma
RAG_COLLECTION_NAME = "doc_amark"
CHROMA_PATH = "./.chroma"
TOP_K = 4

#test data
DOCUMENTS = [
        "Shengqi MA is full stack engineer.",
        "Shengqi MA is skilled in Python, React, TypeScript, and Data Engineering technologies; building high-quality, user-centric web applications.",
        "Shengqi MA is passionate about building things from the ground up and understanding how systems work at a fundamental level.",
        "Shengqi MA worked in Bpifrance for work study apprentice.",
        "Shengqi MA is male.",
    ]
IDS = ["1", "2", "3", "4", "5"]
METADATAS = [{"source": "profile"} for _ in DOCUMENTS]