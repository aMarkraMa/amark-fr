from dotenv import load_dotenv
import os

load_dotenv(".env.local")

MODEL_NAME = "gemini-3.1-flash-lite-preview"
SYSTEM_INSTRUCTION = "respond shortly"
TEMPERATURE = float(os.getenv("CHAT_TEMPERATURE", "0.2"))
