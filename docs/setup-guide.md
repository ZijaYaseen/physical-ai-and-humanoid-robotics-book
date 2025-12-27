---
sidebar_position: 9
---

# Setup Guide

## Overview

This guide will help you set up your development environment for the Physical AI & Humanoid Robotics course. The setup process varies depending on your hardware and cloud access, but we've designed the course to be accessible with different configurations.

## Prerequisites

### Basic Requirements
- **Operating System**: Linux (Ubuntu 20.04/22.04 recommended), Windows 10/11, or macOS
- **RAM**: 8GB minimum, 16GB+ recommended
- **Storage**: 50GB+ free space
- **Internet**: Broadband connection for initial setup

### Software Requirements
- **Git**: Version control system
- **Python**: 3.10 or higher
- **Node.js**: 18 or higher (for Docusaurus documentation)
- **Docker**: Optional, for containerized environments

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/physical-ai-and-humanoid-robotics.git
cd physical-ai-and-humanoid-robotics
```

### 2. Install Python Dependencies

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Install Node.js Dependencies (for Docusaurus)

```bash
cd docusaurus
npm install
cd ..
```

### 4. Verify Installation

```bash
# Check Python environment
python -c "import numpy, pandas, torch; print('Python environment OK')"

# Check Jupyter
jupyter --version
```

## Hardware-Specific Setup

### NVIDIA RTX Workstation Setup

If you have an NVIDIA RTX GPU, you can take advantage of CUDA acceleration:

```bash
# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Verify CUDA
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

### Jetson Platform Setup

For NVIDIA Jetson platforms, use the appropriate PyTorch installation:

```bash
# Jetson-specific PyTorch installation
pip install torch torchvision torchaudio --index-url https://nvidia.github.io/TensorRT/tl-build/torch-tensorrt/notebooks/pytorch_install.sh
```

## Cloud Setup Options

### Google Colab

For cloud-based access without local hardware requirements:

1. Upload the notebook files to Google Drive
2. Open with Google Colab
3. Install required packages in the notebook:

```python
!pip install -r requirements.txt
```

### AWS/GCP/Azure Instances

For dedicated cloud instances:

1. Launch GPU instance (recommended: p3, p4, or G2 instances)
2. Follow the standard installation steps above
3. Set up Jupyter notebook server with proper security settings

## Jupyter Notebook Setup

### Starting Jupyter

```bash
# From the project root
jupyter notebook
```

### Notebook Execution Tips

- Always run notebooks from the project root directory
- Use the provided virtual environment
- For notebooks requiring hardware, check for `--simulation` flags

## Docusaurus Documentation Setup

### Local Development Server

```bash
cd docusaurus
npm start
```

This will start a local development server at `http://localhost:3000`.

### Building Documentation

```bash
cd docusaurus
npm run build
```

## Testing Your Setup

### Run Basic Tests

```bash
# Python tests
python -c "import numpy, pandas, matplotlib, seaborn; print('Basic Python packages OK')"

# FastAPI demo
cd demo
python -c "import fastapi; print('FastAPI OK')"
cd ..
```

### Execute Sample Notebook

```bash
cd notebooks
jupyter nbconvert --to notebook --execute chapter-01-ros2.ipynb --ExecutePreprocessor.timeout=600
```

## Troubleshooting

### Common Issues

#### Python Package Installation

If you encounter issues with package installation:

```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install packages individually if needed
pip install numpy pandas matplotlib
```

#### Node.js Issues

If Docusaurus installation fails:

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### CUDA Issues

For CUDA-related problems:

```bash
# Check CUDA version
nvidia-smi

# Install appropriate PyTorch version
# Visit pytorch.org for the correct command for your CUDA version
```

### Performance Considerations

- For notebooks with 3D simulation, ensure adequate GPU memory
- Use `--simulation` mode if running on CPU-only systems
- Consider using smaller model variants for initial testing

## Optional Configurations

### IDE Setup

#### VS Code
- Install Python extension
- Install Jupyter extension
- Configure to use project virtual environment

#### PyCharm
- Configure interpreter to use virtual environment
- Enable Jupyter integration

### Environment Variables

Create a `.env` file in the project root:

```
OPENAI_API_KEY=your_key_here
CUDA_VISIBLE_DEVICES=0
```

## Verification Checklist

Before proceeding with the course, verify:

- [ ] Python virtual environment activated
- [ ] Jupyter notebook accessible
- [ ] Docusaurus documentation builds
- [ ] Basic Python packages import successfully
- [ ] Sample notebook executes (even in simulation mode)
- [ ] Git repository properly cloned

## Next Steps

Once your setup is complete, proceed to:
1. Read the [Course Introduction](./intro.md)
2. Review the [13-Week Schedule](./weekly-schedule.md)
3. Begin with [Module 1: ROS 2](./module-1-ros2.md)

## Support

If you encounter setup issues not covered here:
- Check the GitHub issues page
- Join our Discord community
- Contact the course staff during office hours