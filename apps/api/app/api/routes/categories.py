from __future__ import annotations
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Category
from app.schemas.guide import CategoryRead

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)) -> list[Category]:
    return list(db.scalars(select(Category).order_by(Category.name)))

