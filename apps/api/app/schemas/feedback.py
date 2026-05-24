from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    rating: str = Field(pattern="^(helpful|not_helpful|easy|confusing)$")
    comment: str | None = Field(default=None, max_length=1000)


class FeedbackRead(BaseModel):
    ok: bool
    id: int

