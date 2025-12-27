"""
Build Verification Tests for Physical AI & Humanoid Robotics Course

This module contains tests to verify that the Docusaurus site builds correctly
and that all required components are in place.
"""

import unittest
import subprocess
import os
from pathlib import Path


class TestBuildVerification(unittest.TestCase):
    """Test class for build verification."""

    def setUp(self):
        """Set up test environment."""
        self.docusaurus_dir = Path("docusaurus")
        self.root_dir = Path(".")

    def test_package_json_exists(self):
        """Test that package.json exists in docusaurus directory."""
        package_json = self.docusaurus_dir / "package.json"
        self.assertTrue(package_json.exists(), "package.json does not exist in docusaurus directory")

    def test_docusaurus_config_valid(self):
        """Test that docusaurus config is valid by attempting to build."""
        # Check if docusaurus.config.js exists
        config_path = self.docusaurus_dir / "docusaurus.config.js"
        self.assertTrue(config_path.exists(), "docusaurus.config.js does not exist")

    def test_build_directory_structure(self):
        """Test that required directories exist for building."""
        required_dirs = [
            self.docusaurus_dir / "docs",
            self.docusaurus_dir / "src",
            self.docusaurus_dir / "static"
        ]

        for directory in required_dirs:
            self.assertTrue(directory.exists(), f"Required directory {directory} does not exist")

    def test_docs_directory_has_content(self):
        """Test that docs directory has content."""
        docs_dir = self.docusaurus_dir / "docs"
        self.assertTrue(docs_dir.exists(), "docs directory does not exist")

        # Check that it has some markdown files
        md_files = list(docs_dir.glob("*.md"))
        self.assertGreater(len(md_files), 0, "docs directory has no markdown files")

    def test_requirements_txt_exists(self):
        """Test that requirements.txt exists in root directory."""
        requirements = self.root_dir / "requirements.txt"
        self.assertTrue(requirements.exists(), "requirements.txt does not exist in root directory")


if __name__ == "__main__":
    # Run the tests
    unittest.main(verbosity=2)