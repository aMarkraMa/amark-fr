from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import MODEL_NAME, SYSTEM_INSTRUCTION, TEMPERATURE
from app.schemas import ChatMessage

def _to_langchain_messages(messages: list[ChatMessage]):
    langMsg = [SystemMessage(content=SYSTEM_INSTRUCTION)]
    for message in messages:
        if message.role == "user":
            langMsg.append(HumanMessage(content=message.text))
        else:
            langMsg.append(AIMessage(content=message.text))
    return langMsg

def stream_chat_response(messages: list[ChatMessage]):
    llm = ChatGoogleGenerativeAI(
        model=MODEL_NAME,
        temperature=TEMPERATURE,
    )
    stream_iterator = llm.stream(_to_langchain_messages(messages))
    for chunk in stream_iterator:

        content = chunk.content
        
        if isinstance(content, str):
            text = content
        elif isinstance(content, list):
            parts = []
            for item in content:
                if isinstance(item, dict) and item.get("type") == "text":
                    t = item.get("text")
                    if isinstance(t, str):
                        parts.append(t)
            text = "".join(parts)
        else:
            text = ""
        if text:
            yield text
