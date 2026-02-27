# Hugging Face Spaces Dockerfile
FROM python:3.11-slim

# Create user (HF requirement)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Copy and install requirements
COPY --chown=user requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy application code
COPY --chown=user main.py .
COPY --chown=user server.py .
COPY --chown=user db_simple.py .
COPY --chown=user ingest_docs.py .

# HF Spaces listens on port 7860
EXPOSE 7860

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
