from __future__ import annotations
from typing import Optional
from datetime import datetime

from sqlalchemy import DateTime, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Resource(Base):
    __tablename__ = "resources"
    __table_args__ = (UniqueConstraint("source_type", "url"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    source_type: Mapped[str] = mapped_column(String(40), index=True)
    name: Mapped[str] = mapped_column(String(240), index=True)
    url: Mapped[str] = mapped_column(Text)
    category: Mapped[Optional[str]] = mapped_column(String(160), index=True)
    why_useful: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

