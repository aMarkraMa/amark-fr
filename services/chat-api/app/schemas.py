from typing import Literal
from pydantic import BaseModel, Field
from uuid import UUID 

class ChatMessage(BaseModel):
    role: Literal["user", "model"] = Field(
        ..., description="Who sent this message"
    )
    text: str = Field(..., min_length=1, description="Message content")


# a list of chat message
class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(
        ..., min_length=1, description="Conversation history + latest user input"
    )

