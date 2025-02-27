"""Initial migration

Revision ID: 1234567890ab
Revises: 
Create Date: 2025-02-26 20:16:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1234567890ab'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create app_user table
    op.create_table('app_user',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_superuser', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_app_user_email', 'app_user', ['email'], unique=True)
    
    # Create technology table
    op.create_table('technology',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('base_cost', sa.Integer(), nullable=False),
        sa.Column('effect_value', sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create business table
    op.create_table('business',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('product_type', sa.String(), nullable=False),
        sa.Column('currency', sa.Integer(), nullable=True),
        sa.Column('reputation', sa.Float(), nullable=True),
        sa.Column('click_power', sa.Float(), nullable=True),
        sa.Column('last_played_at', sa.DateTime(), nullable=True),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['app_user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create businesstechnology table
    op.create_table('businesstechnology',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('business_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('technology_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('level', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['business_id'], ['business.id'], ),
        sa.ForeignKeyConstraint(['technology_id'], ['technology.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create order table
    op.create_table('order',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('product_type', sa.String(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('reward', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('production_progress', sa.Float(), nullable=True),
        sa.Column('shipping_progress', sa.Float(), nullable=True),
        sa.Column('business_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['business.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create statistics table
    op.create_table('statistics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('total_orders_completed', sa.Integer(), nullable=True),
        sa.Column('total_currency_earned', sa.Integer(), nullable=True),
        sa.Column('total_clicks', sa.Integer(), nullable=True),
        sa.Column('business_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['business.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('statistics')
    op.drop_table('order')
    op.drop_table('businesstechnology')
    op.drop_table('business')
    op.drop_table('technology')
    op.drop_index('ix_app_user_email', table_name='app_user')
    op.drop_table('app_user')