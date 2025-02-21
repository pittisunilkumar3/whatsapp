import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { fetchSuperAdminSidebar, fetchCompanySidebarMenus } from '../../services/sidebarService';
import {
  Squares2X2Icon as LayoutDashboardIcon,
  ChatBubbleLeftRightIcon as MessageSquareIcon,
  PhoneIcon,
  EnvelopeIcon as MailIcon,
  UsersIcon,
  ChartBarIcon as BarChartIcon,
  Cog6ToothIcon as SettingsIcon,
  ChevronRightIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  CircleStackIcon as CircleDotIcon
} from '@heroicons/react/24/outline';

type Role = 'super_admin' | 'company_admin' | 'employee';

interface NavGroup {
  name: string;
  icon: any;
  items: Array<{ name: string; href: string; icon?: any }>;
}

const navigationByRole: Record<Role, Array<{ name: string; href: string; icon: any } | NavGroup>> = {
  super_admin: [
    { name: 'Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboardIcon },
    { name: 'Companies', href: '/superadmin/companies', icon: UsersIcon },
    { name: 'Staff', href: '/superadmin/staff', icon: UsersIcon },
    { name: 'Email Integration', href: '/superadmin/email-integration', icon: MailIcon },
    { name: 'Role Management', href: '/superadmin/role-management', icon: UsersIcon },
    { name: 'Permissions', href: '/superadmin/permissions', icon: SettingsIcon },
    { name: 'Audit Logs', href: '/superadmin/audit-logs', icon: CircleDotIcon },
    { name: 'Settings', href: '/superadmin/settings', icon: SettingsIcon },
  ],
  company_admin: [
    { name: 'Dashboard', href: '/company-admin/dashboard', icon: LayoutDashboardIcon },
    {
      name: 'Communication',
      icon: MessageSquareIcon,
      items: [
        { name: 'Hub', href: '/company-admin/communication', icon: MessageSquareIcon },
        { name: 'Voice', href: '/company-admin/communication/voice', icon: PhoneIcon },
        { name: 'WhatsApp', href: '/company-admin/communication/whatsapp', icon: MessageSquareIcon },
        { name: 'SMS', href: '/company-admin/communication/sms', icon: MessageSquareIcon },
        { name: 'Email', href: '/company-admin/communication/email', icon: MailIcon },
        { name: 'Email Settings', href: '/company-admin/communication/email-integration', icon: MailIcon },
      ]
    },
    { name: 'Employees', href: '/company-admin/employees', icon: UsersIcon },
    { name: 'Role Management', href: '/company-admin/role-management', icon: UsersIcon },
    { name: 'Analytics', href: '/company-admin/analytics', icon: BarChartIcon },
    {
      name: 'Settings',
      icon: SettingsIcon,
      items: [
        { name: 'General', href: '/company-admin/settings', icon: SettingsIcon },
        { name: 'Third-Party URLs', href: '/company-admin/settings/third-party-url', icon: SettingsIcon },
        { name: 'Employee Permissions', href: '/company-admin/employee-permissions', icon: SettingsIcon }
      ]
    }
  ],
  employee: [
    { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboardIcon },
    { name: 'Communication Hub', href: '/employee/communication', icon: MessageSquareIcon },
    { name: 'Voice', href: '/employee/communication/voice', icon: PhoneIcon },
    { name: 'WhatsApp', href: '/employee/communication/whatsapp', icon: MessageSquareIcon },
    { name: 'SMS', href: '/employee/communication/sms', icon: MessageSquareIcon },
    { name: 'Email', href: '/employee/communication/email', icon: MailIcon },
    { name: 'Analytics', href: '/employee/analytics', icon: BarChartIcon },
    { name: 'Settings', href: '/employee/settings', icon: SettingsIcon },
  ],
};

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    LayoutDashboard: LayoutDashboardIcon,
    MessageSquare: MessageSquareIcon,
    PhoneCall: PhoneIcon,
    Mail: MailIcon,
    Users: UsersIcon,
    BarChart2: BarChartIcon,
    Settings: SettingsIcon,
  };

  // Handle Font Awesome icons
  if (iconName?.startsWith('fa ')) {
    return ({ className }: { className?: string }) => (
      <i className={`${iconName} ${className}`} />
    );
  }

  return iconMap[iconName] || CircleDotIcon;
};

export const Sidebar: React.FC = () => {
  const userRole = useAuthStore(state => state.user?.role) as Role;
  const [navigation, setNavigation] = useState<Array<{ name: string; href: string; icon: any } | NavGroup>>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSidebarData = async () => {
      if (userRole === 'super_admin') {
      try {
        const sidebarData = await fetchSuperAdminSidebar();
        const formattedNavigation = sidebarData.map(item => {
        const icon = getIconComponent(item.icon);
        if (item.submenus.length > 1) {
          return {
          name: item.menu,
          icon,
          items: item.submenus.map(submenu => ({
            name: submenu.menu,
            href: submenu.url,
            icon
          }))
          };
        }
        return {
          name: item.menu,
          href: item.submenus[0]?.url || '#',
          icon
        };
        });
        setNavigation(formattedNavigation);
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error);
        setNavigation(navigationByRole[userRole] || []);
      }
        } else if (userRole === 'company_admin') {
        try {
          const companyMenus = await fetchCompanySidebarMenus();
          const formattedNavigation = companyMenus.map(item => {
          const icon = getIconComponent(item.icon);
          if (item.sub_menus.length > 1) {
            return {
            name: item.menu,
            icon,
            items: item.sub_menus.map(submenu => ({
              name: submenu.menu,
              href: submenu.url,
              icon
            }))
            };
          }
          return {
            name: item.menu,
            href: item.sub_menus[0]?.url || '#',
            icon
          };
          });
          setNavigation(formattedNavigation);
        } catch (error) {
          console.error('Failed to fetch company menus:', error);
          setNavigation(navigationByRole[userRole] || []);
        }
      } else {
      setNavigation(navigationByRole[userRole] || []);
      }
    };

    loadSidebarData();
  }, [userRole]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  const isGroup = (item: any): item is NavGroup => {
    return 'items' in item;
  };

  const renderNavItem = (item: any, isNested = false) => {
    if (isGroup(item)) {
      return (
        <div key={`group-${item.name}`} className="mb-2">
          <button
            onClick={() => toggleGroup(item.name)}
            className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-white/70 hover:text-white touch-manipulation"
          >
            <div className="flex items-center">
              {item.icon && <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />}
              <span>{item.name}</span>
            </div>
            <ChevronRightIcon 
              className={`w-4 h-4 transition-transform ${
              expandedGroups.includes(item.name) ? 'transform rotate-90' : ''
              }`}
            />
          </button>
          {expandedGroups.includes(item.name) && (
            <div className="ml-4 space-y-1">
              {item.items.map((subItem, index) => (
                <NavLink
                  key={`${item.name}-${subItem.name}-${index}`}
                  to={subItem.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-1
                    transition-colors duration-200 touch-manipulation pl-4
                    ${isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span className="truncate">{subItem.name}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={`nav-${item.name}-${item.href}`}
        to={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={({ isActive }) =>
          `flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-1
          transition-colors duration-200 touch-manipulation
          ${isActive
            ? 'bg-white/10 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
          } ${isNested ? 'pl-4' : ''}`
        }
      >
        {item.icon && <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />}
        <span className="truncate">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 rounded-lg bg-whatsapp-green text-white touch-manipulation shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? (
            <XIcon className="w-5 h-5" />
            ) : (
            <MenuIcon className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-40 h-screen w-[280px] lg:w-64
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:relative
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-whatsapp-green min-h-screen flex flex-col
          shadow-xl lg:shadow-none
        `}
      >
        <div className="p-4 sm:p-6 mt-12 lg:mt-0">
          <h1 className="text-lg sm:text-2xl font-semibold text-white">Butterfly CRM</h1>
        </div>
        <nav className="flex-1 px-3 sm:px-4 pb-4 overflow-y-auto">
          {navigation.map(item => renderNavItem(item))}
        </nav>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
    </>
  );
};