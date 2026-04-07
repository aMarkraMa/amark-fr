from google import genai
from dotenv import load_dotenv
from google.genai import types
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(".env.local")

app = FastAPI()
client = genai.Client()
config = types.GenerateContentConfig(
    system_instruction="respond shortly",
)
@app.get("/api/chat/response")
async def root():
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=["Explain how AI works"],
        config = config,
    )
    return {"message": response.text} 

@app.get("/api/chat/hello")
async def hello():
    return {"message": "hello this is api hello"} 