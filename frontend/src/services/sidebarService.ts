import axios from 'axios';

interface SubMenu {
	id: number;
	menu: string;
	key: string;
	lang_key: string;
	url: string;
	level: number;
	access_permissions: string;
	permission_group_id: number;
	activate_controller: string;
	activate_methods: string;
	addon_permission: null | string;
	is_active: number;
}

interface SidebarItem {
	id: number;
	permission_group_id: number;
	icon: string;
	menu: string;
	activate_menu: string;
	lang_key: string;
	system_level: number;
	level: number;
	sidebar_display: number;
	access_permissions: string;
	is_active: number;
	created_at: string;
	submenus: SubMenu[];
}

export const fetchSuperAdminSidebar = async () => {
	const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/superadmin-sidebar/superadmin-sidebar-combined`);
	return response.data.data as SidebarItem[];
};