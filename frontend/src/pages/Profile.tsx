import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PrivacySettings from '../components/profile/PrivacySettings';
import DeleteAccountModal from '../components/profile/DeleteAccountModal';

interface ProfileData {
  programming_experience: 'beginner' | 'intermediate' | 'advanced';
  os_preference: 'windows' | 'macos' | 'linux' | 'other';
  development_tools: string[];
  device_type: 'desktop' | 'laptop' | 'tablet' | 'other';
  personalization_enabled: boolean;
  consent_given: boolean;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile');

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 404) {
        // User doesn't have a profile yet, initialize with defaults
        setProfile({
          programming_experience: 'beginner',
          os_preference: 'other',
          development_tools: [],
          device_type: 'other',
          personalization_enabled: true,
          consent_given: false
        });
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating profile:', err);
    }
  };

  const handlePersonalizationToggle = async () => {
    if (!profile) return;

    const newValue = !profile.personalization_enabled;
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personalization_enabled: newValue }),
      });

      if (response.ok) {
        setProfile({ ...profile, personalization_enabled: newValue });
        alert(`Personalization ${newValue ? 'enabled' : 'disabled'} successfully!`);
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating preferences:', err);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const onAccountDeleted = () => {
    setShowDeleteModal(false);
    // Redirect user to home page or login page
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      {user && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold">Account Information</h2>
          <p>Email: {user.email}</p>
          <p>Name: {user.name || 'Not provided'}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {profile && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programming Experience
              </label>
              {isEditing ? (
                <select
                  value={profile.programming_experience}
                  onChange={(e) => setProfile({
                    ...profile,
                    programming_experience: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profile.programming_experience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating System Preference
              </label>
              {isEditing ? (
                <select
                  value={profile.os_preference}
                  onChange={(e) => setProfile({
                    ...profile,
                    os_preference: e.target.value as 'windows' | 'macos' | 'linux' | 'other'
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="windows">Windows</option>
                  <option value="macos">macOS</option>
                  <option value="linux">Linux</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profile.os_preference}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Development Tools Familiarity
              </label>
              {isEditing ? (
                <div className="mt-1 space-y-2">
                  {['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Docker', 'Git', 'VS Code', 'PyCharm'].map(tool => (
                    <label key={tool} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={profile.development_tools.includes(tool)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProfile({
                              ...profile,
                              development_tools: [...profile.development_tools, tool]
                            });
                          } else {
                            setProfile({
                              ...profile,
                              development_tools: profile.development_tools.filter(t => t !== tool)
                            });
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tool}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {profile.development_tools.length > 0
                    ? profile.development_tools.join(', ')
                    : 'None selected'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Type
              </label>
              {isEditing ? (
                <select
                  value={profile.device_type}
                  onChange={(e) => setProfile({
                    ...profile,
                    device_type: e.target.value as 'desktop' | 'laptop' | 'tablet' | 'other'
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="desktop">Desktop</option>
                  <option value="laptop">Laptop</option>
                  <option value="tablet">Tablet</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profile.device_type}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Personalization</h3>
            <p className="text-sm text-gray-500">
              Enable personalized content recommendations based on your profile
            </p>
          </div>
          <button
            onClick={handlePersonalizationToggle}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              profile?.personalization_enabled ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                profile?.personalization_enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <PrivacySettings />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Account Management</h2>
        <div className="flex justify-end">
          <button
            onClick={handleDeleteAccount}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={onAccountDeleted}
        />
      )}
    </div>
  );
};

export default ProfilePage;