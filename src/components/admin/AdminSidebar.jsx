import { LayoutDashboard, Mail, Calendar, Users, ClipboardCheck } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'enquiries', label: 'Enquiries', icon: Mail },
  { id: 'planner', label: 'Lesson Planner', icon: Calendar },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'tests', label: 'Tests', icon: ClipboardCheck }
];

export default function AdminSidebar({ activeTab, onTabChange }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-dark font-rajdhani">Drive RJM</h1>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>

      <nav className="mt-6">
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
    </aside>
  );
}
