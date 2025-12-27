// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Module 1 - ROS 2',
      items: ['module-1-ros2'],
    },
    {
      type: 'category',
      label: 'Module 2 - Simulation',
      items: ['module-2-simulation'],
    },
    {
      type: 'category',
      label: 'Module 3 - NVIDIA Isaac',
      items: ['module-3-isaac'],
    },
    {
      type: 'category',
      label: 'Module 4 - Vision-Language-Action',
      items: ['module-4-vla'],
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