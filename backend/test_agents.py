#!/usr/bin/env python3
"""
Test script to check if there are issues with the agents library initialization
"""
import os
from dotenv import load_dotenv
load_dotenv()

# Test the agents library imports
try:
    from agents import (
        Agent,
        AsyncOpenAI,
        OpenAIChatCompletionsModel,
        Runner,
        set_tracing_disabled,
    )
    print("SUCCESS: Agents library imports work correctly")
except ImportError as e:
    print(f"ERROR: Import error: {e}")
    exit(1)

# Test the initialization process
try:
    set_tracing_disabled(disabled=True)
    print("SUCCESS: set_tracing_disabled works")

    GEMINI_API_KEY = os.getenv("GEMINI_KEY")
    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_KEY not found in environment")
        exit(1)
    else:
        print("SUCCESS: GEMINI_KEY found in environment")

    external_client = AsyncOpenAI(
        api_key=GEMINI_API_KEY,
        base_url=os.getenv("OPENAI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/"),
    )
    print("SUCCESS: AsyncOpenAI client created successfully")

    model = OpenAIChatCompletionsModel(
        model="gemini-2.0-flash",
        openai_client=external_client,
    )
    print("SUCCESS: OpenAIChatCompletionsModel created successfully")

    # Define a simple agent
    rag_agent = Agent(
        name="Book Assistant",
        instructions="You are a helpful assistant for the Physical AI & Humanoid Robotics course book.",
        model=model,
    )
    print("SUCCESS: Agent created successfully")

    print("SUCCESS: All initialization tests passed!")

except Exception as e:
    print(f"ERROR: Error during initialization: {e}")
    import traceback
    traceback.print_exc()
    exit(1)