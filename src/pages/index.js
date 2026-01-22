import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1>{siteConfig.title}</h1>
          <p>{siteConfig.tagline}</p>

          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/intro">
              Start Learning
            </Link>
            <Link className="button button--outline button--primary button--lg" to="/docs/module-1-ros2">
              Explore Modules
            </Link>
          </div>
        </div>

        <div className={styles.heroImage}>
          <img
            src={useBaseUrl('/img/hero.png')}
            alt="Physical AI & Humanoid Robotics"
            className={styles.heroImageElement}
          />
        </div>
      </div>
    </header>
  );
}

function FeatureSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--4 text--center">
            <div className={styles.featureIcon}>🤖</div>
            <h3>Industry-Grade Tech</h3>
            <p>Modern robotics, AI stacks, and production-ready workflows.</p>
          </div>
          <div className="col col--4 text--center">
            <div className={styles.featureIcon}>🎓</div>
            <h3>Academic + Practical</h3>
            <p>Strong theory with real implementation paths.</p>
          </div>
          <div className="col col--4 text--center">
            <div className={styles.featureIcon}>🛠️</div>
            <h3>Hands-On</h3>
            <p>Simulations, ROS2, NVIDIA Isaac, and VLA pipelines.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModulesOverview() {
  return (
    <section className={styles.modules}>
      <div className="container">
        <div className={styles.modulesHeader}>
          <h2>Co-Learning Modules</h2>
          <p>Master the fundamentals of Physical AI and Humanoid Robotics</p>
        </div>

        <div className={styles.modulesGrid}>
          {[
            ['Module 1: ROS 2', 'Master the Robot Operating System 2 (ROS 2) framework, including nodes, topics, services, parameters, and communication patterns. Build robust robotic applications with this essential middleware.', '/docs/module-1-ros2'],
            ['Module 2: Simulation', 'Explore advanced simulation environments including Gazebo, Webots, and other platforms. Develop and test robotic applications in realistic virtual worlds before deploying to real hardware.', '/docs/module-2-simulation'],
            ['Module 3: NVIDIA Isaac', 'Discover NVIDIA Isaac, a comprehensive robotics platform for advanced perception, navigation, and control systems. Learn to leverage GPU acceleration and AI for next-generation robotics applications.', '/docs/module-3-isaac'],
            ['Module 4: VLA', 'Master Vision-Language-Action (VLA) models that enable robots to understand and interact with the world. Learn how AI models process visual and linguistic inputs to make intelligent decisions and perform complex tasks.', '/docs/module-4-vla'],
          ].map(([title, desc, link]) => (
            <div key={title} className={clsx('card', styles.moduleCard)}>
              <div className="card__header">
                <h3>{title}</h3>
              </div>
              <div className="card__body">
                <p>{desc}</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to={link}>
                  Start Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container text--center">
        <h2>Ready to Start Your Robotics Journey?</h2>
        <p>Join thousands of students and professionals learning the future of robotics</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Begin Learning
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Physical AI & Humanoid Robotics – Industry-grade course book">
      <HomepageHeader />
      <main>
        <FeatureSection />
        <ModulesOverview />
        <CTASection />
      </main>
    </Layout>
  );
}
