"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-24
"""
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(length=120), nullable=False, unique=True),
        sa.Column("name", sa.String(length=120), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
    )
    op.create_index("ix_categories_slug", "categories", ["slug"])
    op.create_table(
        "tags",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(length=120), nullable=False, unique=True),
        sa.Column("name", sa.String(length=120), nullable=False, unique=True),
    )
    op.create_index("ix_tags_slug", "tags", ["slug"])
    op.create_table(
        "guides",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(length=160), nullable=False, unique=True),
        sa.Column("title", sa.String(length=240), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("audience", sa.String(length=80), nullable=False),
        sa.Column("difficulty", sa.String(length=40), nullable=False),
        sa.Column("estimated_minutes", sa.Integer(), nullable=False),
        sa.Column("last_updated", sa.Date(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False),
    )
    op.create_index("ix_guides_slug", "guides", ["slug"])
    op.create_table(
        "guide_steps",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("guide_id", sa.Integer(), sa.ForeignKey("guides.id", ondelete="CASCADE"), nullable=False),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=180), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.UniqueConstraint("guide_id", "order"),
    )
    op.create_table(
        "glossary_terms",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("guide_id", sa.Integer(), sa.ForeignKey("guides.id", ondelete="CASCADE"), nullable=False),
        sa.Column("term", sa.String(length=160), nullable=False),
        sa.Column("definition", sa.Text(), nullable=False),
    )
    op.create_table(
        "guide_tags",
        sa.Column("guide_id", sa.Integer(), sa.ForeignKey("guides.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("tag_id", sa.Integer(), sa.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
    )
    op.create_table(
        "guide_embeddings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("guide_id", sa.Integer(), sa.ForeignKey("guides.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("embedding", Vector(384), nullable=True),
    )
    op.create_table(
        "resources",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_type", sa.String(length=40), nullable=False),
        sa.Column("name", sa.String(length=240), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=160), nullable=True),
        sa.Column("why_useful", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("source_type", "url"),
    )
    op.create_index("ix_resources_source_type", "resources", ["source_type"])
    op.create_index("ix_resources_name", "resources", ["name"])
    op.create_index("ix_resources_category", "resources", ["category"])
    op.create_table(
        "guide_feedback",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("guide_id", sa.Integer(), sa.ForeignKey("guides.id", ondelete="CASCADE"), nullable=False),
        sa.Column("rating", sa.String(length=30), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_table(
        "ai_answer_feedback",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("answer_id", sa.String(length=120), nullable=False),
        sa.Column("rating", sa.String(length=30), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_ai_answer_feedback_answer_id", "ai_answer_feedback", ["answer_id"])


def downgrade() -> None:
    op.drop_index("ix_ai_answer_feedback_answer_id", table_name="ai_answer_feedback")
    op.drop_table("ai_answer_feedback")
    op.drop_table("guide_feedback")
    op.drop_index("ix_resources_category", table_name="resources")
    op.drop_index("ix_resources_name", table_name="resources")
    op.drop_index("ix_resources_source_type", table_name="resources")
    op.drop_table("resources")
    op.drop_table("guide_embeddings")
    op.drop_table("guide_tags")
    op.drop_table("glossary_terms")
    op.drop_table("guide_steps")
    op.drop_index("ix_guides_slug", table_name="guides")
    op.drop_table("guides")
    op.drop_index("ix_tags_slug", table_name="tags")
    op.drop_table("tags")
    op.drop_index("ix_categories_slug", table_name="categories")
    op.drop_table("categories")
