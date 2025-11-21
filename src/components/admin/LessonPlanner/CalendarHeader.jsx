import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const VIEWS = [
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'agenda', label: 'Agenda' }
];

export default function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Date Display */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-dark font-rajdhani">
            {format(currentDate, 'MMMM yyyy')}
          </h2>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onPrevious}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Previous"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={onToday}
              className="px-3 py-2 text-xs sm:text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Today
            </button>

            <button
              onClick={onNext}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex w-full md:w-auto">
          <select
            className="md:hidden w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-learner-red focus:border-transparent"
            value={view}
            onChange={(e) => onViewChange(e.target.value)}
          >
            {VIEWS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {VIEWS.map((viewOption) => (
              <button
                key={viewOption.id}
                onClick={() => onViewChange(viewOption.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === viewOption.id
                    ? 'bg-learner-red text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {viewOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
