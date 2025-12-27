# Research: Physical AI & Humanoid Robotics Course Book

## Decision: Technology Stack Selection
**Rationale**: Selected Docusaurus for documentation due to its excellent Markdown support, plugin ecosystem, and GitHub Pages integration. Jupyter notebooks for interactive learning as they're the standard for educational content in AI/robotics. FastAPI for the demo due to its performance and async capabilities.

## Decision: Module Structure
**Rationale**: Organized content into 4 modules (ROS 2, Simulation, NVIDIA Isaac, VLA) following the established curriculum structure. Each module includes theoretical content, practical notebooks, and exercises.

## Decision: Hardware vs Cloud Deployment
**Rationale**: Implemented dual-path approach with hardware-optimized code and cloud fallbacks to maximize accessibility. This ensures students without specialized hardware can still complete the course.

## Decision: License Selection
**Rationale**: MIT License chosen as it aligns with the open-source first principle while allowing both academic and commercial use with proper attribution.

## Decision: Plagiarism Policy
**Rationale**: Zero-tolerance policy with required citations ensures academic integrity and originality of content as specified in the project requirements.

## Decision: Deployment Strategy
**Rationale**: GitHub Pages as primary deployment target due to its seamless integration with GitHub Actions and cost-effectiveness for educational projects. Vercel as optional preview environment for development workflow.