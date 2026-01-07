#!/usr/bin/env python3
"""
Debug script to test the server startup and identify issues
"""
import os
import sys
import logging
from dotenv import load_dotenv

# Load environment
load_dotenv()

# Set up logging to see what's happening
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

print("Starting debug server test...")

try:
    # Import the main app
    from main import app
    print("SUCCESS: Successfully imported main app")

    # Import and check the router
    from server import router, is_initialized, rag_service
    print(f"SUCCESS: Router imported, is_initialized: {is_initialized}")
    print(f"SUCCESS: RAG service: {rag_service is not None}")

    # Check the environment variables
    gemini_key = os.getenv("GEMINI_KEY")
    chat_model = os.getenv("CHAT_MODEL", "gemini-2.5-flash")
    print(f"SUCCESS: GEMINI_KEY present: {bool(gemini_key)}")
    print(f"SUCCESS: CHAT_MODEL: {chat_model}")

    # Test FastAPI test client
    from fastapi.testclient import TestClient
    client = TestClient(app)

    print("\nTesting endpoints with TestClient:")

    # Test root
    root_response = client.get("/")
    print(f"Root endpoint: {root_response.status_code}")
    if root_response.status_code == 200:
        print(f"  Response: {root_response.json()}")
    else:
        print(f"  Error: {root_response.text}")

    # Test health
    health_response = client.get("/health")
    print(f"Health endpoint: {health_response.status_code}")
    if health_response.status_code == 200:
        print(f"  Response: {health_response.json()}")
    else:
        print(f"  Error: {health_response.text}")

    # Test API query
    query_data = {"query": "what is ros2?", "mode": "augment"}
    query_response = client.post("/api/query", json=query_data)
    print(f"Query endpoint: {query_response.status_code}")
    if query_response.status_code == 200:
        result = query_response.json()
        print(f"  Answer: {result['answer'][:100]}...")
        print(f"  Retrieved: {len(result['retrieved'])} chunks")
    else:
        print(f"  Error: {query_response.text}")

except Exception as e:
    print(f"ERROR: Error during testing: {e}")
    import traceback
    traceback.print_exc()