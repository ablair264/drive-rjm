import { useMemo } from 'react';
import { format, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { Clock, MapPin, User } from 'lucide-react';
import { useLessons } from '../../../contexts/LessonsContext';
import { formatDuration } from '../../../utils/timeHelpers';

export default function AgendaView({ currentDate, onLessonClick }) {
  const { lessons } = useLessons();

  // Group lessons by date
  const groupedLessons = useMemo(() => {
    const today = startOfDay(new Date());

    // Filter to only show upcoming and recent lessons (past 7 days and future)
    const relevantLessons = lessons.filter(lesson => {
      if (lesson.status === 'cancelled') return false;
      const lessonDate = startOfDay(new Date(lesson.date));
      const daysDiff = Math.floor((lessonDate - today) / (1000 * 60 * 60 * 24));
      return daysDiff >= -7; // Show past 7 days and all future
    });

    // Group by date
    const grouped = {};
    relevantLessons.forEach(lesson => {
      const dateKey = format(new Date(lesson.date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: new Date(lesson.date),
          lessons: []
        };
      }
      grouped[dateKey].lessons.push(lesson);
    });

    // Sort lessons within each day
    Object.values(grouped).forEach(group => {
      group.lessons.sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    // Convert to array and sort by date
    return Object.values(grouped).sort((a, b) => a.date - b.date);
  }, [lessons]);

  if (groupedLessons.length === 0) {
    return (
      <div className="bg-white p-12 text-center">
        <p className="text-gray-500">No upcoming lessons scheduled</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="divide-y divide-gray-200">
        {groupedLessons.map((group, groupIndex) => {
          const isDayToday = isToday(group.date);
          const isPast = isBefore(group.date, startOfDay(new Date()));

          return (
            <div key={groupIndex} className={`${isPast ? 'opacity-60' : ''}`}>
              {/* Date Header */}
              <div
                className={`sticky top-0 z-10 px-6 py-3 ${
                  isDayToday
                    ? 'bg-learner-red text-white'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                <h3 className="font-bold text-lg">
                  {format(group.date, 'EEEE, MMMM d, yyyy')}
                  {isDayToday && ' - Today'}
                  {isPast && ' (Past)'}
                </h3>
                <p className={`text-sm ${isDayToday ? 'text-white opacity-90' : 'text-gray-600'}`}>
                  {group.lessons.length} {group.lessons.length === 1 ? 'lesson' : 'lessons'}
                </p>
              </div>

              {/* Lessons List */}
              <div className="divide-y divide-gray-100">
                {group.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonClick(lesson)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2 text-learner-red font-bold text-lg">
                            <User size={20} />
                            {lesson.student_name}
                          </div>
                          {lesson.status === 'completed' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>
                              {lesson.start_time} - {lesson.end_time}
                            </span>
                            <span className="text-gray-400">
                              ({formatDuration(lesson.duration_minutes)})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{lesson.start_postcode}</span>
                            {lesson.end_postcode !== lesson.start_postcode && (
                              <>
                                <span>→</span>
                                <span>{lesson.end_postcode}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDuration(lesson.duration_minutes)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
