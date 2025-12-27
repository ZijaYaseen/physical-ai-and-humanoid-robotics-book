# Data Model: Physical AI & Humanoid Robotics Course Book

## Course Content Entity
- **Fields**: title, module, content_type, difficulty_level, estimated_time, prerequisites
- **Relationships**: Contains multiple code_examples, exercises, and references
- **Validation**: Must have unique title within module, content_type must be valid (text, video, notebook, exercise)

## Jupyter Notebook Entity
- **Fields**: filename, module, description, execution_time, hardware_requirements, fallback_available
- **Relationships**: Belongs to a Course Content, contains multiple code_cells
- **State Transitions**: draft → review → approved → published
- **Validation**: Must execute within 30 minutes, must have fallback mode if hardware-dependent

## Web Demo Entity
- **Fields**: name, description, input_type, output_type, execution_time, dependencies
- **Relationships**: Connected to multiple modules for demonstration
- **Validation**: Must start within 30 seconds, must handle all error states gracefully

## Hardware Configuration Entity
- **Fields**: name, specs, cost_estimate, cloud_alternative, compatibility_notes
- **Relationships**: Referenced by notebooks that have hardware requirements
- **Validation**: Must include cloud fallback option, cost must be estimated

## Module Entity
- **Fields**: name, order, learning_objectives, duration, prerequisites
- **Relationships**: Contains multiple Course Content and Notebooks
- **Validation**: Must follow sequential order for foundational learning