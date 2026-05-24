FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy API application code
COPY apps/api/ .

# Copy database migrations (needed by alembic.ini → ../../database/migrations)
COPY database/ /database/

# Expose port
EXPOSE 8000

# Start: run migrations, seed, then start server
CMD alembic upgrade head && python -m app.seed && uvicorn main:app --host 0.0.0.0 --port 8000
