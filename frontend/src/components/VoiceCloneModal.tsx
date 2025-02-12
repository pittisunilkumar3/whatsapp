import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Switch } from './ui/Switch';
import { Dropdown } from './ui/Dropdown';

interface VoiceCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCloneModal: React.FC<VoiceCloneModalProps> = ({ isOpen, onClose }) => {
  const [voiceName, setVoiceName] = useState('');
  const [language, setLanguage] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle voice cloning logic here
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Clone Voice">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Voice Name</label>
          <input
            type="text"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-voice-orange focus:ring-voice-orange"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <Dropdown
            options={languageOptions}
            value={language}
            onChange={setLanguage}
            placeholder="Select language"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Voice Sample</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
            required
          />
        </div>

        <Switch
          checked={isPublic}
          onChange={setIsPublic}
          label="Make Voice Public"
          description="Allow other users to use this voice"
        />

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-voice-orange text-white rounded-md hover:bg-orange-600"
          >
            Clone Voice
          </button>
        </div>
      </form>
    </Modal>
  );
};
