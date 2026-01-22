import React from 'react';

interface ConsentBannerProps {
  value: boolean;
  onChange: (value: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ConsentBanner: React.FC<ConsentBannerProps> = ({
  value,
  onChange,
  onNext,
  onPrev
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center">Privacy & Consent</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">We Respect Your Privacy</h3>
        <p className="text-blue-700 text-sm">
          We collect only non-sensitive information to personalize your learning experience.
          This includes your programming experience, OS preference, and tools familiarity.
          We do NOT collect passwords, keys, exact location, or personal identifiers.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="consent-checkbox" className="font-medium text-gray-700">
              I consent to data collection for personalization
            </label>
            <p className="text-gray-500">
              You can opt out anytime in your profile settings.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="personalization-checkbox"
              type="checkbox"
              checked={value} // Using the same value for now, but could be separate
              onChange={(e) => onChange(e.target.checked)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="personalization-checkbox" className="font-medium text-gray-700">
              Enable personalized content recommendations
            </label>
            <p className="text-gray-500">
              Tailor course content to your experience level and interests.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className={`py-2 px-4 rounded-md text-white ${
            value ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;