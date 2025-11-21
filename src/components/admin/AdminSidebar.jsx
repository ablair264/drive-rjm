import { LayoutDashboard, Mail, Calendar, Users, ClipboardCheck, ExternalLink, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'enquiries', label: 'Enquiries', icon: Mail },
  { id: 'planner', label: 'Lesson Planner', icon: Calendar },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'tests', label: 'Tests', icon: ClipboardCheck }
];

export default function AdminSidebar({ activeTab, onTabChange }) {
  const { logout } = useAuth();

  return (
    <aside className="bg-white border-b md:border-b-0 md:border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-dark font-rajdhani">Drive RJM</h1>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>

      <nav className="mt-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-learner-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-6 border-t border-gray-200 space-y-3">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ExternalLink size={16} />
          View site
        </a>
      </div>
    </aside>
  );
}
