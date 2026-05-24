from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Category, Guide, Tag
from app.schemas.guide import GuideListItem, GuideRead

router = APIRouter(prefix="/guides", tags=["guides"])


def serialize_guide_list_item(guide: Guide) -> GuideListItem:
    return GuideListItem(
        id=guide.slug,
        slug=guide.slug,
        title=guide.title,
        description=guide.description,
        category=guide.category.name,
        audience=guide.audience,
        difficulty=guide.difficulty,
        estimatedMinutes=guide.estimated_minutes,
        lastUpdated=guide.last_updated,
        tags=[tag.slug for tag in guide.tags],
    )


def serialize_guide(guide: Guide) -> GuideRead:
    base = {
        "id": guide.slug,
        "slug": guide.slug,
        "title": guide.title,
        "description": guide.description,
        "category": guide.category.name,
        "audience": guide.audience,
        "difficulty": guide.difficulty,
        "estimatedMinutes": guide.estimated_minutes,
        "lastUpdated": guide.last_updated,
        "tags": [tag.slug for tag in guide.tags],
    }
    return GuideRead(**base, steps=guide.steps, glossary=guide.glossary)


@router.get("", response_model=list[GuideListItem])
def list_guides(
    q: str | None = Query(default=None),
    category: str | None = Query(default=None),
    difficulty: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[GuideListItem]:
    stmt = (
        select(Guide)
        .join(Guide.category)
        .options(selectinload(Guide.category), selectinload(Guide.tags))
        .order_by(Guide.title)
    )
    if category:
        stmt = stmt.where(Category.slug == category)
    if difficulty:
        stmt = stmt.where(Guide.difficulty.ilike(difficulty))
    if q:
        needle = f"%{q}%"
        stmt = stmt.outerjoin(Guide.tags).where(
            or_(Guide.title.ilike(needle), Guide.description.ilike(needle), Tag.name.ilike(needle))
        )
    return [serialize_guide_list_item(guide) for guide in db.scalars(stmt).unique()]


@router.get("/{slug}", response_model=GuideRead)
def get_guide(slug: str, db: Session = Depends(get_db)) -> GuideRead:
    guide = db.scalar(
        select(Guide)
        .where(Guide.slug == slug)
        .options(
            selectinload(Guide.category),
            selectinload(Guide.steps),
            selectinload(Guide.glossary),
            selectinload(Guide.tags),
        )
    )
    if guide is None:
        raise HTTPException(status_code=404, detail="Guide not found")
    return serialize_guide(guide)

