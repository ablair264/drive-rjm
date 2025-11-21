import { LogOut, Plus, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminHeader({ onCreateLesson, onCreateStudent, currentTab }) {
  const { logout } = useAuth();

  const showCreateButtons = currentTab === 'planner' || currentTab === 'students';

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark font-rajdhani">
            {currentTab === 'dashboard' && 'Dashboard'}
            {currentTab === 'enquiries' && 'Enquiries'}
            {currentTab === 'planner' && 'Lesson Planner'}
            {currentTab === 'students' && 'Students'}
            {currentTab === 'tests' && 'Tests'}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {showCreateButtons && (
            <>
              {currentTab === 'planner' && (
                <button
                  onClick={onCreateLesson}
                  className="flex items-center gap-2 bg-learner-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus size={20} />
                  Create Lesson
                </button>
              )}

              {currentTab === 'students' && (
                <button
                  onClick={onCreateStudent}
                  className="flex items-center gap-2 bg-learner-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <UserPlus size={20} />
                  Add Student
                </button>
              )}
            </>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-700 hover:text-learner-red transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
