"""
Hugging Face Space App for RAG Backend
This creates a Gradio interface that wraps your FastAPI backend
"""
import os
import requests
import json
from datetime import datetime
import gradio as gr
from fastapi import FastAPI
from backend.main import app as backend_app
import uvicorn
import threading
import time

# Start the backend server in a separate thread
def start_backend():
    uvicorn.run(backend_app, host="127.0.0.1", port=8000, log_level="info")

# Start backend in background thread
backend_thread = threading.Thread(target=start_backend, daemon=True)
backend_thread.start()

# Give the backend a moment to start
time.sleep(2)

def query_rag_interface(query: str, mode: str = "augment", top_k: int = 5):
    """
    Interface function that calls your RAG backend
    """
    try:
        # Call your backend API
        payload = {
            "query": query,
            "mode": mode,
            "top_k": int(top_k),
            "session_id": "hf_space_session"  # Static session for demo
        }

        response = requests.post(
            "http://127.0.0.1:8000/api/query",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            answer = result.get("answer", "No answer received")

            # Format retrieved sources
            sources = []
            for chunk in result.get("retrieved", []):
                sources.append(f"📄 {chunk.get('page_title', 'Unknown')} - {chunk.get('source_path', '')}")

            sources_text = "\n".join(sources) if sources else "No sources retrieved"

            return answer, sources_text, f"✅ Query processed successfully"
        else:
            return f"❌ Error: {response.status_code}", "", f"❌ Error: {response.text}"

    except Exception as e:
        return f"❌ Exception occurred: {str(e)}", "", f"❌ Exception: {str(e)}"

def health_check():
    """
    Health check function
    """
    try:
        response = requests.get("http://127.0.0.1:8000/api/health", timeout=10)
        if response.status_code == 200:
            return "🟢 Backend is healthy", "✅ Health check passed"
        else:
            return "🔴 Backend is unhealthy", f"❌ Health check failed: {response.status_code}"
    except Exception as e:
        return "🔴 Backend is unreachable", f"❌ Health check failed: {str(e)}"

# Create Gradio interface
with gr.Blocks(title="Physical AI & Humanoid Robotics RAG") as demo:
    gr.Markdown("# 🤖 Physical AI & Humanoid Robotics RAG System")
    gr.Markdown("Ask questions about the Physical AI & Humanoid Robotics course content")

    with gr.Row():
        with gr.Column():
            query_input = gr.Textbox(
                label="Your Question",
                placeholder="Enter your question about the course...",
                lines=3
            )
            mode_selector = gr.Radio(
                choices=["augment", "strict"],
                value="augment",
                label="Mode"
            )
            top_k_slider = gr.Slider(
                minimum=1,
                maximum=10,
                value=5,
                step=1,
                label="Top K Results"
            )
            submit_btn = gr.Button("Submit Question", variant="primary")

        with gr.Column():
            status_output = gr.Textbox(label="Status", interactive=False)
            health_btn = gr.Button("Check Health")
            health_status = gr.Textbox(label="Health Status", interactive=False)

    answer_output = gr.Textbox(label="Answer", interactive=False, lines=8)
    sources_output = gr.Textbox(label="Sources", interactive=False, lines=5)

    # Event handlers
    submit_btn.click(
        fn=query_rag_interface,
        inputs=[query_input, mode_selector, top_k_slider],
        outputs=[answer_output, sources_output, status_output]
    )

    health_btn.click(
        fn=health_check,
        inputs=[],
        outputs=[health_status, status_output]
    )

    # Example questions
    gr.Examples(
        examples=[
            ["What is ROS 2?"],
            ["Explain NVIDIA Isaac platform"],
            ["Tell me about Vision Language Action models"],
            ["What are the key components of the Physical AI course?"]
        ],
        inputs=[query_input]
    )

# This allows the app to run on Hugging Face Spaces
def run_app():
    # Launch the Gradio interface
    demo.launch(server_name="0.0.0.0", server_port=int(os.getenv("PORT", 7860)))

if __name__ == "__main__":
    run_app()