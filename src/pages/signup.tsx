import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '@site/frontend/src/contexts/AuthContext';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  programmingExperience: 'beginner' | 'intermediate' | 'advanced' | '';
  osPreference: 'windows' | 'macos' | 'linux' | 'other' | '';
  developmentTools: string[];
  deviceType: 'desktop' | 'laptop' | 'tablet' | 'other' | '';
  consentGiven: boolean;
}

export default function SignupPage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    programmingExperience: '',
    osPreference: '',
    developmentTools: [],
    deviceType: '',
    consentGiven: false
  });

  // State for skills selection that persists locally
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { signUp, signInWithGoogle, signInWithGitHub } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    if (type === 'checkbox' && name.startsWith('tool_')) {
      const tool = name.replace('tool_', '');
      const isChecked = target.checked;

      setFormData(prev => ({
        ...prev,
        developmentTools: isChecked
          ? [...prev.developmentTools, tool]
          : prev.developmentTools.filter(t => t !== tool)
      }));

      // Also update the selected skills state
      setSelectedSkills(prev =>
        isChecked
          ? [...prev, tool].filter((item, idx, arr) => arr.indexOf(item) === idx) // Remove duplicates
          : prev.filter(t => t !== tool)
      );
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle skills selection with visual feedback and keyboard support
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => {
      const newSkills = prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill];

      // Also update the developmentTools in formData
      setFormData(prevData => ({
        ...prevData,
        developmentTools: newSkills
      }));

      return newSkills;
    });

    // Store in localStorage for persistence
    localStorage.setItem('selectedSkills', JSON.stringify(
      selectedSkills.includes(skill)
        ? selectedSkills.filter(s => s !== skill)
        : [...selectedSkills, skill]
    ));
  };

  // Load skills from localStorage on component mount
  useEffect(() => {
    const savedSkills = localStorage.getItem('selectedSkills');
    if (savedSkills) {
      try {
        const parsedSkills = JSON.parse(savedSkills);
        if (Array.isArray(parsedSkills)) {
          setSelectedSkills(parsedSkills);
          setFormData(prev => ({
            ...prev,
            developmentTools: parsedSkills
          }));
        }
      } catch (e) {
        console.error('Error parsing saved skills', e);
      }
    }
  }, []);

  // Debounced save to backend (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedSkills.length > 0 && typeof window !== 'undefined' && window.location) {
        // In a real implementation, you would save to backend here
        // For now, just log the skills
        console.log('Saving skills to backend:', selectedSkills);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedSkills]);

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    } else if (step === 2) {
      // Validate step 2
      if (!formData.programmingExperience || !formData.osPreference || !formData.deviceType) {
        setError('Please answer all required background questions');
        return;
      }
    }

    setError('');
    setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First, register the user
      await signUp(formData.email, formData.password, formData.name);

      // Then try to save the profile information
      const profileData = {
        programming_experience: formData.programmingExperience,
        os_preference: formData.osPreference,
        development_tools: selectedSkills.length > 0 ? selectedSkills : formData.developmentTools, // Use selectedSkills if available
        device_type: formData.deviceType,
        personalization_enabled: true,
        consent_given: formData.consentGiven
      };

      try {
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        if (!response.ok) {
          console.warn('Failed to save profile information, but user registration succeeded');
        }
      } catch (profileErr) {
        console.warn('Profile saving failed, but user registration succeeded', profileErr);
        // Don't throw error for profile saving - allow registration to succeed
      }

      // Redirect to home or dashboard regardless of profile saving success
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const developmentToolOptions = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Docker', 'Git', 'VS Code', 'PyCharm'
  ];

  return (
    <Layout title="Create Account" description="Sign up for the Physical AI & Humanoid Robotics course">
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
              Join Our Community
            </h1>
            <p style={{
              fontSize: '1.1rem',
              opacity: '0.9',
              lineHeight: '1.6'
            }}>
              Create your account to access personalized Physical AI & Humanoid Robotics course content. Get tailored recommendations based on your background and experience.
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

        {/* Right Side - Signup Form */}
        <div style={{
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '450px',
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
                Create your account
              </h2>
              <p style={{ color: 'var(--ifm-font-color-secondary)' }}>
                Join thousands of learners in the Physical AI & Humanoid Robotics course
              </p>
            </div>

            {/* Progress indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[1, 2, 3].map((num) => (
                  <div key={num} style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: step >= num ? 'var(--ifm-color-primary)' : '#e5e7eb',
                    color: step >= num ? 'white' : '#4b5563',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    position: 'relative'
                  }}>
                    {num}
                    {num < 3 && (
                      <div style={{
                        position: 'absolute',
                        right: '-32px',
                        width: '64px',
                        height: '2px',
                        backgroundColor: step >= num + 1 ? 'var(--ifm-color-primary)' : '#e5e7eb',
                        zIndex: -1
                      }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--ifm-font-color-secondary)' }}>
                Step {step} of 3
              </span>
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

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--ifm-color-primary-dark)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    Account Information
                  </h3>

                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="name" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--ifm-font-color-base)',
                      marginBottom: '0.5rem'
                    }}>
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--ifm-font-color-base)',
                      marginBottom: '0.5rem'
                    }}>
                      Email Address <span style={{ color: 'var(--ifm-color-warning)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--ifm-font-color-base)',
                      marginBottom: '0.5rem'
                    }}>
                      Password <span style={{ color: 'var(--ifm-color-warning)' }}>*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="At least 6 characters"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="confirmPassword" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--ifm-font-color-base)',
                      marginBottom: '0.5rem'
                    }}>
                      Confirm Password <span style={{ color: 'var(--ifm-color-warning)' }}>*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Re-enter your password"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--ifm-color-primary-dark)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    Tell Us About Your Background
                  </h3>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--ifm-font-color-base)',
                      marginBottom: '0.5rem'
                    }}>
                      Programming Experience Level <span style={{ color: 'var(--ifm-color-warning)' }}>*</span>
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '0.75rem'
                    }}>
                      {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                        <label key={level} style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: `2px solid ${formData.programmingExperience === level ? 'var(--ifm-color-primary)' : '#e5e7eb'}`,
                          cursor: 'pointer',
                          backgroundColor: formData.programmingExperience === level ? 'rgba(var(--ifm-color-primary-rgb), 0.1)' : 'white',
                          transition: 'all 0.2s',
                          textAlign: 'center'
                        }}>
                          <input
                            type="radio"
                            name="programmingExperience"
                            value={level}
                            checked={formData.programmingExperience === level}
                            onChange={handleInputChange}
                            required
                            style={{ display: 'none' }}
                          />
                          <div style={{
                            fontWeight: '600',
                            color: formData.programmingExperience === level ? 'var(--ifm-color-primary)' : 'var(--ifm-font-color-base)'
                          }}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--ifm-font-color-base)',
                      marginBottom: '0.5rem'
                    }}>
                      Operating System Preference <span style={{ color: 'var(--ifm-color-warning)' }}>*</span>
                    </label>
                    <select
                      name="osPreference"
                      value={formData.osPreference}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="">Select your OS</option>
                      <option value="windows">Windows</option>
                      <option value="macos">macOS</option>
                      <option value="linux">Linux</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--ifm-font-color-base)',
                      marginBottom: '0.5rem'
                    }}>
                      Which development tools are you familiar with?
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '0.75rem'
                    }}>
                      {developmentToolOptions.map(tool => {
                        const isSelected = selectedSkills.includes(tool);
                        return (
                          <div
                            key={tool}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleSkillToggle(tool)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSkillToggle(tool);
                              }
                            }}
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: `2px solid ${isSelected ? 'var(--ifm-color-primary)' : '#e5e7eb'}`,
                              cursor: 'pointer',
                              backgroundColor: isSelected ? 'rgba(var(--ifm-color-primary-rgb), 0.1)' : 'white',
                              transition: 'all 0.2s',
                              textAlign: 'center',
                              outline: 'none'
                            }}
                            aria-pressed={isSelected}
                          >
                            <div style={{
                              fontWeight: '500',
                              color: isSelected ? 'var(--ifm-color-primary)' : 'var(--ifm-font-color-base)'
                            }}>
                              {tool}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--ifm-font-color-base)',
                      marginBottom: '0.5rem'
                    }}>
                      Primary Device Type <span style={{ color: 'var(--ifm-color-warning)' }}>*</span>
                    </label>
                    <select
                      name="deviceType"
                      value={formData.deviceType}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="">Select your device</option>
                      <option value="desktop">Desktop Computer</option>
                      <option value="laptop">Laptop</option>
                      <option value="tablet">Tablet</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--ifm-color-primary-dark)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    Review Your Information
                  </h3>

                  <div style={{
                    backgroundColor: 'var(--ifm-color-gray-50)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <h4 style={{
                      fontWeight: '600',
                      color: 'var(--ifm-color-primary)',
                      marginBottom: '1rem'
                    }}>
                      Account Information
                    </h4>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>

                    <h4 style={{
                      fontWeight: '600',
                      color: 'var(--ifm-color-primary-dark)',
                      marginTop: '1.5rem',
                      marginBottom: '1rem'
                    }}>
                      Background Information
                    </h4>
                    <p><strong>Programming Experience:</strong> {formData.programmingExperience || 'Not selected'}</p>
                    <p><strong>OS Preference:</strong> {formData.osPreference || 'Not selected'}</p>
                    <p><strong>Development Tools:</strong> {formData.developmentTools.length > 0 ? formData.developmentTools.join(', ') : 'None selected'}</p>
                    <p><strong>Device Type:</strong> {formData.deviceType || 'Not selected'}</p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: formData.consentGiven ? 'rgba(var(--ifm-color-primary-rgb), 0.05)' : 'white'
                  }}>
                    <input
                      id="consentGiven"
                      name="consentGiven"
                      type="checkbox"
                      checked={formData.consentGiven}
                      onChange={handleInputChange}
                      required
                      style={{
                        marginRight: '0.75rem',
                        marginTop: '0.25rem',
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: '2px solid #d1d5db'
                      }}
                    />
                    <label htmlFor="consentGiven" style={{
                      color: 'var(--ifm-font-color-base)',
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}>
                      I agree to provide this information for personalization purposes and consent to the use of my data as outlined in the privacy policy. This helps us tailor content to your background and experience level.
                    </label>
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: step > 1 ? 'space-between' : 'flex-end',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'white',
                      color: 'var(--ifm-font-color-base)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    Previous
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'var(--ifm-color-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary-light)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary)'}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'var(--ifm-color-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      transition: 'background-color 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary-light)';
                    }}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary)'}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </div>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '2rem 0',
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
                Or sign up with
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={signInWithGoogle}
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
                  transition: 'background-color 0.2s',
                  fontFamily: 'inherit'
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
                onClick={signInWithGitHub}
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
                  transition: 'background-color 0.2s',
                  fontFamily: 'inherit'
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
                Already have an account?{' '}
                <a
                  href="/login"
                  style={{
                    color: 'var(--ifm-color-primary)',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}