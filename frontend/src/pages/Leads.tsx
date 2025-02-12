import React from 'react';
import { Card } from '../components/ui/Card';
import { StatusPill } from '../components/ui/StatusPill';

export const Leads: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Leads Management</h1>
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-medium">All Leads</h2>
          <button className="w-full sm:w-auto bg-whatsapp-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 text-sm sm:text-base">
            Add New Lead
          </button>
        </div>
        
        {/* Mobile view */}
        <div className="block sm:hidden space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">John Doe</span>
              <StatusPill status="active" />
            </div>
            <div className="text-xs text-secondary-text">
              <div>john.doe@example.com</div>
              <div className="mt-1">Website</div>
            </div>
          </div>
          {/* Add more mobile lead cards here */}
        </div>

        {/* Desktop view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-4 text-sm text-secondary-text">
                  No leads available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};