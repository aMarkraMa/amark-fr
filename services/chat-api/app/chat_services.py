from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import LLM_MODEL_NAME, SYSTEM_INSTRUCTION, TEMPERATURE
from app.schemas import ChatMessage
from app.rag.retrieve import retrieve_context

def _to_langchain_messages(messages: list[ChatMessage]):
    langMsg = [SystemMessage(content=SYSTEM_INSTRUCTION)]
    for message in messages:
        if message.role == "user":
            langMsg.append(HumanMessage(content=message.text))
        else:
            langMsg.append(AIMessage(content=message.text))
    return langMsg


def _build_system_instruction(user_query: str) -> str:
    contexts = retrieve_context(user_query)
    if not contexts:
        return SYSTEM_INSTRUCTION

    context_text = "\n\n".join(
        f"[{index}] {text}" for index, text in enumerate(contexts, start=1)
    )
    return (
        f"{SYSTEM_INSTRUCTION}\n\n"
        "Use the following personal knowledge context when answering.\n"
        "If context is insufficient, say you do not know.\n\n"
        f"Context:\n{context_text}"
    )


def _to_langchain_messages_with_rag(messages: list[ChatMessage]):
    latest_user_query = ""
    for message in reversed(messages):
        if message.role == "user":
            latest_user_query = message.text
            break

    system_instruction = _build_system_instruction(latest_user_query)
    lang_msg = [SystemMessage(content=system_instruction)]
    for message in messages:
        if message.role == "user":
            lang_msg.append(HumanMessage(content=message.text))
        else:
            lang_msg.append(AIMessage(content=message.text))
    return lang_msg

def stream_chat_response(messages: list[ChatMessage]):
    llm = ChatGoogleGenerativeAI(
        model=LLM_MODEL_NAME,
        temperature=TEMPERATURE,
    )
    stream_iterator = llm.stream(_to_langchain_messages_with_rag(messages))
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
