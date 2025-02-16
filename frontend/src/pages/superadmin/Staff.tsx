import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { StatusPill } from '../../components/ui/StatusPill';
import { 
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import { Dropdown } from '../../components/ui/Dropdown';
import { useNavigate } from 'react-router-dom';

interface Staff {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  joined_date: string;
}

const mockStaff: Staff[] = [
  {
    id: '1',
    employee_id: 'EMP001',
    name: 'John Smith',
    email: 'john@butterfly.com',
    phone: '+1 234 567 8900',
    department: 'Engineering',
    role: 'Senior Developer',
    status: 'active',
    joined_date: '2024-01-15'
  },
  {
    id: '2',
    employee_id: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah@butterfly.com',
    phone: '+1 234 567 8901',
    department: 'Sales',
    role: 'Sales Manager',
    status: 'active',
    joined_date: '2024-02-01'
  }
];

export const Staff: React.FC = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: ''
  });

  const columns = [
    {
      header: 'Employee ID',
      accessorKey: 'employee_id'
    },
    {
      header: 'Name',
      accessorKey: 'name'
    },
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Department',
      accessorKey: 'department'
    },
    {
      header: 'Role',
      accessorKey: 'role'
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info: any) => <StatusPill status={info.getValue()} />
    },
    {
      header: 'Joined Date',
      accessorKey: 'joined_date'
    },
    {
      header: 'Actions',
      cell: () => (
        <Dropdown
          trigger={
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          }
          items={[
            { label: 'Edit', onClick: () => {} },
            { label: 'View Details', onClick: () => {} },
            { label: 'Deactivate', onClick: () => {} }
          ]}
        />
      )
    }
  ];

  const handleAddStaff = () => {
    // Handle staff addition logic
    console.log('Adding new staff:', newStaff);
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage staff members and their roles
          </p>
        </div>
        <Button onClick={() => navigate('/superadmin/addstaff')} className="w-full sm:w-auto">
          <UserPlus className="w-5 h-5 mr-2" />
          Add Staff
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </Card>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={mockStaff}
          pagination
        />
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Staff"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              value={newStaff.name}
              onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <Input
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-2" />
              <Input
                value={newStaff.phone}
                onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <div className="flex items-center">
              <Building2 className="w-5 h-5 text-gray-400 mr-2" />
              <Input
                value={newStaff.department}
                onChange={(e) => setNewStaff(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Enter department"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Input
              value={newStaff.role}
              onChange={(e) => setNewStaff(prev => ({ ...prev, role: e.target.value }))}
              placeholder="Enter role"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff}>
              Add Staff
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 