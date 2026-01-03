import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import BookRAGWidget from '../components/rag/BookRAGWidget';

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

          <div className={styles.heroImage} aria-hidden="false">
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
      <div className="container">
        <div className="text--center padding-bottom--lg">
          <h2>Core Learning Modules</h2>
          <p className="hero__subtitle">Comprehensive curriculum covering essential robotics and AI concepts</p>
        </div>

        {/* Use columns that collapse on mobile with the CSS above */}
        <div className="row">
          <div className="col col--3">
            <div className={clsx('card', styles.moduleCard)}>
              <div className="card__header">
                <h3>Module 1: ROS 2</h3>
              </div>
              <div className="card__body">
                <p>Master the Robot Operating System 2 (ROS 2) framework, including nodes, topics, services, parameters, and communication patterns. Build robust robotic applications with this essential middleware.</p>
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
                <p>Explore advanced simulation environments including Gazebo, Webots, and other platforms. Develop and test robotic applications in realistic virtual worlds before deploying to real hardware.</p>
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
                <p>Discover NVIDIA Isaac, a comprehensive robotics platform for advanced perception, navigation, and control systems. Learn to leverage GPU acceleration and AI for next-generation robotics applications.</p>
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
                <p>Master Vision-Language-Action (VLA) models that enable robots to understand and interact with the world. Learn how AI models process visual and linguistic inputs to make intelligent decisions and perform complex tasks.</p>
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
  const [showRAGWidget, setShowRAGWidget] = useState(false);

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

      {/* Floating RAG Widget Button */}
      {!showRAGWidget && (
        <button
          onClick={() => setShowRAGWidget(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#4169e1',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Open Book Assistant"
        >
          💬
        </button>
      )}

      {/* RAG Widget - only shown when button is clicked */}
      {showRAGWidget && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '400px',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <BookRAGWidget />
          <button
            onClick={() => setShowRAGWidget(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#666',
              zIndex: 1001
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      )}
    </Layout>
  );
}
