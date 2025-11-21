import { useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { useLessons } from '../../../contexts/LessonsContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthView({ currentDate, onDayClick }) {
  const { lessons } = useLessons();

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentDate]);

  const getLessonsForDay = (day) => {
    return lessons.filter(lesson => {
      if (lesson.status === 'cancelled') return false;
      return isSameDay(new Date(lesson.date), day);
    });
  };

  return (
    <div className="bg-white">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="py-3 text-center text-sm font-semibold text-gray-700 bg-gray-50"
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-fr" style={{ minHeight: '600px' }}>
        {monthDays.map((day, index) => {
          const dayLessons = getLessonsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <button
              key={index}
              onClick={() => onDayClick(day)}
              className={`border-b border-r border-gray-200 p-3 text-left hover:bg-gray-50 transition-colors min-h-[120px] ${
                !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              {/* Day Number */}
              <div
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mb-2 ${
                  isDayToday
                    ? 'bg-learner-red text-white'
                    : isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {day.getDate()}
              </div>

              {/* Lesson Count */}
              {dayLessons.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-600">
                    {dayLessons.length} {dayLessons.length === 1 ? 'lesson' : 'lessons'}
                  </div>

                  {/* Show first 3 lessons */}
                  {dayLessons.slice(0, 3).map((lesson) => (
                    <div
                      key={lesson.id}
                      className="text-xs px-2 py-1 bg-learner-red bg-opacity-10 text-learner-red rounded truncate"
                      title={`${lesson.start_time} - ${lesson.student_name}`}
                    >
                      {lesson.start_time} {lesson.student_name}
                    </div>
                  ))}

                  {dayLessons.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayLessons.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
