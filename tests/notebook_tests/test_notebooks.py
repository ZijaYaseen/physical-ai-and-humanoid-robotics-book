"""
Notebook Execution Tests for Physical AI & Humanoid Robotics Course

This module contains tests to verify that Jupyter notebooks execute correctly
and produce expected outputs within reasonable time limits.
"""

import unittest
import os
import subprocess
import time
import nbformat
from pathlib import Path


class TestNotebookExecution(unittest.TestCase):
    """Test class for notebook execution validation."""

    def setUp(self):
        """Set up test environment."""
        self.notebooks_dir = Path("notebooks")
        self.notebooks = list(self.notebooks_dir.glob("*.ipynb"))
        self.timeout = 1800  # 30 minutes timeout for each notebook

    def test_all_notebooks_exist(self):
        """Test that all expected notebooks exist."""
        expected_notebooks = [
            "chapter-01-ros2.ipynb",
            "chapter-02-simulation.ipynb",
            "chapter-03-isaac.ipynb",
            "chapter-04-vla.ipynb"
        ]

        for notebook_name in expected_notebooks:
            notebook_path = self.notebooks_dir / notebook_name
            self.assertTrue(notebook_path.exists(), f"Notebook {notebook_name} does not exist")

    def test_notebook_syntax(self):
        """Test that all notebooks have valid syntax."""
        for notebook_path in self.notebooks:
            with self.subTest(notebook=notebook_path.name):
                try:
                    with open(notebook_path, 'r', encoding='utf-8') as f:
                        nb = nbformat.read(f, as_version=4)
                    self.assertIsNotNone(nb, f"Could not parse notebook {notebook_path}")
                    self.assertGreater(len(nb.cells), 0, f"Notebook {notebook_path} has no cells")
                except Exception as e:
                    self.fail(f"Syntax error in notebook {notebook_path}: {e}")

    def execute_notebook(self, notebook_path):
        """Execute a notebook and return success status."""
        try:
            # Use nbconvert to execute the notebook
            result = subprocess.run([
                "jupyter", "nbconvert",
                "--to", "notebook",
                "--execute",
                f"--ExecutePreprocessor.timeout={self.timeout}",
                str(notebook_path)
            ], capture_output=True, text=True, timeout=self.timeout)

            return result.returncode == 0, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return False, "", "Notebook execution timed out"
        except Exception as e:
            return False, "", str(e)

    def test_chapter_01_ros2_execution(self):
        """Test execution of Chapter 1 ROS2 notebook."""
        notebook_path = self.notebooks_dir / "chapter-01-ros2.ipynb"
        if not notebook_path.exists():
            self.skipTest(f"Notebook {notebook_path} does not exist")

        success, stdout, stderr = self.execute_notebook(notebook_path)
        self.assertTrue(success, f"Chapter 1 notebook execution failed: {stderr}")

    def test_chapter_02_simulation_execution(self):
        """Test execution of Chapter 2 Simulation notebook."""
        notebook_path = self.notebooks_dir / "chapter-02-simulation.ipynb"
        if not notebook_path.exists():
            self.skipTest(f"Notebook {notebook_path} does not exist")

        success, stdout, stderr = self.execute_notebook(notebook_path)
        self.assertTrue(success, f"Chapter 2 notebook execution failed: {stderr}")

    def test_chapter_03_isaac_execution(self):
        """Test execution of Chapter 3 Isaac notebook."""
        notebook_path = self.notebooks_dir / "chapter-03-isaac.ipynb"
        if not notebook_path.exists():
            self.skipTest(f"Notebook {notebook_path} does not exist")

        success, stdout, stderr = self.execute_notebook(notebook_path)
        self.assertTrue(success, f"Chapter 3 notebook execution failed: {stderr}")

    def test_chapter_04_vla_execution(self):
        """Test execution of Chapter 4 VLA notebook."""
        notebook_path = self.notebooks_dir / "chapter-04-vla.ipynb"
        if not notebook_path.exists():
            self.skipTest(f"Notebook {notebook_path} does not exist")

        success, stdout, stderr = self.execute_notebook(notebook_path)
        self.assertTrue(success, f"Chapter 4 notebook execution failed: {stderr}")

    def test_notebook_execution_time(self):
        """Test that notebooks execute within time limits."""
        for notebook_path in self.notebooks:
            with self.subTest(notebook=notebook_path.name):
                start_time = time.time()
                success, stdout, stderr = self.execute_notebook(notebook_path)
                execution_time = time.time() - start_time

                # Check if execution time is within reasonable limits (30 minutes)
                self.assertLess(execution_time, self.timeout,
                              f"Notebook {notebook_path} took {execution_time:.2f}s to execute, exceeding {self.timeout}s limit")

                if success:
                    print(f"✓ {notebook_path.name} executed in {execution_time:.2f}s")


class TestDocusaurusBuild(unittest.TestCase):
    """Test class for Docusaurus documentation build validation."""

    def setUp(self):
        """Set up test environment."""
        self.docusaurus_dir = Path("docusaurus")

    def test_docusaurus_config_exists(self):
        """Test that Docusaurus configuration exists."""
        config_path = self.docusaurus_dir / "docusaurus.config.js"
        self.assertTrue(config_path.exists(), "Docusaurus config file does not exist")

    def test_docusaurus_sidebar_exists(self):
        """Test that Docusaurus sidebar configuration exists."""
        sidebar_path = self.docusaurus_dir / "sidebars.js"
        self.assertTrue(sidebar_path.exists(), "Docusaurus sidebar file does not exist")

    def test_docusaurus_docs_exist(self):
        """Test that required documentation files exist."""
        docs_dir = self.docusaurus_dir / "docs"
        required_docs = [
            "intro.md",
            "module-1-ros2.md",
            "module-2-simulation.md",
            "module-3-isaac.md",
            "module-4-vla.md",
            "hardware-cloud-options.md",
            "weekly-schedule.md",
            "setup-guide.md",
            "notebook-guide.md"
        ]

        for doc in required_docs:
            doc_path = docs_dir / doc
            self.assertTrue(doc_path.exists(), f"Required documentation file {doc} does not exist")


if __name__ == "__main__":
    # Run the tests
    unittest.main(verbosity=2)