# ADR 003: Simulation & Robotics Stack - ROS 2, Gazebo/Unity, NVIDIA Isaac, VLA

**Status**: Accepted
**Date**: 2025-12-22

## Context

The course needs to cover core robotics technologies including ROS 2 for robotics middleware, simulation environments (Gazebo/Unity), NVIDIA Isaac for robotics AI, and Vision-Language-Action models. These technologies represent the industry standard for physical AI and humanoid robotics.

## Decision

We will use the combination of ROS 2, Gazebo/Unity simulation environments, NVIDIA Isaac for robotics AI, and Vision-Language-Action (VLA) models as the core technology stack for the course content and practical examples.

## Alternatives Considered

- Alternative robotics frameworks (ROS 1, Apollo, Autoware)
- Different simulation environments (Webots, CoppeliaSim, PyBullet)
- Alternative AI frameworks (OpenVINO, TensorFlow, PyTorch without NVIDIA Isaac)
- Different approaches to robot perception and action

## Consequences

**Positive**:
- Industry-standard technologies that students will encounter professionally
- Strong integration between NVIDIA Isaac and VLA models
- Extensive documentation and community support
- Real-world applicability for robotics projects

**Negative**:
- Hardware requirements for full functionality (especially NVIDIA GPUs)
- Complexity of setup and configuration
- Potential licensing considerations for commercial tools
- Learning curve for students new to these technologies

## References

- plan.md: Technical Context section
- spec.md: Functional Requirements for ROS 2, Simulation, Isaac, and VLA coverage
- research.md: Technology Stack Selection rationale