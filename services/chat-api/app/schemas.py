from typing import Literal

from pydantic import BaseModel, Field, model_validator


class ChatMessage(BaseModel):
    role: Literal["user", "model"] = Field(
        ..., description="Who sent this message"
    )
    text: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(
        ..., min_length=1, description="Conversation history + latest user input"
    )

    @model_validator(mode="after")
    def drop_empty_messages(self) -> "ChatRequest":
        kept = [m for m in self.messages if m.text.strip()]
        if not kept:
            raise ValueError("At least one message must have non-empty text.")
        return self.model_copy(update={"messages": kept})
