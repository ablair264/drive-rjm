import { useState } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import CalendarHeader from './LessonPlanner/CalendarHeader';
import MonthView from './LessonPlanner/MonthView';
import WeekView from './LessonPlanner/WeekView';
import AgendaView from './LessonPlanner/AgendaView';
import CreateLessonModal from './LessonPlanner/CreateLessonModal';
import DayDetailModal from './LessonPlanner/DayDetailModal';
import CreateStudentModal from './Students/CreateStudentModal';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('planner');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showDayDetailModal, setShowDayDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Navigation handlers
  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Modal handlers
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowDayDetailModal(true);
  };

  const handleCreateLesson = (date = null) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowCreateLessonModal(true);
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    // Could open an edit modal here
    console.log('Lesson clicked:', lesson);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    // TODO: Open edit lesson modal
    console.log('Edit lesson:', lesson);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader
          onCreateLesson={() => handleCreateLesson()}
          onCreateStudent={() => setShowCreateStudentModal(true)}
          currentTab={activeTab}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {activeTab === 'dashboard' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-dark mb-4">Dashboard</h2>
              <p className="text-gray-600">Dashboard content coming soon...</p>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-dark mb-4">Enquiries</h2>
              <p className="text-gray-600">Enquiries content coming soon...</p>
            </div>
          )}

          {activeTab === 'planner' && (
            <div className="flex flex-col h-full">
              <CalendarHeader
                currentDate={currentDate}
                view={view}
                onViewChange={setView}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onToday={handleToday}
              />

              <div className="flex-1 overflow-auto">
                {view === 'month' && (
                  <MonthView currentDate={currentDate} onDayClick={handleDayClick} />
                )}

                {view === 'week' && (
                  <WeekView currentDate={currentDate} onLessonClick={handleLessonClick} />
                )}

                {view === 'agenda' && (
                  <AgendaView currentDate={currentDate} onLessonClick={handleLessonClick} />
                )}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-dark mb-4">Students</h2>
              <p className="text-gray-600">Student management content coming soon...</p>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-dark mb-4">Tests</h2>
              <p className="text-gray-600">Test management content coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateLessonModal
        isOpen={showCreateLessonModal}
        onClose={() => {
          setShowCreateLessonModal(false);
          setSelectedDate(null);
        }}
        initialDate={selectedDate}
      />

      <DayDetailModal
        isOpen={showDayDetailModal}
        onClose={() => {
          setShowDayDetailModal(false);
          setSelectedDate(null);
        }}
        date={selectedDate}
        onEditLesson={handleEditLesson}
        onCreateLesson={handleCreateLesson}
      />

      <CreateStudentModal
        isOpen={showCreateStudentModal}
        onClose={() => setShowCreateStudentModal(false)}
      />
    </div>
  );
}
