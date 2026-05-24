from __future__ import annotations
from uuid import uuid4

from fastapi import APIRouter, Depends
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Guide, Tag
from app.schemas.ai import AiQuestionAnswer, AiQuestionCreate

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/question", response_model=AiQuestionAnswer)
def ask_question(payload: AiQuestionCreate, db: Session = Depends(get_db)) -> AiQuestionAnswer:
    words = [word for word in payload.question.lower().split() if len(word) > 3]
    stmt = select(Guide).options(selectinload(Guide.steps), selectinload(Guide.tags)).order_by(Guide.title).limit(3)
    if words:
        clauses = []
        for word in words[:5]:
            needle = f"%{word}%"
            clauses.extend([Guide.title.ilike(needle), Guide.description.ilike(needle), Tag.name.ilike(needle)])
        stmt = stmt.outerjoin(Guide.tags).where(or_(*clauses)).limit(3)
    guides = list(db.scalars(stmt).unique())

    if guides:
        first = guides[0]
        first_steps = " ".join(f"{step.order}. {step.title}: {step.body}" for step in first.steps[:3])
        answer = (
            f"Here is a simple starting point: {first.description} "
            f"Try these steps first. {first_steps} "
            "If something looks risky or asks for passwords, stop and check the official app or website."
        )
    else:
        answer = (
            "I do not have an approved guide for that yet. Try asking with the product name and the action you want, "
            "like 'reset Gmail password' or 'join a Zoom meeting'."
        )

    return AiQuestionAnswer(
        id=str(uuid4()),
        answer=answer,
        relatedGuideSlugs=[guide.slug for guide in guides],
        sources=[guide.title for guide in guides],
    )

