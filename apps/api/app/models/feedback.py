from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class GuideFeedback(Base):
    __tablename__ = "guide_feedback"

    id: Mapped[int] = mapped_column(primary_key=True)
    guide_id: Mapped[int] = mapped_column(ForeignKey("guides.id", ondelete="CASCADE"))
    rating: Mapped[str] = mapped_column(String(30))
    comment: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AiAnswerFeedback(Base):
    __tablename__ = "ai_answer_feedback"

    id: Mapped[int] = mapped_column(primary_key=True)
    answer_id: Mapped[str] = mapped_column(String(120), index=True)
    rating: Mapped[str] = mapped_column(String(30))
    comment: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

