from pydantic import BaseModel, Field


class AiQuestionCreate(BaseModel):
    question: str = Field(min_length=3, max_length=1000)


class AiQuestionAnswer(BaseModel):
    id: str
    answer: str
    relatedGuideSlugs: list[str]
    sources: list[str]

