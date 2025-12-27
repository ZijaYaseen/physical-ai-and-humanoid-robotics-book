#!/usr/bin/env python3
"""
Plagiarism Detection Script for Physical AI & Humanoid Robotics Course Book

This script checks for potential plagiarism in course content by:
1. Checking for duplicate content within the course materials
2. Verifying proper citations for external content
3. Identifying potentially unoriginal content that needs review
"""

import os
import sys
import hashlib
import re
from pathlib import Path
from typing import List, Dict, Tuple
import argparse


def calculate_file_hash(filepath: Path) -> str:
    """Calculate SHA256 hash of a file's content."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        return hashlib.sha256(content.encode('utf-8')).hexdigest()


def find_duplicate_content(directory: Path, extensions: List[str]) -> Dict[str, List[Path]]:
    """Find files with identical content within the directory."""
    content_hashes = {}
    duplicates = {}

    for ext in extensions:
        for file_path in directory.rglob(f'*.{ext}'):
            if file_path.is_file():
                try:
                    file_hash = calculate_file_hash(file_path)
                    if file_hash in content_hashes:
                        if file_hash not in duplicates:
                            duplicates[file_hash] = []
                        duplicates[file_hash].append(content_hashes[file_hash])
                        duplicates[file_hash].append(file_path)
                    else:
                        content_hashes[file_hash] = file_path
                except Exception as e:
                    print(f"Warning: Could not process {file_path}: {e}")

    return duplicates


def check_citations_in_file(filepath: Path) -> List[Tuple[int, str]]:
    """Check for proper citations in a markdown file."""
    citations = []
    required_citation_patterns = [
        r'\[.*?\]\(.*?\)',  # Markdown links
        r'@.*?\[.*?\]',     # LaTeX-style citations
        r'\\cite\{.*?\}',   # LaTeX cite commands
        r'\(.*?et al\.?\)', # Author et al. references
    ]

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        for i, line in enumerate(lines, 1):
            for pattern in required_citation_patterns:
                if re.search(pattern, line):
                    citations.append((i, line.strip()))
    except Exception as e:
        print(f"Warning: Could not check citations in {filepath}: {e}")

    return citations


def check_originality_heuristics(filepath: Path) -> List[Tuple[int, str, str]]:
    """Apply heuristics to identify potentially non-original content."""
    issues = []

    # Patterns that might indicate copied content without attribution
    suspicious_patterns = [
        (r'^\s*The\s+\w+\s+is\s+(a|an)', "Potential copied introductory text"),
        (r'^\s*In\s+this\s+section', "Potential template/copy text"),
        (r'^\s*First,\s+we', "Potential template/copy text"),
        (r'^\s*There\s+are\s+several', "Potential template/copy text"),
    ]

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        for i, line in enumerate(lines, 1):
            for pattern, description in suspicious_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    issues.append((i, line.strip(), description))
    except Exception as e:
        print(f"Warning: Could not check originality in {filepath}: {e}")

    return issues


def check_license_headers(directory: Path) -> List[Path]:
    """Check for proper license headers in source files."""
    license_issues = []
    required_header = "MIT License"

    for file_path in directory.rglob('*.py'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read(200)  # Read first 200 characters

            if required_header.lower() not in content.lower():
                license_issues.append(file_path)
        except Exception as e:
            print(f"Warning: Could not check license header in {file_path}: {e}")

    return license_issues


def main():
    parser = argparse.ArgumentParser(description='Plagiarism Detection Script for Course Content')
    parser.add_argument('directory', type=str, help='Directory to scan for potential plagiarism')
    parser.add_argument('--extensions', nargs='+', default=['md', 'ipynb', 'py', 'txt'],
                       help='File extensions to check (default: md ipynb py txt)')
    parser.add_argument('--verbose', action='store_true', help='Show detailed output')

    args = parser.parse_args()

    directory = Path(args.directory)
    if not directory.exists():
        print(f"Error: Directory {directory} does not exist")
        sys.exit(1)

    print(f"Starting plagiarism check in {directory}")
    print("="*60)

    # Check for duplicate content
    print("1. Checking for duplicate content...")
    duplicates = find_duplicate_content(directory, args.extensions)
    if duplicates:
        print(f"   Found {len(duplicates)} sets of duplicate content:")
        for content_hash, files in duplicates.items():
            print(f"     Files with same content: {', '.join([str(f) for f in files])}")
    else:
        print("   No duplicate content found within the course materials.")

    print()

    # Check citations in markdown files
    print("2. Checking for citations in documentation...")
    citation_issues = 0
    for md_file in directory.rglob('*.md'):
        citations = check_citations_in_file(md_file)
        if citations and args.verbose:
            print(f"   Found {len(citations)} citations in {md_file}:")
            for line_num, content in citations[:3]:  # Show first 3 citations
                print(f"     Line {line_num}: {content[:60]}...")
        elif not citations:
            citation_issues += 1
            if args.verbose:
                print(f"   No citations found in {md_file}")

    if citation_issues > 0 and args.verbose:
        print(f"   Found {citation_issues} files without citations that may need review.")
    else:
        print(f"   Citations found in documentation files.")

    print()

    # Check originality heuristics
    print("3. Checking for originality using heuristics...")
    originality_issues = 0
    for ext in args.extensions:
        for file_path in directory.rglob(f'*.{ext}'):
            if file_path.is_file():
                issues = check_originality_heuristics(file_path)
                if issues:
                    originality_issues += len(issues)
                    if args.verbose:
                        print(f"   Potential issues in {file_path}:")
                        for line_num, content, description in issues[:3]:  # Show first 3 issues
                            print(f"     Line {line_num}: {description}")
                            print(f"       Content: {content[:60]}...")

    if originality_issues > 0:
        print(f"   Found {originality_issues} potential originality issues that need review.")
    else:
        print("   No obvious originality issues detected with heuristics.")

    print()

    # Check license headers in code files
    print("4. Checking for license headers in code files...")
    license_issues = check_license_headers(directory)
    if license_issues:
        print(f"   Found {len(license_issues)} code files without proper license headers:")
        for file_path in license_issues[:5]:  # Show first 5 issues
            print(f"     {file_path}")
        if len(license_issues) > 5:
            print(f"     ... and {len(license_issues) - 5} more")
    else:
        print("   All code files have proper license headers.")

    print()
    print("="*60)

    # Summary
    total_issues = len(duplicates) + citation_issues + originality_issues + len(license_issues)
    if total_issues == 0:
        print("✓ No plagiarism issues detected. Content appears to comply with zero-tolerance policy.")
        return 0
    else:
        print(f"⚠ Found {total_issues} potential issues that need review.")
        print("Please review the flagged content and ensure all material is original or properly cited.")
        return 1


if __name__ == "__main__":
    sys.exit(main())