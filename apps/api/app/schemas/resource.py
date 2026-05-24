from pydantic import BaseModel, ConfigDict


class ResourceRead(BaseModel):
    id: int
    sourceType: str
    name: str
    url: str
    category: str | None = None
    whyUseful: str | None = None

    model_config = ConfigDict(from_attributes=True)

