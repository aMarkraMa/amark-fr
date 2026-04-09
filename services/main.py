from fastapi.responses import StreamingResponse
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
# get stream text with gemini api (private)
def _gemini_text_stream():
    stream = client.models.generate_content_stream(
        model="gemini-3.1-flash-lite-preview",
        contents=["Explain how AI works"],
        config = config,
    )
    for chunk in stream:
        text = getattr(chunk, "text", None) or ""
        if text:
            yield text

# transform the stream text to http data stream
@app.get("/api/chat/response")
async def chat_response_stream():
    return StreamingResponse(
        _gemini_text_stream(), #a stream object
        media_type="text/plain; charset=utf-8" # pure text
    )


@app.get("/api/chat/hello")
async def hello():
    return {"message": "hello this is api hello"} 