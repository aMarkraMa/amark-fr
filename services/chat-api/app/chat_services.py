from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from app.config import LLM_MODEL_NAME, SYSTEM_INSTRUCTION, TEMPERATURE, MAX_MESSAGES_SIZE
from app.schemas import ChatMessage
from app.rag.retrieve import retrieve_context

LLM_SINGLETON = ChatOpenAI(
    model=LLM_MODEL_NAME,
    temperature=TEMPERATURE,
)

def _to_langchain_messages(messages: list[ChatMessage]):
    langMsg = [SystemMessage(content=SYSTEM_INSTRUCTION)]
    for message in messages:
        if message.role == "user":
            langMsg.append(HumanMessage(content=message.text))
        else:
            langMsg.append(AIMessage(content=message.text))
    return langMsg


def _build_system_instruction(user_query: str) -> str:
    if len(user_query) > 6:
        contexts = retrieve_context(user_query)
    else:
        contexts = ""
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
            latest_user_query = message.text.strip()
            break

    system_instruction = _build_system_instruction(latest_user_query)
    lang_msg = [SystemMessage(content=system_instruction)]
    for message in messages:
        content = message.text.strip()
        if not content:
            continue
        if message.role == "user":
            lang_msg.append(HumanMessage(content=content))
        else:
            lang_msg.append(AIMessage(content=content))
    return lang_msg

def stream_chat_response(messages: list[ChatMessage]):
    if messages and len(messages) > MAX_MESSAGES_SIZE:
        messages = messages[-MAX_MESSAGES_SIZE:]
    stream_iterator = LLM_SINGLETON.stream(_to_langchain_messages_with_rag(messages))
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
