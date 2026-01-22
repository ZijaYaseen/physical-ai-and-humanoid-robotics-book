"""
Hugging Face Spaces App for RAG Backend
This file serves as the entry point for Hugging Face deployment
"""
import os
from backend.main import app
from backend.server import initialize_app

# Initialize the app when the module is loaded
initialize_app()

# The app instance will be picked up by the Hugging Face Spaces runtime
# Make sure the FastAPI app is available as 'app'
if __name__ == "__main__":
    import uvicorn
    # Hugging Face Spaces sets the PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)