import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Auth Components
import { Login } from '../pages/auth/Login';
import { SuperAdminLogin } from '../pages/auth/SuperAdminLogin';
import { AuthGuard } from '../components/auth/AuthGuard';


// Core Components
import { SuperAdminProfile } from '../pages/super-admin/Profile';
import { CompanyAdminProfile } from '../pages/company-admin/Profile';
import { EmployeeProfile } from '../pages/employee/Profile';
import { CompanyAdminDashboard } from '../pages/company-admin/Dashboard';
import { CommunicationHub } from '../pages/CommunicationHub';
import { Leads } from '../pages/Leads';
import { Analytics } from '../pages/Analytics';
import { Campaigns } from '../pages/Campaigns';

// Communication Components
import { Voice } from '../pages/communication/Voice';
import { VoiceCampaignCreation } from '../pages/communication/VoiceCampaignCreation';
import { WhatsApp } from '../pages/communication/WhatsApp';
import { SMS } from '../pages/communication/SMS';
import { Email } from '../pages/communication/Email';

// Super Admin Components
import { SuperAdminDashboard } from '../pages/super-admin/Dashboard';
import { RolePermissions } from '../pages/super-admin/RolePermissions';
import { Companies } from '../pages/super-admin/Companies';
import { AddCompany } from '../pages/super-admin/AddCompany';
import { BillingPage } from '../pages/super-admin/Billing';
import { AuditLogs } from '../pages/super-admin/AuditLogs';
import { SettingsPage } from '../pages/super-admin/settings';
import { Permissions } from '../pages/super-admin/Permissions';
import EmailIntegration from '../pages/super-admin/EmailIntegration';
import CompanyEmailIntegration from '../pages/company-admin/communication/EmailIntegration';
import { RoleManagement } from '../pages/super-admin/RoleManagement';
import { CompanyRoleManagement } from '../pages/company-admin/RoleManagement';
import { Staff } from '../pages/super-admin/Staff';
import { AddStaff } from '../pages/super-admin/AddStaff';

// Company Admin Components
import { Employees } from '../pages/company-admin/Employees';
import { EmployeePermissions } from '../pages/company-admin/EmployeePermissions';
import { AddEmployee } from '../pages/company-admin/AddEmployee';
import { ThirdPartyUrl } from '../pages/settings/ThirdPartyUrl';

// Employee Components
import { EmployeeDashboard } from '../pages/employee/Dashboard';

// Store
import { useAuthStore } from '../store/authStore';

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-secondary-gray">
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-primary-text mb-2">Unauthorized Access</h1>
      <p className="text-secondary-text">You don't have permission to access this page.</p>
    </div>
  </div>
);

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<'super_admin' | 'company_admin' | 'employee'>;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

// Public routes that don't require authentication
const PublicRoutes = () => {
  const { isAuthenticated, user, company } = useAuthStore();

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (company) {
      return <Navigate to="/company/dashboard" replace />;
    }
    if (user) {
      switch (user.role) {
        case 'super_admin':
          return <Navigate to="/superadmin/dashboard" replace />;
        case 'company_admin':
          return <Navigate to="/company-admin/dashboard" replace />;
        case 'employee':
          return <Navigate to="/employee/dashboard" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  return <Outlet />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
        <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>


      {/* Shared Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      <Route element={<AuthGuard />}>
        {/* Super Admin Routes */}
        <Route path="/superadmin/*" element={
          <RoleGuard allowedRoles={['super_admin']}>
            <Routes>
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="profile" element={<SuperAdminProfile />} />
                <Route path="companies" element={<Companies />} />
                <Route path="addcompany" element={<AddCompany />} />
                <Route path="staff" element={<Staff />} />
                <Route path="addstaff" element={<AddStaff />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="role-permissions" element={<RolePermissions />} />
                <Route path="permissions/:id" element={<Permissions />} />
                <Route path="permissions" element={<Permissions />} />
                <Route path="email-integration" element={<EmailIntegration />} />
                <Route path="role-management" element={<RoleManagement />} />
            </Routes>
          </RoleGuard>
        } />

        {/* Company Admin Routes */}
        <Route path="/company-admin/*" element={
          <RoleGuard allowedRoles={['company_admin']}>
            <Routes>
                <Route path="dashboard" element={<CompanyAdminDashboard />} />
                <Route path="profile" element={<CompanyAdminProfile />} />
                <Route path="employees" element={<Employees />} />
                <Route path="addemployee" element={<AddEmployee />} />
                <Route path="communication" element={<CommunicationHub />} />
                <Route path="communication/voice" element={<Voice />} />
                <Route path="communication/voice/new-campaign" element={<VoiceCampaignCreation />} />
                <Route path="communication/whatsapp" element={<WhatsApp />} />
                <Route path="communication/sms" element={<SMS />} />
                <Route path="communication/email" element={<Email />} />
                <Route path="communication/email-integration" element={<CompanyEmailIntegration />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="leads" element={<Leads />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="settings/third-party-url" element={<ThirdPartyUrl />} />
                <Route path="employee-permissions/:id" element={<EmployeePermissions />} />
                <Route path="role-management" element={<CompanyRoleManagement />} />
            </Routes>
          </RoleGuard>
        } />

        {/* Employee Routes */}
        <Route path="/employee/*" element={
          <RoleGuard allowedRoles={['employee']}>
            <Routes>
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="profile" element={<EmployeeProfile />} />
                <Route path="communication" element={<CommunicationHub />} />
              <Route path="communication/voice" element={<Voice />} />
              <Route path="communication/whatsapp" element={<WhatsApp />} />
              <Route path="communication/sms" element={<SMS />} />
              <Route path="communication/email" element={<Email />} />
                <Route path="analytics" element={<Analytics />} />

            </Routes>
          </RoleGuard>
        } />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};