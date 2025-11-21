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
import DashboardTab from './Dashboard/DashboardTab';
import EnquiriesTab from './Enquiries/EnquiriesTab';
import StudentsTab from './Students/StudentsTab';
import TestsTab from './Tests/TestsTab';
import { useEnquiries } from '../../contexts/EnquiriesContext';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showDayDetailModal, setShowDayDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { enquiries, loading: enquiriesLoading } = useEnquiries();
  const [lessonStudentId, setLessonStudentId] = useState(null);

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

  const handleCreateLesson = (date = null, studentId = null) => {
    if (date) {
      setSelectedDate(date);
    }
    if (studentId) {
      setLessonStudentId(studentId);
    }
    setShowCreateLessonModal(true);
  };

  const handleBookLessonFromStudent = (studentId) => {
    if (!studentId) return;
    handleCreateLesson(null, studentId);
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
        <main key={activeTab} className="flex-1 overflow-auto">
          {activeTab === 'dashboard' && (
            <div className="p-8">
              <DashboardTab enquiries={enquiries} />
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div className="p-8">
              <EnquiriesTab enquiries={enquiries} loading={enquiriesLoading} />
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
              <StudentsTab
                onCreateStudent={() => setShowCreateStudentModal(true)}
                onBookLesson={handleBookLessonFromStudent}
              />
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="p-8">
              <TestsTab />
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
          setLessonStudentId(null);
        }}
        initialDate={selectedDate}
        initialStudentId={lessonStudentId}
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
