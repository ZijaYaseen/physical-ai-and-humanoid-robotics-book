# ADR 001: Book Platform & Hosting - Docusaurus + GitHub Pages

**Status**: Accepted
**Date**: 2025-12-22

## Context

The project requires a complete educational book about Physical AI & Humanoid Robotics that can be deployed to a production website. The platform needs to support technical documentation, interactive elements, and be cost-effective for an educational project.

## Decision

We will use Docusaurus as the documentation platform with GitHub Pages for hosting. This provides excellent Markdown support, plugin ecosystem, and seamless integration with GitHub Actions for CI/CD.

## Alternatives Considered

- Static site generators (Gatsby, Hugo, Jekyll) with various hosting options
- Commercial documentation platforms (GitBook, Notion)
- Custom web application with React/Vue

## Consequences

**Positive**:
- Cost-effective hosting through GitHub Pages
- Excellent technical documentation features (search, versioning, etc.)
- Strong Markdown support for educational content
- Easy integration with GitHub workflow

**Negative**:
- Limited customization compared to custom solutions
- Potential performance constraints for very large documentation sets
- Dependency on GitHub ecosystem

## References

- plan.md: Technology Context and Project Structure sections
- research.md: Technology Stack Selection rationale