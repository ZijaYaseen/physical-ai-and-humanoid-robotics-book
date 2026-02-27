# Physical AI & Humanoid Robotics Course Book

This repository contains the course book for Physical AI & Humanoid Robotics, built with Docusaurus.

## About

This comprehensive course book covers robotics, AI, and physical interaction concepts, including:
- ROS2 fundamentals
- Simulation environments
- Isaac modules
- Practical robotics applications

## Features

- Interactive documentation
- Code examples and notebooks
- Step-by-step tutorials
- Weekly schedule and setup guides
- RAG-powered AI assistant for personalized learning

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (copy `.env.example` to `.env` and fill in your values)

3. Start the frontend:
   ```bash
   npm run start
   ```

4. Build and run the backend with Docker:
   ```bash
   docker-compose up --build
   ```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# RAG Configuration
GEMINI_KEY=your-gemini-api-key
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
QDRANT_URL=your-qdrant-url
QDRANT_API_KEY=your-qdrant-api-key
CHAT_MODEL=gemini-2.5-flash
EMBEDDING_MODEL=text-embedding-004
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the frontend:
   ```bash
   npm run start
   ```

3. Build and run the backend with Docker Desktop:
   ```bash
   docker-compose up --build
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This site is automatically deployed to GitHub Pages at: https://zijayaseen.github.io/physical-ai-and-humanoid-robotics-book/

## Contributing

Feel free to contribute to this course book by submitting issues or pull requests.