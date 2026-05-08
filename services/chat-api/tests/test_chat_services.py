from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from app.chat_services import _to_langchain_messages_with_rag, stream_chat_response
from app.config import MAX_MESSAGES_SIZE
from app.schemas import ChatMessage


class _FakeChunk:
    def __init__(self, content):
        self.content = content


def test_to_langchain_messages_with_rag_builds_system_and_role_mapping(monkeypatch):
    monkeypatch.setattr(
        "app.chat_services.retrieve_context",
        lambda _query: ["context A", "context B"],
    )
    messages = [
        ChatMessage(role="user", text="hello"),
        ChatMessage(role="model", text="hi there"),
        ChatMessage(role="user", text="tell me more"),
    ]

    lang_messages = _to_langchain_messages_with_rag(messages)

    assert isinstance(lang_messages[0], SystemMessage)
    assert "Context:" in lang_messages[0].content
    assert "[1] context A" in lang_messages[0].content
    assert "[2] context B" in lang_messages[0].content
    assert isinstance(lang_messages[1], HumanMessage)
    assert isinstance(lang_messages[2], AIMessage)
    assert isinstance(lang_messages[3], HumanMessage)


def test_stream_chat_response_parses_supported_chunk_shapes(monkeypatch):
    monkeypatch.setattr("app.chat_services.retrieve_context", lambda _query: [])

    class _FakeLLM:
        def stream(self, _messages):
            yield _FakeChunk("Hello")
            yield _FakeChunk(
                [
                    {"type": "text", "text": ", world"},
                    {"type": "image_url", "image_url": "ignored"},
                    {"type": "text", "text": "!"},
                ]
            )
            yield _FakeChunk([])
            yield _FakeChunk({"type": "text", "text": "ignored-dict"})
            yield _FakeChunk(None)

    monkeypatch.setattr("app.chat_services.LLM_SINGLETON", _FakeLLM())

    result = list(stream_chat_response([ChatMessage(role="user", text="hello")]))

    assert result == ["Hello", ", world!"]


def test_stream_chat_response_limits_messages_to_max_size(monkeypatch):
    monkeypatch.setattr("app.chat_services.retrieve_context", lambda _query: [])
    captured_messages = []

    class _CaptureLLM:
        def stream(self, messages):
            captured_messages.extend(messages)
            yield _FakeChunk("ok")

    monkeypatch.setattr("app.chat_services.LLM_SINGLETON", _CaptureLLM())

    oversize_messages = []
    for i in range(MAX_MESSAGES_SIZE + 3):
        role = "user" if i % 2 == 0 else "model"
        oversize_messages.append(ChatMessage(role=role, text=f"m{i}"))

    result = list(stream_chat_response(oversize_messages))

    assert result == ["ok"]
    assert len(captured_messages) == 1 + MAX_MESSAGES_SIZE
    assert isinstance(captured_messages[0], SystemMessage)

    expected_tail = oversize_messages[-MAX_MESSAGES_SIZE:]
    converted_tail = captured_messages[1:]
    for src, converted in zip(expected_tail, converted_tail, strict=True):
        if src.role == "user":
            assert isinstance(converted, HumanMessage)
        else:
            assert isinstance(converted, AIMessage)
        assert converted.content == src.text