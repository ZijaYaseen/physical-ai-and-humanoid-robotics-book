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
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                Start Learning
              </Link>
              <Link
                className="button button--outline button--secondary button--lg"
                to="/docs/module-1-ros2">
                Explore Modules
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img
              src={useBaseUrl('/img/hero.png')}
              alt="Physical AI & Humanoid Robotics Hero"
              className={styles.heroImageElement}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function FeatureSection() {
  return (
    <section className={styles.features}>
      <div className="container padding-vert--xl">
        <div className="row">
          <div className="col col--4">
            <div className="text--center padding-horiz--md">
              <div className={styles.featureIcon}>🤖</div>
              <h3>Cutting-Edge Technology</h3>
              <p>Learn with the latest tools and frameworks used in modern robotics and AI development.</p>
            </div>
          </div>
          <div className="col col--4">
            <div className="text--center padding-horiz--md">
              <div className={styles.featureIcon}>🎓</div>
              <h3>Academic Rigor</h3>
              <p>Comprehensive curriculum designed by experts combining theoretical knowledge with practical applications.</p>
            </div>
          </div>
          <div className="col col--4">
            <div className="text--center padding-horiz--md">
              <div className={styles.featureIcon}>🔧</div>
              <h3>Hands-On Learning</h3>
              <p>Interactive Jupyter notebooks and simulation environments for real-world experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModulesOverview() {
  return (
    <section className={styles.modules}>
      <div className="container padding-vert--lg">
        <div className="text--center padding-bottom--lg">
          <h2>Core Learning Modules</h2>
          <p className="hero__subtitle">Comprehensive curriculum covering essential robotics and AI concepts</p>
        </div>
        <div className="row">
          <div className="col col--3">
            <div className={clsx('card', styles.moduleCard)}>
              <div className="card__header">
                <h3>Module 1: ROS 2</h3>
              </div>
              <div className="card__body">
                <p>Robot Operating System fundamentals, nodes, topics, services, and parameters.</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to="/docs/module-1-ros2">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className={clsx('card', styles.moduleCard)}>
              <div className="card__header">
                <h3>Module 2: Simulation</h3>
              </div>
              <div className="card__body">
                <p>Gazebo, Webots, and other simulation environments for robotics development.</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to="/docs/module-2-simulation">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className={clsx('card', styles.moduleCard)}>
              <div className="card__header">
                <h3>Module 3: NVIDIA Isaac</h3>
              </div>
              <div className="card__body">
                <p>NVIDIA's robotics platform for advanced perception and control systems.</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to="/docs/module-3-isaac">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className={clsx('card', styles.moduleCard)}>
              <div className="card__header">
                <h3>Module 4: VLA</h3>
              </div>
              <div className="card__body">
                <p>Vision-Language-Action models for advanced robot decision making.</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to="/docs/module-4-vla">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container padding-vert--xl text--center">
        <h2>Ready to Start Your Robotics Journey?</h2>
        <p className="hero__subtitle">Join thousands of students and professionals learning the future of robotics</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Get Started Now
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
      description="Physical AI & Humanoid Robotics Course Book - Comprehensive curriculum for robotics and AI">
      <HomepageHeader />
      <main>
        <FeatureSection />
        <ModulesOverview />
        <CTASection />
      </main>
    </Layout>
  );
}