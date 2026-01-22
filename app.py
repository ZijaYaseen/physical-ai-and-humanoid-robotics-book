"""
Hugging Face Space App for Physical AI & Humanoid Robotics RAG System
This creates a Gradio interface for the RAG system
"""
import os
import requests
import json
from datetime import datetime
import gradio as gr

def query_rag_system(query: str, mode: str = "augment", top_k: int = 5):
    """
    Query the RAG system and return response with sources
    """
    # Use environment variables for backend URL, fallback to localhost
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")

    try:
        # Prepare the payload for the RAG system
        payload = {
            "query": query,
            "mode": mode,
            "top_k": int(top_k),
            "session_id": "hf_space_session_" + str(int(datetime.now().timestamp()))
        }

        # Make request to the backend API
        response = requests.post(
            f"{backend_url}/api/query",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()

            # Extract the answer and retrieved sources
            answer = result.get("answer", "No answer received from the system.")

            # Format the sources
            sources_list = []
            for chunk in result.get("retrieved", [])[:3]:  # Limit to first 3 sources
                source_info = {
                    "title": chunk.get("page_title", "Unknown Document"),
                    "path": chunk.get("source_path", ""),
                    "score": f"{chunk.get('score', 0):.2f}",
                    "preview": chunk.get("text", "")[:200] + "..."
                }
                sources_list.append(source_info)

            # Create formatted sources text
            if sources_list:
                sources_text = "### Sources:\n"
                for i, source in enumerate(sources_list, 1):
                    sources_text += f"**{i}. {source['title']}**\n"
                    sources_text += f"- Path: `{source['path']}`\n"
                    sources_text += f"- Relevance Score: {source['score']}\n"
                    sources_text += f"- Preview: {source['preview']}\n\n"
            else:
                sources_text = "No specific sources found for this query."

            status_msg = f"✅ Query processed successfully. Retrieved {len(result.get('retrieved', []))} sources."

            return answer, sources_text, status_msg

        else:
            error_msg = f"❌ API Error: {response.status_code}"
            if response.content:
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_detail = response.text[:200]
                    error_msg += f" - {error_detail}"
            return error_msg, "", error_msg

    except requests.exceptions.ConnectionError:
        return (
            "❌ Cannot connect to the backend service. Please make sure the backend is running and accessible.",
            "",
            "❌ Connection Error: Backend not accessible"
        )
    except requests.exceptions.Timeout:
        return (
            "⏰ Request timed out. The query took too long to process.",
            "",
            "⏰ Timeout Error"
        )
    except Exception as e:
        error_msg = f"❌ An error occurred: {str(e)}"
        return error_msg, "", error_msg

def health_check():
    """
    Check the health of the backend system
    """
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")

    try:
        response = requests.get(f"{backend_url}/api/health", timeout=10)
        if response.status_code == 200:
            health_data = response.json()
            return "🟢 System is healthy", f"✅ Health check passed: {json.dumps(health_data)}"
        else:
            return "🔴 Health check failed", f"❌ Health check failed with status: {response.status_code}"
    except Exception as e:
        return "🔴 System is unreachable", f"❌ Health check failed: {str(e)}"

# Create Gradio interface with enhanced UI
with gr.Blocks(
    title="Physical AI & Humanoid Robotics RAG System",
    theme=gr.themes.Default(primary_hue="blue", secondary_hue="slate")
) as demo:
    gr.Markdown(
        """
        # 🤖 Physical AI & Humanoid Robotics RAG System

        Welcome to the RAG (Retrieval-Augmented Generation) system for the Physical AI & Humanoid Robotics course!

        Ask questions about course content, and the system will retrieve relevant information and provide contextual answers.
        """
    )

    with gr.Tab("Query"):
        with gr.Row():
            with gr.Column(scale=2):
                query_input = gr.Textbox(
                    label="Your Question",
                    placeholder="Enter your question about the Physical AI & Humanoid Robotics course...",
                    lines=3,
                    max_lines=10
                )

                with gr.Row():
                    mode_selector = gr.Dropdown(
                        choices=["augment", "strict"],
                        value="augment",
                        label="Query Mode",
                        info="Augment: Uses full context | Strict: Uses only selected text"
                    )
                    top_k_slider = gr.Slider(
                        minimum=1,
                        maximum=10,
                        value=5,
                        step=1,
                        label="Number of Results",
                        info="How many relevant chunks to retrieve"
                    )

                submit_btn = gr.Button("Submit Question", variant="primary", size="lg")

                # Example questions
                gr.Examples(
                    examples=[
                        ["What is ROS 2 and how does it differ from ROS 1?"],
                        ["Explain the key components of NVIDIA Isaac platform"],
                        ["What are Vision Language Action (VLA) models and their applications?"],
                        ["Describe the simulation environments used in robotics development"],
                        ["What are the main modules covered in the Physical AI course?"]
                    ],
                    inputs=[query_input],
                    label="Try these example questions:"
                )

            with gr.Column(scale=1):
                status_output = gr.Textbox(
                    label="Status",
                    interactive=False,
                    show_copy_button=True
                )

                health_btn = gr.Button("Check System Health")
                health_status = gr.Textbox(
                    label="Health Status",
                    interactive=False,
                    show_copy_button=True
                )

        # Results
        answer_output = gr.Textbox(
            label="Answer",
            interactive=False,
            lines=10,
            show_copy_button=True
        )

        sources_output = gr.Markdown(
            label="Sources & Context",
            interactive=False
        )

    with gr.Tab("About"):
        gr.Markdown(
            """
            ## About This System

            This RAG (Retrieval-Augmented Generation) system is designed for the Physical AI & Humanoid Robotics course. It combines:

            - 🔍 **Vector Search**: Semantic search in course documentation
            - 🧠 **AI Reasoning**: Contextual answers using Gemini models
            - 📚 **Course Content**: All course materials from the documentation

            ### How It Works
            1. Your question is converted to an embedding
            2. The system searches for similar content in the course materials
            3. Relevant chunks are retrieved and provided as context
            4. An AI model generates a contextual response based on the retrieved information

            ### Technologies Used
            - **Backend**: FastAPI with Python
            - **Vector DB**: Qdrant for semantic search
            - **AI Models**: Google Gemini for embeddings and responses
            - **Frontend**: Gradio interface
            """
        )

    # Event handlers
    submit_btn.click(
        fn=query_rag_system,
        inputs=[query_input, mode_selector, top_k_slider],
        outputs=[answer_output, sources_output, status_output]
    )

    health_btn.click(
        fn=health_check,
        inputs=[],
        outputs=[health_status, status_output]
    )

# Launch the app
if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=int(os.getenv("PORT", 7860)),
        share=False  # Set to True if you want a public URL during development
    )