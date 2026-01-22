import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '@site/frontend/src/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signInWithGoogle, signInWithGitHub } = useAuth();

  const handleLoginSuccess = () => {
    window.location.href = '/';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      handleLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signInWithGoogle();
  };

  const handleGitHubLogin = () => {
    signInWithGitHub();
  };

  return (
    <Layout title="Login" description="Sign in to your account">
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--ifm-background-color)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
      }}>
        {/* Left Side - Branding */}
        <div style={{
          flex: '1',
          backgroundColor: 'var(--ifm-color-primary-light)',
          color: 'var(--ifm-color-gray-900)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '400px' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              lineHeight: '1.2'
            }}>
              Welcome Back
            </h1>
            <p style={{
              fontSize: '1.1rem',
              opacity: '0.9',
              lineHeight: '1.6'
            }}>
              Sign in to access your personalized Physical AI & Humanoid Robotics course experience. Continue your learning journey with tailored content.
            </p>
            <div style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🤖
              </div>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🧠
              </div>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🤖
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={{
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'var(--ifm-color-gray-100)',
            borderRadius: 'var(--ifm-card-border-radius)',
            boxShadow: 'var(--ifm-card-shadow)',
            padding: '2rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: 'var(--ifm-color-primary-light)',
                marginBottom: '0.5rem'
              }}>
                Sign in to your account
              </h2>
              <p style={{ color: 'var(--ifm-font-color-secondary)' }}>
                Enter your credentials to access your personalized learning experience
              </p>
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                borderColor: 'var(--ifm-color-warning)',
                color: 'var(--ifm-color-warning)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '1rem',
                border: '1px solid var(--ifm-color-warning)',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--ifm-font-color-base)',
                  marginBottom: '0.5rem'
                }}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter your email"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="password" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--ifm-font-color-base)',
                  marginBottom: '0.5rem'
                }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter your password"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    style={{
                      marginRight: '0.5rem',
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: '1px solid #d1d5db'
                    }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--ifm-font-color-secondary)' }}>
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  style={{
                    color: 'var(--ifm-color-primary)',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                  onClick={() => {
                    // Handle forgot password
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  backgroundColor: 'var(--ifm-color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'background-color 0.2s, transform 0.1s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary)';
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem',
              position: 'relative',
              height: '1px',
              backgroundColor: '#e5e7eb'
            }}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '0 1rem',
                color: 'var(--ifm-font-color-secondary)',
                fontSize: '0.875rem'
              }}>
                Or continue with
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  flex: '1',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleGitHubLogin}
                style={{
                  flex: '1',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--ifm-font-color-secondary)', fontSize: '0.875rem' }}>
                Don't have an account?{' '}
                <a
                  href="/signup"
                  style={{
                    color: 'var(--ifm-color-primary)',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}