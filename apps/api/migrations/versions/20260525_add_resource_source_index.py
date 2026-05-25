"""add resource source index

Revision ID: 20260525_resource_source_index
Revises: 46420ca909d6
Create Date: 2026-05-25
"""
from alembic import op
import sqlalchemy as sa

revision = "20260525_resource_source_index"
down_revision = "46420ca909d6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("resources", sa.Column("source_index", sa.Integer(), nullable=True))
    op.create_index("ix_resources_source_index", "resources", ["source_index"])


def downgrade() -> None:
    op.drop_index("ix_resources_source_index", table_name="resources")
    op.drop_column("resources", "source_index")
