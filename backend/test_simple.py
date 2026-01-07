#!/usr/bin/env python3
"""
Simple test server to isolate the issue
"""
import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient
import requests
import time

# Load environment
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a simple app for testing
simple_app = FastAPI(title="Simple Test API")

@simple_app.get("/")
async def simple_root():
    return {"message": "Simple test server", "status": "running"}

@simple_app.get("/health")
async def simple_health():
    return {"status": "healthy"}

print("Testing simple app with TestClient...")
try:
    client = TestClient(simple_app)
    response = client.get("/")
    print(f"Simple app root: {response.status_code}, {response.json()}")
except Exception as e:
    print(f"Simple app error: {e}")

print("\nTesting simple app with requests...")
# Start the server in a subprocess and test it
import subprocess
import signal
import os

# Create a temporary server file
temp_server_content = '''
from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Temp Test API")

@app.get("/")
async def root():
    return {"message": "Temp test server", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
'''

with open('temp_test_server.py', 'w') as f:
    f.write(temp_server_content)

print("Starting temporary test server on port 8001...")
# Start the temp server in background
server_process = subprocess.Popen(['python', 'temp_test_server.py'])

# Wait for server to start
time.sleep(3)

try:
    # Test the temp server
    temp_response = requests.get('http://127.0.0.1:8001/health')
    print(f"Temp server health: {temp_response.status_code}, {temp_response.json()}")
except Exception as e:
    print(f"Temp server error: {e}")
finally:
    # Clean up
    try:
        server_process.terminate()
        server_process.wait(timeout=5)
    except:
        try:
            server_process.kill()
        except:
            pass

    # Remove temp file
    try:
        os.remove('temp_test_server.py')
    except:
        pass

print("\nThe original app works with TestClient but not with HTTP requests.")
print("This suggests the issue is with uvicorn/server configuration, not the app logic.")