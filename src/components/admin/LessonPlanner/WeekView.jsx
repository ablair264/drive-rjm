import { useMemo } from 'react';
import { startOfWeek, addDays, format, isSameDay, isToday } from 'date-fns';
import { useLessons } from '../../../contexts/LessonsContext';
import { formatDuration } from '../../../utils/timeHelpers';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeekView({ currentDate, onLessonClick }) {
  const { lessons } = useLessons();

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate]);

  const getLessonsForDay = (day) => {
    return lessons.filter(lesson => {
      if (lesson.status === 'cancelled') return false;
      return isSameDay(new Date(lesson.date), day);
    });
  };

  const getLesson AtTimeSlot = (day, hour) => {
    const dayLessons = getLessonsForDay(day);
    return dayLessons.find(lesson => {
      const [lessonHour] = lesson.start_time.split(':').map(Number);
      return lessonHour === hour;
    });
  };

  return (
    <div className="bg-white overflow-x-auto">
      {/* Header with dates */}
      <div className="grid grid-cols-8 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="p-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
          Time
        </div>
        {weekDays.map((day, index) => {
          const isDayToday = isToday(day);
          return (
            <div
              key={index}
              className={`p-3 text-center border-r border-gray-200 ${
                isDayToday ? 'bg-learner-red bg-opacity-10' : ''
              }`}
            >
              <div className="text-sm font-semibold text-gray-700">{WEEKDAYS[index]}</div>
              <div
                className={`text-lg font-bold ${
                  isDayToday ? 'text-learner-red' : 'text-gray-900'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div>
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-200 min-h-[80px]">
            {/* Time column */}
            <div className="p-3 text-sm text-gray-600 border-r border-gray-200 flex items-start">
              {String(hour).padStart(2, '0')}:00
            </div>

            {/* Day columns */}
            {weekDays.map((day, dayIndex) => {
              const lesson = getLessonAtTimeSlot(day, hour);
              const isDayToday = isToday(day);

              return (
                <div
                  key={dayIndex}
                  className={`border-r border-gray-200 p-1 ${
                    isDayToday ? 'bg-learner-red bg-opacity-5' : ''
                  }`}
                >
                  {lesson && (
                    <button
                      onClick={() => onLessonClick(lesson)}
                      className="w-full h-full bg-learner-red text-white p-2 rounded text-left text-sm hover:bg-red-700 transition-colors"
                    >
                      <div className="font-semibold truncate">{lesson.student_name}</div>
                      <div className="text-xs opacity-90">
                        {lesson.start_time} ({formatDuration(lesson.duration_minutes)})
                      </div>
                      <div className="text-xs opacity-75 truncate">{lesson.start_postcode}</div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
