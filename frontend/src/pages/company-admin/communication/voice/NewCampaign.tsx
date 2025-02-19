import React, { useState } from 'react';
import { CampaignForm } from '../../../../components/campaigns/CampaignForm';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
    { id: 'basic', title: 'Basic Information', description: 'Campaign details and objectives' },
    { id: 'voice', title: 'Voice Settings', description: 'Configure AI voice and language settings' },
    { id: 'script', title: 'Script Builder', description: 'Create and test conversation scripts' },
    { id: 'schedule', title: 'Schedule & Rules', description: 'Set campaign schedule and calling rules' },
    { id: 'leads', title: 'Lead Management', description: 'Upload and manage campaign leads' },
    { id: 'review', title: 'Review & Launch', description: 'Review settings and launch campaign' }
];

export const NewCampaign: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create Voice Campaign</h1>
                    <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
                        Set up a new automated voice campaign with AI-powered calling.
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav aria-label="Progress">
                            <div className="flex justify-between items-center">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex-1">
                                        <div className="relative">
                                            <div className={`h-2 ${
                                                index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                                            } rounded-full transition-colors duration-200`} />
                                            <div className="absolute -top-10 left-0 w-full">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                                                        index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                                                    } shadow-sm`}>
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm font-medium mt-2">{step.title}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Form Content */}
                <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="p-8">
                        <div className="mb-6 border-b border-gray-200 pb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">{steps[currentStep].title}</h2>
                            <p className="mt-2 text-sm text-gray-500">{steps[currentStep].description}</p>
                        </div>
                        <CampaignForm currentStep={currentStep} />
                    </div>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 px-4">
                    <Button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        variant="secondary"
                        className="flex items-center gap-3 px-6 py-3 text-base"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous Step
                    </Button>
                    <Button
                        onClick={nextStep}
                        disabled={currentStep === steps.length - 1}
                        className="flex items-center gap-3 px-6 py-3 text-base bg-blue-600 hover:bg-blue-700"
                    >
                        {currentStep === steps.length - 1 ? 'Launch Campaign' : 'Next Step'}
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}; 