// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A comprehensive course book on robotics, AI, and physical interaction',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://zijayaseen.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub Pages deployment, it's usually '/<org-name>/<repo-name>/'
  baseUrl: '/physical-ai-and-humanoid-robotics-book/',

  // GitHub pages deployment config.
  organizationName: 'ZijaYaseen', // Usually your GitHub org/user name.
  projectName: 'physical-ai-and-humanoid-robotics-book', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn', // Note: This option is deprecated in Docusaurus v3, will be moved to markdown options

  markdown: {
    mermaid: true,
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ZijaYaseen/physical-ai-and-humanoid-robotics-book/tree/main/',
        },
        blog: false, // Disable blog
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    async function myPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and Autoprefixer to the PostCSS pipeline
          postcssOptions.plugins.push(require('@tailwindcss/postcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
  ],


  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        logo: {
          alt: 'Physical AI & Humanoid Robotics Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            to: '/',
            label: 'Home',
            position: 'left',
          },
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Course Book',
          },
          {
            to: '/docs/intro',
            label: 'Getting Started',
            position: 'left',
          },
          {
            to: '/docs/module-1-ros2',
            label: 'Modules',
            position: 'left',
          },
          {
            href: 'https://github.com/ZijaYaseen/physical-ai-and-humanoid-robotics-book',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Course Content',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'ROS2 Basics',
                to: '/docs/module-1-ros2',
              },
              {
                label: 'Simulation',
                to: '/docs/module-2-simulation',
              },
              {
                label: 'Isaac Modules',
                to: '/docs/module-3-isaac',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Weekly Schedule',
                to: '/docs/weekly-schedule',
              },
              {
                label: 'Setup Guide',
                to: '/docs/setup-guide',
              },
              {
                label: 'Notebook Guide',
                to: '/docs/notebook-guide',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/ZijaYaseen/physical-ai-and-humanoid-robotics-book',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Course. Built by Zija Yaseen.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['python', 'bash', 'json', 'yaml', 'docker'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        id: 'support_us',
        content:
          '⭐ If you like this course, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/ZijaYaseen/physical-ai-and-Humanoid-Robotics">GitHub</a>! ⭐',
        backgroundColor: '#4169E1', // Royal blue theme color
        textColor: '#ffffff',
        isCloseable: true,
      },
    }),
};

module.exports = config;