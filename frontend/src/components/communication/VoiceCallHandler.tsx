import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceCallHandlerProps {
	phoneNumber: string;
	script: string;
	onCallComplete: (result: CallResult) => void;
}

interface CallResult {
	duration: number;
	status: 'completed' | 'failed' | 'no-answer';
	recordingUrl?: string;
}

export const VoiceCallHandler: React.FC<VoiceCallHandlerProps> = ({
	phoneNumber,
	script,
	onCallComplete
}) => {
	const [isCallActive, setIsCallActive] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [duration, setDuration] = useState(0);

	const handleStartCall = () => {
		setIsCallActive(true);
		// Implement Twilio/Telnyx call initiation
	};

	const handleEndCall = () => {
		setIsCallActive(false);
		onCallComplete({
			duration,
			status: 'completed'
		});
	};

	return (
		<Card className="p-4">
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<div>
						<h3 className="font-medium">Voice Call</h3>
						<p className="text-sm text-secondary-text">{phoneNumber}</p>
					</div>
					<div className="flex space-x-2">
						<Button
							variant={isMuted ? 'ghost' : 'default'}
							size="sm"
							onClick={() => setIsMuted(!isMuted)}
						>
							{isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
						</Button>
						<Button
							variant={isCallActive ? 'destructive' : 'default'}
							size="sm"
							onClick={isCallActive ? handleEndCall : handleStartCall}
						>
							{isCallActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
						</Button>
					</div>
				</div>

				{isCallActive && (
					<div className="border-t pt-4">
						<div className="bg-gray-50 p-3 rounded-lg">
							<h4 className="text-sm font-medium mb-2">Script</h4>
							<p className="text-sm">{script}</p>
						</div>
						<div className="mt-4 flex justify-between items-center">
							<span className="text-sm text-secondary-text">
								Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
							</span>
							<div className="flex space-x-2">
								<Button variant="ghost" size="sm">
									<Volume2 className="w-4 h-4" />
								</Button>
								<Button variant="ghost" size="sm">
									<VolumeX className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
};