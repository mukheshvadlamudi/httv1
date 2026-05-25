from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ResourceRead(BaseModel):
    id: int
    sourceType: str
    sourceIndex: Optional[int] = None
    name: str
    url: str
    category: Optional[str] = None
    whyUseful: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

