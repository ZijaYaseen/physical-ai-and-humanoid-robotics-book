import os
from dotenv import load_dotenv
import qdrant_client
from qdrant_client.http import models

# Load environment variables
load_dotenv()

# Initialize Qdrant client
qdrant_client_instance = qdrant_client.QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

collection_name = "book_chunks"

try:
    # Delete the existing collection
    qdrant_client_instance.delete_collection(collection_name)
    print(f"Collection '{collection_name}' deleted successfully")
except Exception as e:
    print(f"Error deleting collection: {e}")

# Create collection with correct dimensions for text-embedding-004 (768 dimensions)
try:
    qdrant_client_instance.create_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(size=768, distance=models.Distance.COSINE)  # text-embedding-004
    )
    print(f"Collection '{collection_name}' created successfully with 768 dimensions")
except Exception as e:
    print(f"Error creating collection: {e}")