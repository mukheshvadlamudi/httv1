from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import AiAnswerFeedback, Guide, GuideFeedback
from app.schemas.feedback import FeedbackCreate, FeedbackRead

router = APIRouter(tags=["feedback"])


@router.post("/guides/{slug}/feedback", response_model=FeedbackRead, status_code=201)
def create_guide_feedback(slug: str, payload: FeedbackCreate, db: Session = Depends(get_db)) -> FeedbackRead:
    guide = db.scalar(select(Guide).where(Guide.slug == slug))
    if guide is None:
        raise HTTPException(status_code=404, detail="Guide not found")
    feedback = GuideFeedback(guide_id=guide.id, rating=payload.rating, comment=payload.comment)
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return FeedbackRead(ok=True, id=feedback.id)


@router.post("/ai/answers/{answer_id}/feedback", response_model=FeedbackRead, status_code=201)
def create_ai_feedback(answer_id: str, payload: FeedbackCreate, db: Session = Depends(get_db)) -> FeedbackRead:
    feedback = AiAnswerFeedback(answer_id=answer_id, rating=payload.rating, comment=payload.comment)
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return FeedbackRead(ok=True, id=feedback.id)

