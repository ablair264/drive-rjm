import { Menu, Plus, UserPlus } from 'lucide-react';

export default function AdminHeader({ onCreateLesson, onCreateStudent, onCreateTest, currentTab, onToggleSidebar }) {
  const showCreateButtons = currentTab === 'planner' || currentTab === 'students';

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <button
            className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-700 hover:border-learner-red transition-colors"
            onClick={onToggleSidebar}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-dark font-rajdhani">
            {currentTab === 'dashboard' && 'Dashboard'}
            {currentTab === 'enquiries' && 'Enquiries'}
            {currentTab === 'planner' && 'Lesson Planner'}
            {currentTab === 'students' && 'Students'}
            {currentTab === 'tests' && 'Tests'}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
          <div className="flex flex-wrap gap-2">
            {showCreateButtons && currentTab === 'planner' && (
              <button
                onClick={onCreateLesson}
                className="flex items-center gap-2 bg-learner-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                <Plus size={18} className="md:hidden" />
                <Plus size={20} className="hidden md:block" />
                Create Lesson
              </button>
            )}
            {showCreateButtons && currentTab === 'students' && (
              <button
                onClick={onCreateStudent}
                className="flex items-center gap-2 bg-learner-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                <UserPlus size={18} className="md:hidden" />
                <UserPlus size={20} className="hidden md:block" />
                Add Student
              </button>
            )}
            {currentTab === 'tests' && (
              <button
                onClick={onCreateTest}
                className="flex items-center gap-2 bg-learner-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                <Plus size={18} className="md:hidden" />
                <Plus size={20} className="hidden md:block" />
                Book Test
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
