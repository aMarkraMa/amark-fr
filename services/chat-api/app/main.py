from fastapi.responses import StreamingResponse
from fastapi import FastAPI
from app.chat_services import stream_chat_response
from app.schemas import ChatRequest


app = FastAPI()


@app.post("/api/chat/response")
async def chat_response_with_context(payload: ChatRequest):
    return StreamingResponse(
        content = stream_chat_response(payload.messages),
        media_type="text/plain; charset=utf-8" # pure text
    )


@app.get("/api/chat/hello")
async def hello():
    return {"message": "hello this is api hello"} 