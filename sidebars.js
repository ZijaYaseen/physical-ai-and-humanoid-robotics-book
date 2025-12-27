// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'overview',
    'intro',
    {
      type: 'category',
      label: 'Module 1 - ROS 2',
      items: [
        'module-1-ros2',
        {
          type: 'category',
          label: 'Part 1: Core Concepts',
          items: [
            'module-1-ros2-part1-core-architecture',
            'module-1-ros2-part1-communication-patterns',
            'module-1-ros2-part1-nodes-topics-services'
          ]
        }
      ],
    },
    {
      type: 'category',
      label: 'Module 2 - Simulation',
      items: [
        'module-2-simulation',
        {
          type: 'category',
          label: 'Part 1: Simulation Environments',
          items: [
            'module-2-simulation-part1-gazebo-ignition'
          ]
        },
        {
          type: 'category',
          label: 'Part 2: Physics and Sensor Simulation',
          items: [
            'module-2-simulation-part2-physics-modeling'
          ]
        }
      ],
    },
    {
      type: 'category',
      label: 'Module 3 - NVIDIA Isaac',
      items: [
        'module-3-isaac',
        {
          type: 'category',
          label: 'Part 1: Isaac Platform Architecture',
          items: [
            'module-3-isaac-part1-isaac-ros'
          ]
        }
      ],
    },
    {
      type: 'category',
      label: 'Module 4 - Vision-Language-Action',
      items: [
        'module-4-vla',
        {
          type: 'category',
          label: 'Part 1: VLA Architecture',
          items: [
            'module-4-vla-part1-multimodal-integration'
          ]
        }
      ],
    },
    {
      type: 'category',
      label: 'Hardware & Cloud Options',
      items: ['hardware-cloud-options', 'weekly-schedule'],
    },
    {
      type: 'category',
      label: 'Setup & Guides',
      items: ['setup-guide', 'notebook-guide'],
    }
  ],
};

module.exports = sidebars;