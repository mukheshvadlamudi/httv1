from datetime import date, datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Table, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

guide_tags = Table(
    "guide_tags",
    Base.metadata,
    Column("guide_id", ForeignKey("guides.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    description: Mapped[str | None] = mapped_column(Text)

    guides: Mapped[list["Guide"]] = relationship(back_populates="category")


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)


class Guide(Base):
    __tablename__ = "guides"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(240))
    description: Mapped[str] = mapped_column(Text)
    audience: Mapped[str] = mapped_column(String(80), default="Beginner")
    difficulty: Mapped[str] = mapped_column(String(40), default="Easy")
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=5)
    last_updated: Mapped[date] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    category: Mapped[Category] = relationship(back_populates="guides")
    steps: Mapped[list["GuideStep"]] = relationship(
        back_populates="guide", cascade="all, delete-orphan", order_by="GuideStep.order"
    )
    glossary: Mapped[list["GlossaryTerm"]] = relationship(back_populates="guide", cascade="all, delete-orphan")
    tags: Mapped[list[Tag]] = relationship(secondary=guide_tags)


class GuideStep(Base):
    __tablename__ = "guide_steps"
    __table_args__ = (UniqueConstraint("guide_id", "order"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    guide_id: Mapped[int] = mapped_column(ForeignKey("guides.id", ondelete="CASCADE"))
    order: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(180))
    body: Mapped[str] = mapped_column(Text)

    guide: Mapped[Guide] = relationship(back_populates="steps")


class GlossaryTerm(Base):
    __tablename__ = "glossary_terms"

    id: Mapped[int] = mapped_column(primary_key=True)
    guide_id: Mapped[int] = mapped_column(ForeignKey("guides.id", ondelete="CASCADE"))
    term: Mapped[str] = mapped_column(String(160))
    definition: Mapped[str] = mapped_column(Text)

    guide: Mapped[Guide] = relationship(back_populates="glossary")


class GuideEmbedding(Base):
    __tablename__ = "guide_embeddings"

    id: Mapped[int] = mapped_column(primary_key=True)
    guide_id: Mapped[int] = mapped_column(ForeignKey("guides.id", ondelete="CASCADE"), unique=True)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(384))
