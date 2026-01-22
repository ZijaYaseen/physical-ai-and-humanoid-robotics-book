import React, { useState } from 'react';
import ExperienceLevelSelector from './ExperienceLevelSelector';
import OSToolSelector from './OSToolSelector';
import DeviceSelector from './DeviceSelector';
import ConsentBanner from './ConsentBanner';

interface OnboardingData {
  programming_experience: 'beginner' | 'intermediate' | 'advanced';
  os_preference: 'windows' | 'macos' | 'linux' | 'other';
  development_tools: string[];
  device_type: 'desktop' | 'laptop' | 'tablet' | 'other';
  consent_given: boolean;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    programming_experience: 'beginner',
    os_preference: 'other',
    development_tools: [],
    device_type: 'other',
    consent_given: false
  });

  const totalSteps = 5;

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(onboardingData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ExperienceLevelSelector
            value={onboardingData.programming_experience}
            onChange={(value) => updateOnboardingData({ programming_experience: value })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <OSToolSelector
            osValue={onboardingData.os_preference}
            toolsValue={onboardingData.development_tools}
            onOsChange={(value) => updateOnboardingData({ os_preference: value })}
            onToolsChange={(value) => updateOnboardingData({ development_tools: value })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <DeviceSelector
            value={onboardingData.device_type}
            onChange={(value) => updateOnboardingData({ device_type: value })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ConsentBanner
            value={onboardingData.consent_given}
            onChange={(value) => updateOnboardingData({ consent_given: value })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Review Your Information</h2>
            <div className="space-y-3 mb-6">
              <div><strong>Experience Level:</strong> {onboardingData.programming_experience}</div>
              <div><strong>OS Preference:</strong> {onboardingData.os_preference}</div>
              <div><strong>Development Tools:</strong> {onboardingData.development_tools.join(', ') || 'None selected'}</div>
              <div><strong>Device Type:</strong> {onboardingData.device_type}</div>
              <div><strong>Consent Given:</strong> {onboardingData.consent_given ? 'Yes' : 'No'}</div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={prevStep}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Complete Onboarding
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto p-4 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Welcome! Let's Personalize Your Experience</h1>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            Step {step} of {totalSteps}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;