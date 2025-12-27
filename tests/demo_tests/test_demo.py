"""
Demo Functionality Tests for Physical AI & Humanoid Robotics Course

This module contains tests to verify that the demo application works correctly.
"""

import unittest
import subprocess
import sys
from pathlib import Path


class TestDemoFunctionality(unittest.TestCase):
    """Test class for demo functionality."""

    def setUp(self):
        """Set up test environment."""
        self.demo_dir = Path("demo")
        self.main_py = self.demo_dir / "main.py"

    def test_demo_main_exists(self):
        """Test that the main demo file exists."""
        self.assertTrue(self.main_py.exists(), "demo/main.py does not exist")

    def test_demo_imports(self):
        """Test that demo can be imported without errors."""
        # Check if the file exists first
        if not self.main_py.exists():
            self.skipTest("demo/main.py does not exist")

        # Try importing the main module to check for basic syntax/import errors
        import sys
        import os

        # Add demo directory to Python path temporarily
        sys.path.insert(0, str(self.demo_dir.parent))

        try:
            # Attempt to import the main module
            import demo.main
            # If import succeeds, it means there are no basic syntax errors
            self.assertTrue(True, "Demo module imports successfully")
        except ImportError as e:
            self.fail(f"Demo module failed to import: {e}")
        except SyntaxError as e:
            self.fail(f"Demo module has syntax errors: {e}")
        finally:
            # Remove the directory from path
            if str(self.demo_dir.parent) in sys.path:
                sys.path.remove(str(self.demo_dir.parent))

    def test_fastapi_installed(self):
        """Test that FastAPI is available for the demo."""
        try:
            import fastapi
            self.assertTrue(hasattr(fastapi, 'FastAPI'), "FastAPI module is available")
        except ImportError:
            self.skipTest("FastAPI not installed, skipping FastAPI-specific tests")

    def test_demo_requirements_exist(self):
        """Test that demo requirements file exists."""
        requirements = self.demo_dir / "requirements.txt"
        self.assertTrue(requirements.exists(), "demo/requirements.txt does not exist")


if __name__ == "__main__":
    # Run the tests
    unittest.main(verbosity=2)