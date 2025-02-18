import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { Switch } from '../../components/ui/Switch';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import {
    Link,
    Settings,
    Plus,
    Edit2,
    Trash2,
    RefreshCw,
    Globe,
    Key,
    Shield,
    CheckCircle,
    Phone,
    MessageSquare,
    Save,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThirdPartyUrl {
    id: string;
    name: string;
    url: string;
    apiKey: string;
    isActive: boolean;
    lastChecked: string;
    status: 'active' | 'inactive' | 'error';
    description: string;
}

interface TwilioConfig {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
    messagingServiceSid: string;
    region: string;
    apiBaseUrl: string;
    isActive: boolean;
}

interface UltravoxConfig {
    id?: string;
    apiKey: string;
    apiUrl: string;
    model: string;
    voice: string;
    firstSpeaker: string;
    systemPrompt: string;
    isActive: boolean;
}

export const ThirdPartyUrl: React.FC = () => {
    const { user } = useAuthStore();
    const companyId = user?.company?.id;
    const [activeTab, setActiveTab] = useState('urls');
    const [showNewUrl, setShowNewUrl] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState<ThirdPartyUrl | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [configId, setConfigId] = useState<number | null>(null);
    const [ultravoxLoading, setUltravoxLoading] = useState(false);
    const [ultravoxConfigId, setUltravoxConfigId] = useState<string | null>(null);

    // Updated Twilio Configuration State
    const [twilioConfig, setTwilioConfig] = useState<TwilioConfig>({
        accountSid: '',
        authToken: '',
        phoneNumber: '',
        messagingServiceSid: '',
        region: 'us1',
        apiBaseUrl: 'https://api.twilio.com',
        isActive: false
    });

    // Updated Ultravox Configuration State
    const [ultravoxConfig, setUltravoxConfig] = useState<UltravoxConfig>({
        apiKey: '',
        apiUrl: 'https://api.ultravox.ai',
        model: 'fixie-ai/ultravox',
        voice: 'terrence',
        firstSpeaker: 'FIRST_SPEAKER_USER',
        systemPrompt: '',
        isActive: false
    });

    const [urls] = useState<ThirdPartyUrl[]>([
        {
            id: '1',
            name: 'Payment Gateway API',
            url: 'https://api.payment-gateway.com',
            apiKey: '**********************',
            isActive: true,
            lastChecked: '2024-03-15 10:30 AM',
            status: 'active',
            description: 'Integration with payment processing system'
        },
        {
            id: '2',
            name: 'Shipping Service',
            url: 'https://api.shipping-service.com',
            apiKey: '**********************',
            isActive: true,
            lastChecked: '2024-03-15 09:45 AM',
            status: 'active',
            description: 'Integration with shipping provider'
        }
    ]);

    // Add this console log to check user and company data
    useEffect(() => {
        console.log('User data:', user);
        console.log('Company ID:', companyId);
    }, [user, companyId]);

    // Fetch existing Twilio configuration
    useEffect(() => {
        const fetchTwilioConfig = async () => {
            if (!companyId) return;
            
            setIsLoading(true);
            try {
                const response = await apiService.getTwilioConfigByCompany(companyId);
                if (response.success && response.data) {
                    setTwilioConfig({
                        accountSid: response.data.account_sid,
                        authToken: response.data.auth_token,
                        phoneNumber: response.data.phone_number,
                        messagingServiceSid: response.data.messaging_service_sid,
                        region: response.data.region,
                        apiBaseUrl: response.data.api_base_url,
                        isActive: true
                    });
                    setConfigId(response.data.id);
                }
            } catch (error) {
                console.error('Error fetching Twilio config:', error);
                toast.error('Failed to load Twilio configuration');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTwilioConfig();
    }, [companyId]);

    const handleTwilioConfigSave = async () => {
        if (!companyId) {
            toast.error('Company ID not found');
            return;
        }

        setIsLoading(true);
        try {
            const configData = {
                company_id: companyId,
                account_sid: twilioConfig.accountSid,
                auth_token: twilioConfig.authToken,
                phone_number: twilioConfig.phoneNumber,
                messaging_service_sid: twilioConfig.messagingServiceSid,
                region: twilioConfig.region,
                api_base_url: twilioConfig.apiBaseUrl
            };

            let response;
            if (configId) {
                response = await apiService.updateTwilioConfig(configId, configData);
            } else {
                response = await apiService.createTwilioConfig(configData);
                setConfigId(response.data.id);
            }

            if (response.success) {
                toast.success('Twilio configuration saved successfully');
            }
        } catch (error) {
            console.error('Error saving Twilio config:', error);
            toast.error('Failed to save Twilio configuration');
        } finally {
            setIsLoading(false);
        }
    };

    // Update the Ultravox configuration fetch
    useEffect(() => {
        const fetchUltravoxConfig = async () => {
            if (!companyId) {
                console.log('No company ID available:', { user });
                return;
            }
            
            console.log('Fetching Ultravox config for company:', companyId);
            setUltravoxLoading(true);
            
            try {
                const response = await apiService.getUltravoxConfigByCompany(companyId);
                console.log('Raw Ultravox API response:', response);
                
                if (response.success && response.data && response.data.length > 0) {
                    // Get the first configuration from the array
                    const config = response.data[0];
                    console.log('Setting Ultravox config with data:', config);
                    
                    setUltravoxConfig({
                        apiKey: config.apikey || '',
                        apiUrl: config.apiurl || 'https://api.ultravox.ai',
                        model: config.model || 'fixie-ai/ultravox',
                        voice: config.voice || 'terrence',
                        firstSpeaker: config.firstspeaker || 'FIRST_SPEAKER_USER',
                        systemPrompt: config.system_prompt || '',
                        isActive: config.is_active ?? true
                    });
                    setUltravoxConfigId(config.id.toString());
                    console.log('Ultravox config state updated');
                } else {
                    console.log('No existing Ultravox config found or invalid response:', response);
                    // Reset to default values if no configuration exists
                    setUltravoxConfig({
                        apiKey: '',
                        apiUrl: 'https://api.ultravox.ai',
                        model: 'fixie-ai/ultravox',
                        voice: 'terrence',
                        firstSpeaker: 'FIRST_SPEAKER_USER',
                        systemPrompt: '',
                        isActive: false
                    });
                    setUltravoxConfigId(null);
                }
            } catch (error) {
                console.error('Error fetching Ultravox config:', error);
                if (error instanceof Error) {
                    console.error('Error details:', error.message);
                }
                toast.error('Failed to load Ultravox configuration');
                // Reset to default values on error
                setUltravoxConfig({
                    apiKey: '',
                    apiUrl: 'https://api.ultravox.ai',
                    model: 'fixie-ai/ultravox',
                    voice: 'terrence',
                    firstSpeaker: 'FIRST_SPEAKER_USER',
                    systemPrompt: '',
                    isActive: false
                });
                setUltravoxConfigId(null);
            } finally {
                setUltravoxLoading(false);
            }
        };

        fetchUltravoxConfig();
    }, [companyId]);

    const handleUltravoxConfigSave = async () => {
        if (!companyId) {
            console.error('No company ID available for saving config');
            toast.error('Company ID not found');
            return;
        }

        console.log('Saving Ultravox config for company:', companyId);
        setUltravoxLoading(true);
        
        try {
            const configData = {
                company_id: companyId,
                apikey: ultravoxConfig.apiKey,
                apiurl: ultravoxConfig.apiUrl,
                model: ultravoxConfig.model,
                voice: ultravoxConfig.voice,
                firstspeaker: ultravoxConfig.firstSpeaker,
                system_prompt: ultravoxConfig.systemPrompt,
                is_active: ultravoxConfig.isActive
            };

            console.log('Ultravox config data to save:', configData);

            let response;
            if (ultravoxConfigId) {
                console.log('Updating existing config:', ultravoxConfigId);
                response = await apiService.updateUltravoxConfig(ultravoxConfigId, configData);
            } else {
                console.log('Creating new config');
                response = await apiService.createUltravoxConfig(configData);
                setUltravoxConfigId(response.data.id);
            }

            console.log('Save response:', response);

            if (response.success) {
                toast.success('Ultravox configuration saved successfully');
            }
        } catch (error) {
            console.error('Error saving Ultravox config:', error);
            toast.error('Failed to save Ultravox configuration');
        } finally {
            setUltravoxLoading(false);
        }
    };

    const renderUrls = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Input
                        placeholder="Search URLs..."
                        className="w-full sm:w-64"
                        icon={<Globe className="w-4 h-4 text-gray-400" />}
                    />
                </div>
                <Button 
                    onClick={() => setShowNewUrl(true)} 
                    className="w-full sm:w-auto bg-primary text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New URL
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {urls.map((url) => (
                    <Card key={url.id} className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">{url.name}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        url.status === 'active' ? 'bg-green-100 text-green-800' :
                                        url.status === 'error' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {url.status.charAt(0).toUpperCase() + url.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{url.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">{url.url}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Key className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">{url.apiKey}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" onClick={() => setSelectedUrl(url)}>
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Switch
                                    checked={url.isActive}
                                    onChange={() => {}}
                                    label="Active"
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderTwilioConfig = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold">Twilio Configuration</h3>
                        <p className="text-sm text-gray-500 mt-1">Configure your Twilio integration settings</p>
                    </div>
                    <Switch
                        checked={twilioConfig.isActive}
                        onChange={(checked) => setTwilioConfig(prev => ({ ...prev, isActive: checked }))}
                        label="Active"
                    />
                </div>
                <div className="space-y-4">
                    <Input
                        label="Account SID"
                        value={twilioConfig.accountSid}
                        onChange={(e) => setTwilioConfig(prev => ({ ...prev, accountSid: e.target.value }))}
                        placeholder="Enter your Twilio Account SID"
                        icon={<Key className="w-4 h-4" />}
                        required
                    />
                    <Input
                        label="Auth Token"
                        type="password"
                        value={twilioConfig.authToken}
                        onChange={(e) => setTwilioConfig(prev => ({ ...prev, authToken: e.target.value }))}
                        placeholder="Enter your Twilio Auth Token"
                        icon={<Shield className="w-4 h-4" />}
                        required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Phone Number"
                            value={twilioConfig.phoneNumber}
                            onChange={(e) => setTwilioConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            placeholder="Enter your Twilio Phone Number"
                            icon={<Phone className="w-4 h-4" />}
                            required
                        />
                        <Input
                            label="Region"
                            value={twilioConfig.region}
                            onChange={(e) => setTwilioConfig(prev => ({ ...prev, region: e.target.value }))}
                            placeholder="Enter Twilio region"
                            icon={<Globe className="w-4 h-4" />}
                        />
                    </div>
                    <Input
                        label="Messaging Service SID"
                        value={twilioConfig.messagingServiceSid}
                        onChange={(e) => setTwilioConfig(prev => ({ ...prev, messagingServiceSid: e.target.value }))}
                        placeholder="Enter your Messaging Service SID"
                        icon={<MessageSquare className="w-4 h-4" />}
                    />
                    <Input
                        label="API Base URL"
                        value={twilioConfig.apiBaseUrl}
                        onChange={(e) => setTwilioConfig(prev => ({ ...prev, apiBaseUrl: e.target.value }))}
                        placeholder="Enter Twilio API Base URL"
                        icon={<Globe className="w-4 h-4" />}
                    />
                    <div className="flex justify-end">
                        <Button 
                            onClick={handleTwilioConfigSave} 
                            className="bg-primary text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Configuration
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderUltravoxConfig = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold">Ultravox Configuration</h3>
                        <p className="text-sm text-gray-500 mt-1">Configure your Ultravox AI integration settings</p>
                    </div>
                    <Switch
                        checked={ultravoxConfig.isActive}
                        onChange={(checked) => setUltravoxConfig(prev => ({ ...prev, isActive: checked }))}
                        label="Active"
                    />
                </div>
                <div className="space-y-4">
                    <Input
                        label="API Key"
                        type="password"
                        value={ultravoxConfig.apiKey}
                        onChange={(e) => setUltravoxConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="Enter your Ultravox API Key"
                        icon={<Key className="w-4 h-4" />}
                        required
                    />
                    <Input
                        label="API URL"
                        value={ultravoxConfig.apiUrl}
                        onChange={(e) => setUltravoxConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                        placeholder="Enter Ultravox API URL"
                        icon={<Globe className="w-4 h-4" />}
                        required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Model"
                            value={ultravoxConfig.model}
                            onChange={(e) => setUltravoxConfig(prev => ({ ...prev, model: e.target.value }))}
                            placeholder="Enter model name"
                            icon={<Settings className="w-4 h-4" />}
                        />
                        <Input
                            label="Voice"
                            value={ultravoxConfig.voice}
                            onChange={(e) => setUltravoxConfig(prev => ({ ...prev, voice: e.target.value }))}
                            placeholder="Enter voice name"
                            icon={<MessageSquare className="w-4 h-4" />}
                        />
                    </div>
                    <Input
                        label="First Speaker"
                        value={ultravoxConfig.firstSpeaker}
                        onChange={(e) => setUltravoxConfig(prev => ({ ...prev, firstSpeaker: e.target.value }))}
                        placeholder="Enter first speaker setting"
                        icon={<Phone className="w-4 h-4" />}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
                        <textarea
                            value={ultravoxConfig.systemPrompt}
                            onChange={(e) => setUltravoxConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                            placeholder="Enter system prompt"
                            className="w-full min-h-[120px] p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button 
                            onClick={handleUltravoxConfigSave} 
                            className="bg-primary text-white"
                            disabled={ultravoxLoading}
                        >
                            {ultravoxLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Configuration
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">SSL Verification</span>
                            </div>
                            <p className="text-sm text-gray-500">Verify SSL certificates when making API calls</p>
                        </div>
                        <Switch checked={true} onChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">Health Checks</span>
                            </div>
                            <p className="text-sm text-gray-500">Automatically check URL health status</p>
                        </div>
                        <Switch checked={true} onChange={() => {}} />
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 max-w-[1400px] mx-auto"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-3xl font-bold">Third-Party URLs</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage external service integrations and API endpoints
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
                    <Button variant="ghost" className="flex-1 sm:flex-none">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Status
                    </Button>
                    <Button variant="ghost" className="flex-1 sm:flex-none">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            <Tabs
                tabs={[
                    { id: 'urls', label: 'URLs', icon: <Link className="w-4 h-4" /> },
                    { id: 'twilio', label: 'Twilio', icon: <Phone className="w-4 h-4" /> },
                    { id: 'ultravox', label: 'Ultravox', icon: <MessageSquare className="w-4 h-4" /> },
                    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'urls' && renderUrls()}
                        {activeTab === 'twilio' && renderTwilioConfig()}
                        {activeTab === 'ultravox' && renderUltravoxConfig()}
                        {activeTab === 'settings' && renderSettings()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* New URL Modal */}
            <Modal
                isOpen={showNewUrl}
                onClose={() => setShowNewUrl(false)}
                title="Add New Third-Party URL"
            >
                <div className="space-y-4">
                    <Input label="Name" placeholder="Enter service name" />
                    <Input label="URL" placeholder="Enter service URL" icon={<Globe className="w-4 h-4" />} />
                    <Input label="API Key" placeholder="Enter API key" type="password" icon={<Key className="w-4 h-4" />} />
                    <Input label="Description" placeholder="Enter service description" />
                    <div className="flex justify-end space-x-3">
                        <Button variant="ghost" onClick={() => setShowNewUrl(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-primary text-white">
                            Add URL
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit URL Modal */}
            <Modal
                isOpen={!!selectedUrl}
                onClose={() => setSelectedUrl(null)}
                title="Edit Third-Party URL"
            >
                {selectedUrl && (
                    <div className="space-y-4">
                        <Input label="Name" defaultValue={selectedUrl.name} />
                        <Input label="URL" defaultValue={selectedUrl.url} icon={<Globe className="w-4 h-4" />} />
                        <Input label="API Key" defaultValue={selectedUrl.apiKey} type="password" icon={<Key className="w-4 h-4" />} />
                        <Input label="Description" defaultValue={selectedUrl.description} />
                        <div className="flex justify-end space-x-3">
                            <Button variant="ghost" onClick={() => setSelectedUrl(null)}>
                                Cancel
                            </Button>
                            <Button className="bg-primary text-white">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
}; 