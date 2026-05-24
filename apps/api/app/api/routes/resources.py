from __future__ import annotations
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Resource
from app.schemas.resource import ResourceRead

router = APIRouter(prefix="/resources", tags=["resources"])


def serialize_resource(resource: Resource) -> ResourceRead:
    return ResourceRead(
        id=resource.id,
        sourceType=resource.source_type,
        name=resource.name,
        url=resource.url,
        category=resource.category,
        whyUseful=resource.why_useful,
    )


@router.get("", response_model=list[ResourceRead])
def list_resources(
    source_type: Optional[str] = Query(default=None, pattern="^(website|youtube)$"),
    category: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[ResourceRead]:
    stmt = select(Resource).order_by(Resource.name).limit(limit)
    if source_type:
        stmt = stmt.where(Resource.source_type == source_type)
    if category:
        stmt = stmt.where(Resource.category.ilike(f"%{category}%"))
    if q:
        needle = f"%{q}%"
        stmt = stmt.where(or_(Resource.name.ilike(needle), Resource.category.ilike(needle), Resource.why_useful.ilike(needle)))
    return [serialize_resource(resource) for resource in db.scalars(stmt)]

