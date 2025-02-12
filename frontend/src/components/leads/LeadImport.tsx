import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProgressBar } from '../ui/ProgressBar';
import { Modal } from '../ui/Modal';
import { Dropdown } from '../ui/Dropdown';
import { Upload, FileSpreadsheet, Zap, Check } from 'lucide-react';

interface ColumnMapping {
	csvColumn: string;
	appField: string;
	confidence: number;
}

const appFields = [
	'name',
	'email',
	'phone',
	'company',
	'source',
	'status',
	'channel'
];

export const LeadImport: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing'>('upload');
	const [file, setFile] = useState<File | null>(null);
	const [progress, setProgress] = useState(0);
	const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
	const [previewData, setPreviewData] = useState<any[]>([]);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setFile(file);
			// Simulate AI analysis of columns
			setTimeout(() => {
				setColumnMappings([
					{ csvColumn: 'Full Name', appField: 'name', confidence: 0.95 },
					{ csvColumn: 'Email Address', appField: 'email', confidence: 0.98 },
					{ csvColumn: 'Phone Number', appField: 'phone', confidence: 0.92 }
				]);
				setStep('mapping');
			}, 1000);
		}
	};

	const handleAIMapping = () => {
		// Simulate AI mapping process
		setProgress(0);
		const interval = setInterval(() => {
			setProgress(prev => {
				if (prev >= 100) {
					clearInterval(interval);
					setStep('preview');
					return 100;
				}
				return prev + 10;
			});
		}, 200);
	};

	const handleImport = () => {
		setStep('importing');
		// Simulate import process
		setProgress(0);
		const interval = setInterval(() => {
			setProgress(prev => {
				if (prev >= 100) {
					clearInterval(interval);
					setIsOpen(false);
					return 100;
				}
				return prev + 5;
			});
		}, 100);
	};

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>
				<Upload className="w-4 h-4 mr-2" />
				Import Leads
			</Button>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Import Leads"
				size="lg"
			>
				<div className="space-y-6">
					{step === 'upload' && (
						<div className="text-center py-12">
							<FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium mb-2">Upload CSV or Excel File</h3>
							<p className="text-secondary-text mb-6">
								Drag and drop your file here or click to browse
							</p>
							<Button as="label" className="cursor-pointer">
								Choose File
								<input
									type="file"
									className="hidden"
									accept=".csv,.xlsx,.xls"
									onChange={handleFileUpload}
								/>
							</Button>
						</div>
					)}

					{step === 'mapping' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="font-medium">Column Mapping</h3>
								<Button onClick={handleAIMapping}>
									<Zap className="w-4 h-4 mr-2" />
									Auto-Map with AI
								</Button>
							</div>
							
							<div className="space-y-4">
								{columnMappings.map((mapping, index) => (
									<div key={index} className="flex items-center space-x-4">
										<div className="flex-1">
											<label className="block text-sm font-medium text-gray-700 mb-1">
												{mapping.csvColumn}
											</label>
											<Dropdown
												value={mapping.appField}
												onChange={(value) => {
													const newMappings = [...columnMappings];
													newMappings[index].appField = value;
													setColumnMappings(newMappings);
												}}
												options={appFields.map(field => ({
													label: field.charAt(0).toUpperCase() + field.slice(1),
													value: field
												}))}
											/>
										</div>
										{mapping.confidence > 0.9 && (
											<Check className="w-5 h-5 text-green-500" />
										)}
									</div>
								))}
							</div>

							<ProgressBar progress={progress} />
						</div>
					)}

					{step === 'preview' && (
						<div className="space-y-6">
							<h3 className="font-medium">Preview Import</h3>
							<div className="border rounded-lg overflow-hidden">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											{columnMappings.map(mapping => (
												<th
													key={mapping.appField}
													className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
												>
													{mapping.appField}
												</th>
											))}
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{/* Preview rows would go here */}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{step === 'importing' && (
						<div className="space-y-6">
							<h3 className="font-medium">Importing Leads</h3>
							<ProgressBar progress={progress} />
							<p className="text-center text-secondary-text">
								Please wait while we import your leads...
							</p>
						</div>
					)}

					<div className="flex justify-end space-x-3 mt-6">
						<Button variant="ghost" onClick={() => setIsOpen(false)}>
							Cancel
						</Button>
						{step === 'mapping' && (
							<Button onClick={() => setStep('preview')}>
								Preview Import
							</Button>
						)}
						{step === 'preview' && (
							<Button onClick={handleImport}>
								Start Import
							</Button>
						)}
					</div>
				</div>
			</Modal>
		</>
	);
};