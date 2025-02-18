import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dropdown } from '../../components/ui/Dropdown';
import { Switch } from '../../components/ui/Switch';
import { 
    ArrowLeft,
    Upload,
    Clock,
    Calendar,
    Mic2,
    Phone,
    FileText,
    X as XIcon,
    Eye
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface VoiceCampaignData {
    name: string;
    description: string;
    voiceType: string;
    script: string;
    callAttempts: number;
    retryInterval: number;
    maxCallDuration: number;
    callStartTime: string;
    callEndTime: string;
    isScheduled: boolean;
    scheduleDate: string;
    scheduleTime: string;
    leadFile: File | null;
    callbackNumber: string;
    enableTranscription: boolean;
    enableRecording: boolean;
}

interface PreviewData {
    headers: string[];
    rows: string[][];
}

export const VoiceCampaignCreation: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<VoiceCampaignData>({
        name: '',
        description: '',
        voiceType: '',
        script: '',
        callAttempts: 3,
        retryInterval: 24,
        maxCallDuration: 180,
        callStartTime: '09:00',
        callEndTime: '18:00',
        isScheduled: false,
        scheduleDate: '',
        scheduleTime: '',
        leadFile: null,
        callbackNumber: '',
        enableTranscription: true,
        enableRecording: true
    });
    
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement campaign creation logic
        console.log('Creating campaign:', formData);
        navigate(-1);
    };

    const parseCSV = (file: File): Promise<PreviewData> => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                complete: (results) => {
                    const headers = results.data[0] as string[];
                    const rows = results.data.slice(1) as string[][];
                    resolve({ headers, rows });
                },
                error: (error) => reject(error),
                header: false
            });
        });
    };

    const parseExcel = async (file: File): Promise<PreviewData> => {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        const headers = data[0] as string[];
        const rows = data.slice(1) as string[][];
        return { headers, rows };
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        try {
            const fileExt = file.name.split('.').pop()?.toLowerCase();
            let parsedData: PreviewData;

            if (fileExt === 'csv') {
                parsedData = await parseCSV(file);
            } else if (['xlsx', 'xls'].includes(fileExt || '')) {
                parsedData = await parseExcel(file);
            } else {
                throw new Error('Unsupported file format');
            }

            setPreviewData(parsedData);
            setFormData(prev => ({ ...prev, leadFile: file }));
        } catch (error) {
            console.error('Error parsing file:', error);
            alert('Error parsing file. Please ensure it\'s a valid CSV or Excel file.');
        } finally {
            setIsProcessing(false);
        }
    };

    const openPreviewModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviewModalOpen(true);
    };

    const closePreviewModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviewModalOpen(false);
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-8">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mr-4 hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Voice Campaign</h1>
                        <p className="mt-1 text-sm text-gray-500">Set up a new automated voice campaign with customized settings</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold flex items-center text-gray-900">
                                    <FileText className="w-5 h-5 mr-2 text-primary" />
                                    Basic Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <Input
                                    label="Campaign Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter campaign name"
                                    required
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Campaign Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full h-24 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter campaign description"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold flex items-center text-gray-900">
                                    <Mic2 className="w-5 h-5 mr-2 text-primary" />
                                    Voice Settings
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <Dropdown
                                    label="Voice Type"
                                    value={formData.voiceType}
                                    onChange={(value) => setFormData(prev => ({ ...prev, voiceType: value }))}
                                    options={[
                                        { label: 'Female (Natural)', value: 'female_natural' },
                                        { label: 'Male (Natural)', value: 'male_natural' },
                                        { label: 'Female (AI)', value: 'female_ai' },
                                        { label: 'Male (AI)', value: 'male_ai' }
                                    ]}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Voice Script
                                    </label>
                                    <textarea
                                        value={formData.script}
                                        onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
                                        className="w-full h-40 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your voice call script..."
                                        required
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Use natural language and include variables like {'{customer_name}'} where needed
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold flex items-center text-gray-900">
                                    <Phone className="w-5 h-5 mr-2 text-primary" />
                                    Call Settings
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        type="number"
                                        label="Call Attempts"
                                        value={formData.callAttempts}
                                        onChange={(e) => setFormData(prev => ({ ...prev, callAttempts: parseInt(e.target.value) }))}
                                        min={1}
                                        max={10}
                                        required
                                    />
                                    <Input
                                        type="number"
                                        label="Retry Interval (hours)"
                                        value={formData.retryInterval}
                                        onChange={(e) => setFormData(prev => ({ ...prev, retryInterval: parseInt(e.target.value) }))}
                                        min={1}
                                        max={72}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        type="time"
                                        label="Call Start Time"
                                        value={formData.callStartTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, callStartTime: e.target.value }))}
                                        required
                                    />
                                    <Input
                                        type="time"
                                        label="Call End Time"
                                        value={formData.callEndTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, callEndTime: e.target.value }))}
                                        required
                                    />
                                </div>

                                <Input
                                    type="number"
                                    label="Max Call Duration (seconds)"
                                    value={formData.maxCallDuration}
                                    onChange={(e) => setFormData(prev => ({ ...prev, maxCallDuration: parseInt(e.target.value) }))}
                                    min={30}
                                    max={600}
                                    required
                                />

                                <Input
                                    label="Callback Number"
                                    value={formData.callbackNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, callbackNumber: e.target.value }))}
                                    placeholder="Enter callback number"
                                    required
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold flex items-center text-gray-900">
                                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                                    Campaign Schedule
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.isScheduled}
                                            onChange={(checked) => setFormData(prev => ({ ...prev, isScheduled: checked }))}
                                        />
                                        <label className="text-sm font-medium text-gray-700">Schedule Campaign</label>
                                    </div>
                                </div>

                                {formData.isScheduled && (
                                    <div className="space-y-4">
                                        <Input
                                            type="date"
                                            label="Schedule Date"
                                            value={formData.scheduleDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                                            required={formData.isScheduled}
                                        />
                                        <Input
                                            type="time"
                                            label="Schedule Time"
                                            value={formData.scheduleTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                                            required={formData.isScheduled}
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold flex items-center text-gray-900">
                                    <Upload className="w-5 h-5 mr-2 text-primary" />
                                    Import Leads
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                                    {formData.leadFile ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <span className="text-sm">{formData.leadFile.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setFormData(prev => ({ ...prev, leadFile: null }));
                                                        setPreviewData(null);
                                                    }}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {previewData && (
                                                <button
                                                    type="button"
                                                    onClick={openPreviewModal}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Preview Data
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="w-8 h-8 mx-auto text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                                {isProcessing ? 'Processing file...' : 'Drag and drop your CSV/Excel file or click to browse'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Supported formats: CSV, XLSX, XLS
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={isProcessing}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Preview Modal */}
                        {previewModalOpen && previewData && (
                            <div 
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                onClick={closePreviewModal}
                            >
                                <div 
                                    className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[80vh] overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="text-xl font-semibold">Lead Data Preview</h3>
                                        <button
                                            type="button"
                                            onClick={closePreviewModal}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <XIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-6 overflow-auto max-h-[calc(80vh-120px)]">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        {previewData.headers.map((header, index) => (
                                                            <th
                                                                key={index}
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                                            >
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {previewData.rows.slice(0, 100).map((row, rowIndex) => (
                                                        <tr key={rowIndex} className="hover:bg-gray-50">
                                                            {row.map((cell, cellIndex) => (
                                                                <td
                                                                    key={cellIndex}
                                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                                >
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {previewData.rows.length > 100 && (
                                            <div className="mt-4 text-center text-sm text-gray-500">
                                                Showing first 100 rows of {previewData.rows.length} total rows
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <Card className="overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Additional Settings</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={formData.enableTranscription}
                                                onChange={(checked) => setFormData(prev => ({ ...prev, enableTranscription: checked }))}
                                            />
                                            <label className="text-sm font-medium text-gray-700">Enable Call Transcription</label>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={formData.enableRecording}
                                                onChange={(checked) => setFormData(prev => ({ ...prev, enableRecording: checked }))}
                                            />
                                            <label className="text-sm font-medium text-gray-700">Enable Call Recording</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate(-1)}
                                className="w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="w-full bg-primary text-white"
                            >
                                Create Campaign
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}; 