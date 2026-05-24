from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    rating: str = Field(pattern="^(helpful|not_helpful|easy|confusing)$")
    comment: Optional[str] = Field(default=None, max_length=1000)


class FeedbackRead(BaseModel):
    ok: bool
    id: int

