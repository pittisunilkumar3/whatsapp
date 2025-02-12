import React from 'react';
import { Card } from '../../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/TabsNew';
import { LeadsTab } from '../../components/communication/LeadsTab';
import { TemplatesTab } from '../../components/communication/TemplatesTab';
import { CampaignsTab } from '../../components/communication/CampaignsTab';

export const Email: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Email Communication</h1>
      
      <Tabs defaultValue="leads">
        <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 p-0">
          <TabsTrigger 
            value="leads"
            className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-whatsapp-green data-[state=active]:border-b-2 data-[state=active]:border-whatsapp-green data-[state=active]:shadow-none rounded-none"
          >
            Leads
          </TabsTrigger>
          <TabsTrigger 
            value="templates"
            className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-whatsapp-green data-[state=active]:border-b-2 data-[state=active]:border-whatsapp-green data-[state=active]:shadow-none rounded-none"
          >
            Email Templates
          </TabsTrigger>
          <TabsTrigger 
            value="campaigns"
            className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-whatsapp-green data-[state=active]:border-b-2 data-[state=active]:border-whatsapp-green data-[state=active]:shadow-none rounded-none"
          >
            Campaigns
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-whatsapp-green data-[state=active]:border-b-2 data-[state=active]:border-whatsapp-green data-[state=active]:shadow-none rounded-none"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-6">
          <Card className="p-6">
            <LeadsTab />
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card className="p-6">
          <TemplatesTab channel="email" />
          </Card>
        </TabsContent>


        <TabsContent value="campaigns" className="mt-6">
          <Card className="p-6">
          <CampaignsTab channel="email" />
          </Card>
        </TabsContent>


        <TabsContent value="analytics" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Email Analytics</h2>
            <div className="space-y-4">
              <p className="text-gray-600">View your email communication analytics here.</p>
              {/* Add email analytics UI here */}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
