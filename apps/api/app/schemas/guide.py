from __future__ import annotations
from typing import Optional
from datetime import date

from pydantic import BaseModel, ConfigDict


class CategoryRead(BaseModel):
    slug: str
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GuideStepRead(BaseModel):
    order: int
    title: str
    body: str

    model_config = ConfigDict(from_attributes=True)


class GlossaryTermRead(BaseModel):
    term: str
    definition: str

    model_config = ConfigDict(from_attributes=True)


class GuideListItem(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    category: str
    audience: str
    difficulty: str
    estimatedMinutes: int
    lastUpdated: date
    tags: list[str]


class GuideRead(GuideListItem):
    steps: list[GuideStepRead]
    glossary: list[GlossaryTermRead]

