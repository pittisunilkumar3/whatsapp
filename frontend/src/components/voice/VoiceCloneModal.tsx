import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mic, Upload, Volume2, Waveform } from 'lucide-react';

interface VoiceCloneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClone: (voiceData: any) => void;
}

export const VoiceCloneModal: React.FC<VoiceCloneModalProps> = ({
    isOpen,
    onClose,
    onClone
}) => {
    const [step, setStep] = useState(1);
    const [recording, setRecording] = useState(false);
    const [audioSample, setAudioSample] = useState<File | null>(null);
    const [cloneName, setCloneName] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAudioSample(file);
        }
    };

    const startRecording = () => {
        setRecording(true);
        // Implement recording logic
    };

    const stopRecording = () => {
        setRecording(false);
        // Implement stop recording logic
    };

    const handleClone = async () => {
        setProcessing(true);
        // Implement voice cloning logic
        setTimeout(() => {
            setProcessing(false);
            onClone({ name: cloneName, audioSample });
            onClose();
        }, 2000);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Clone Voice"
            size="lg"
        >
            <div className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 1: Provide Voice Sample</h3>
                        <p className="text-sm text-gray-500">
                            Upload an audio sample or record your voice. The sample should be clear
                            and at least 30 seconds long for best results.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500 mb-4">Upload audio file</p>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="audio-upload"
                                />
                                <label htmlFor="audio-upload">
                                    <Button variant="outline" className="mx-auto">
                                        Choose File
                                    </Button>
                                </label>
                            </div>

                            <div className="border-2 border-gray-300 rounded-lg p-6 text-center">
                                <Mic className={`w-8 h-8 mx-auto mb-2 ${recording ? 'text-red-500' : 'text-gray-400'}`} />
                                <p className="text-sm text-gray-500 mb-4">Record your voice</p>
                                <Button
                                    variant="outline"
                                    onClick={recording ? stopRecording : startRecording}
                                    className={recording ? 'bg-red-50 text-red-600' : ''}
                                >
                                    {recording ? 'Stop Recording' : 'Start Recording'}
                                </Button>
                            </div>
                        </div>

                        {audioSample && (
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <Volume2 className="w-5 h-5 text-gray-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{audioSample.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(audioSample.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Preview
                                </Button>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!audioSample}
                                className="bg-primary text-white"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 2: Configure Voice Clone</h3>
                        <p className="text-sm text-gray-500">
                            Name your voice clone and adjust settings for optimal results.
                        </p>

                        <Input
                            label="Voice Clone Name"
                            value={cloneName}
                            onChange={(e) => setCloneName(e.target.value)}
                            placeholder="e.g., Sales Assistant Voice"
                        />

                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium">Advanced Settings</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Clarity Enhancement</label>
                                    <input
                                        type="range"
                                        className="w-full"
                                        min="0"
                                        max="100"
                                        defaultValue="50"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Emotion Preservation</label>
                                    <input
                                        type="range"
                                        className="w-full"
                                        min="0"
                                        max="100"
                                        defaultValue="75"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button
                                onClick={handleClone}
                                disabled={!cloneName || processing}
                                className="bg-primary text-white"
                            >
                                {processing ? 'Processing...' : 'Create Voice Clone'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
