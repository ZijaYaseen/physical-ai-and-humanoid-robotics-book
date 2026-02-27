"""
Hugging Face Spaces Entry Point
This file imports the main FastAPI app for HF Spaces deployment
"""

from main import app

if __name__ == "__main__":
    import uvicorn
    import os
    # HF Spaces uses PORT environment variable
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
