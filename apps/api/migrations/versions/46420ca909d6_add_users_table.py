"""add_users_table

Revision ID: 46420ca909d6
Revises: 0001_initial
Create Date: 2026-05-24 22:06:41.146418
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '46420ca909d6'
down_revision = '0001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.alter_column('ai_answer_feedback', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text('now()'))
    op.drop_constraint('categories_slug_key', 'categories', type_='unique')
    op.drop_index('ix_categories_slug', table_name='categories')
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=True)
    op.alter_column('guide_feedback', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text('now()'))
    op.alter_column('guides', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text('now()'))
    op.drop_constraint('guides_slug_key', 'guides', type_='unique')
    op.drop_index('ix_guides_slug', table_name='guides')
    op.create_index(op.f('ix_guides_slug'), 'guides', ['slug'], unique=True)
    op.alter_column('resources', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text('now()'))
    op.drop_constraint('tags_slug_key', 'tags', type_='unique')
    op.drop_index('ix_tags_slug', table_name='tags')
    op.create_index(op.f('ix_tags_slug'), 'tags', ['slug'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_tags_slug'), table_name='tags')
    op.create_index('ix_tags_slug', 'tags', ['slug'], unique=False)
    op.create_unique_constraint('tags_slug_key', 'tags', ['slug'])
    op.alter_column('resources', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.drop_index(op.f('ix_guides_slug'), table_name='guides')
    op.create_index('ix_guides_slug', 'guides', ['slug'], unique=False)
    op.create_unique_constraint('guides_slug_key', 'guides', ['slug'])
    op.alter_column('guides', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.alter_column('guide_feedback', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.drop_index(op.f('ix_categories_slug'), table_name='categories')
    op.create_index('ix_categories_slug', 'categories', ['slug'], unique=False)
    op.create_unique_constraint('categories_slug_key', 'categories', ['slug'])
    op.alter_column('ai_answer_feedback', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
