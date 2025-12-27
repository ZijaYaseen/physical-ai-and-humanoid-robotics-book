#!/bin/bash
#
# Script to deploy Docusaurus site to GitHub Pages
#

set -e  # Exit immediately if a command exits with a non-zero status

# Configuration
REPO_DIR="$(pwd)"
DOCUSAURUS_DIR="$REPO_DIR/docusaurus"
BUILD_DIR="$DOCUSAURUS_DIR/build"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository"
    exit 1
fi

# Check if docusaurus directory exists
if [ ! -d "$DOCUSAURUS_DIR" ]; then
    echo "Error: Docusaurus directory does not exist: $DOCUSAURUS_DIR"
    exit 1
fi

# Navigate to docusaurus directory
cd "$DOCUSAURUS_DIR"

# Install dependencies
echo "Installing Docusaurus dependencies..."
npm install

# Build the site
echo "Building Docusaurus site..."
npm run build

# Navigate back to repo root
cd "$REPO_DIR"

# Configure git for GitHub Pages deployment
git config --global user.name "${GITHUB_ACTOR:-github-actions[bot]}"
git config --global user.email "${GITHUB_ACTOR:-github-actions[bot]}@users.noreply.github.com"

# Deploy to GitHub Pages using docusaurus command
echo "Deploying to GitHub Pages..."
cd "$DOCUSAURUS_DIR"
npx docusaurus deploy

echo "Deployment completed successfully!"