# Quickstart Guide: Physical AI & Humanoid Robotics Course Book

## Prerequisites
- Python 3.10+
- Node.js 18+
- Git
- GitHub account

## Setup Development Environment

1. Clone the repository:
```bash
git clone <repo-url>
cd <repo-name>
```

2. Install Docusaurus dependencies:
```bash
cd docusaurus
npm install
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Run Docusaurus locally:
```bash
cd docusaurus
npm run start
```

5. Run Jupyter notebooks:
```bash
jupyter notebook
```

## Running the Demo
```bash
cd demo
python -m uvicorn main:app --reload
```

## Building for Production
```bash
cd docusaurus
npm run build
```

## Running Tests
```bash
# Notebook tests
pytest tests/notebook_tests/

# Demo tests
pytest tests/demo_tests/

# Build tests
npm run build
```