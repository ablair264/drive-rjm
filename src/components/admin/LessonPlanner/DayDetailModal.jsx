import { useState, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Clock, MapPin, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../../../utils/dateHelpers';
import { formatDuration } from '../../../utils/timeHelpers';
import { useLessons } from '../../../contexts/LessonsContext';

const VIEW_MODES = [
  { id: 'compact', label: 'Compact' },
  { id: 'standard', label: 'Standard' },
  { id: 'detailed', label: 'Detailed' }
];

export default function DayDetailModal({ isOpen, onClose, date, onEditLesson, onCreateLesson }) {
  const { lessons, deleteLesson, cancelLesson, completeLesson } = useLessons();
  const [viewMode, setViewMode] = useState('standard');

  const dayLessons = useMemo(() => {
    if (!date) return [];

    return lessons
      .filter(lesson => {
        const lessonDate = new Date(lesson.date);
        return (
          lessonDate.getFullYear() === date.getFullYear() &&
          lessonDate.getMonth() === date.getMonth() &&
          lessonDate.getDate() === date.getDate()
        );
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [lessons, date]);

  const handleDelete = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      await deleteLesson(lessonId);
    }
  };

  const handleCancel = async (lessonId) => {
    if (window.confirm('Are you sure you want to cancel this lesson?')) {
      await cancelLesson(lessonId);
    }
  };

  const handleComplete = async (lessonId) => {
    await completeLesson(lessonId);
  };

  if (!date) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-2xl font-bold text-dark font-rajdhani">
                {formatDate(date, 'EEEE, MMMM d, yyyy')}
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {dayLessons.length} {dayLessons.length === 1 ? 'lesson' : 'lessons'}
              </div>

              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {VIEW_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode.id
                        ? 'bg-learner-red text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {dayLessons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No lessons scheduled for this day</p>
                <button
                  onClick={() => {
                    onClose();
                    onCreateLesson(date);
                  }}
                  className="px-4 py-2 bg-learner-red text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Create Lesson
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dayLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    viewMode={viewMode}
                    onEdit={() => onEditLesson(lesson)}
                    onDelete={() => handleDelete(lesson.id)}
                    onCancel={() => handleCancel(lesson.id)}
                    onComplete={() => handleComplete(lesson.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {dayLessons.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
              <div className="text-sm text-gray-600">
                Total: {formatDuration(dayLessons.reduce((sum, l) => sum + l.duration_minutes, 0))}
              </div>
              <button
                onClick={() => {
                  onClose();
                  onCreateLesson(date);
                }}
                className="px-4 py-2 bg-learner-red text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Lesson
              </button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function LessonCard({ lesson, viewMode, onEdit, onDelete, onCancel, onComplete }) {
  const statusColors = {
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
  };

  if (viewMode === 'compact') {
    return (
      <div className={`p-3 border rounded-lg ${statusColors[lesson.status]}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold">
              {lesson.start_time} - {lesson.end_time}
            </span>
            <span>{lesson.student_name}</span>
            <span className="text-xs opacity-75">{formatDuration(lesson.duration_minutes)}</span>
          </div>
          <div className="flex items-center gap-2">
            {lesson.status === 'scheduled' && (
              <>
                <button
                  onClick={onEdit}
                  className="p-1 hover:bg-white rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 hover:bg-white rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'standard') {
    return (
      <div className={`p-4 border rounded-lg ${statusColors[lesson.status]}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{lesson.student_name}</h3>
            <div className="flex items-center gap-4 text-sm mt-1">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>
                  {lesson.start_time} - {lesson.end_time} ({formatDuration(lesson.duration_minutes)})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{lesson.start_postcode}</span>
                {lesson.end_postcode !== lesson.start_postcode && (
                  <span>→ {lesson.end_postcode}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lesson.status === 'scheduled' && (
              <>
                <button
                  onClick={onComplete}
                  className="p-2 hover:bg-white rounded transition-colors"
                  title="Mark as Complete"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={onEdit}
                  className="p-2 hover:bg-white rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={onCancel}
                  className="p-2 hover:bg-white rounded transition-colors"
                  title="Cancel"
                >
                  <XCircle size={18} />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 hover:bg-white rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="text-xs font-medium uppercase tracking-wide">
          Status: {lesson.status}
        </div>
      </div>
    );
  }

  // Detailed view
  return (
    <div className={`p-6 border rounded-lg ${statusColors[lesson.status]}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-xl mb-2">{lesson.student_name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="font-medium">Time:</span>
              <span>
                {lesson.start_time} - {lesson.end_time} ({formatDuration(lesson.duration_minutes)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span className="font-medium">Location:</span>
              <span>
                {lesson.start_postcode}
                {lesson.end_postcode !== lesson.start_postcode && ` → ${lesson.end_postcode}`}
              </span>
            </div>
            <div>
              <span className="font-medium">Student ID:</span> {lesson.student_id}
            </div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span className="uppercase">{lesson.status}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {lesson.status === 'scheduled' && (
            <>
              <button
                onClick={onComplete}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-opacity-80 transition-colors"
              >
                <CheckCircle size={18} />
                Complete
              </button>
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-opacity-80 transition-colors"
              >
                <Edit2 size={18} />
                Edit
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-opacity-80 transition-colors"
              >
                <XCircle size={18} />
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-opacity-80 transition-colors text-red-700"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
