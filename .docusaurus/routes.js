import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/physical-ai-and-humanoid-robotics-book/docs',
    component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs', 'ada'),
    routes: [
      {
        path: '/physical-ai-and-humanoid-robotics-book/docs',
        component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs', '94f'),
        routes: [
          {
            path: '/physical-ai-and-humanoid-robotics-book/docs',
            component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs', 'b0b'),
            routes: [
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/demo',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/demo', '51e'),
                exact: true
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/hardware-cloud-options',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/hardware-cloud-options', '06f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/intro',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/intro', '00e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-1-ros2',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-1-ros2', '5c5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-1-ros2-part1-communication-patterns',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-1-ros2-part1-communication-patterns', '893'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-1-ros2-part1-core-architecture',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-1-ros2-part1-core-architecture', '1d0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-1-ros2-part1-nodes-topics-services',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-1-ros2-part1-nodes-topics-services', 'ee4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-2-simulation',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-2-simulation', 'd61'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-2-simulation-part1-gazebo-ignition',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-2-simulation-part1-gazebo-ignition', 'c46'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-2-simulation-part2-physics-modeling',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-2-simulation-part2-physics-modeling', '029'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-3-isaac',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-3-isaac', '678'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-3-isaac-part1-isaac-ros',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-3-isaac-part1-isaac-ros', '315'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-4-vla',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-4-vla', '496'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/module-4-vla-part1-multimodal-integration',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/module-4-vla-part1-multimodal-integration', '522'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/notebook-guide',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/notebook-guide', '2d8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/overview',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/overview', 'e55'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/rag',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/rag', '923'),
                exact: true
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/setup-guide',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/setup-guide', 'c1e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-and-humanoid-robotics-book/docs/weekly-schedule',
                component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/docs/weekly-schedule', 'c23'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/physical-ai-and-humanoid-robotics-book/',
    component: ComponentCreator('/physical-ai-and-humanoid-robotics-book/', 'bda'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
