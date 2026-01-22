import React, { useState } from 'react';

interface PrivacySettingsProps {
  onPreferencesChange?: (preferences: { personalizationEnabled: boolean }) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ onPreferencesChange }) => {
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handlePersonalizationToggle = () => {
    const newValue = !personalizationEnabled;
    setPersonalizationEnabled(newValue);

    if (onPreferencesChange) {
      onPreferencesChange({ personalizationEnabled: newValue });
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/profile/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Create a blob and download the data
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-data-export.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Your account has been successfully deleted.');
        // Redirect user to home page or login page
        window.location.href = '/';
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-1">Your Privacy Matters</h3>
        <p className="text-blue-700 text-sm">
          We are committed to protecting your data and giving you control over your personal information.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">Personalization</h3>
            <p className="text-sm text-gray-500">
              Enable personalized content recommendations based on your profile
            </p>
          </div>
          <button
            onClick={handlePersonalizationToggle}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              personalizationEnabled ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                personalizationEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="p-4 bg-white rounded-lg border">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Data Export</h3>
          <p className="text-sm text-gray-500 mb-4">
            Download a copy of your personal data stored on our servers
          </p>
          <button
            onClick={handleExportData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Export Data
          </button>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-sm font-medium text-red-800 mb-2">Account Deletion</h3>
          <p className="text-sm text-red-700 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          {showDeleteConfirmation ? (
            <div className="space-y-3">
              <p className="text-sm text-red-700">
                Are you sure you want to delete your account? This will permanently remove all your data.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Yes, Delete Account
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;