import { useMemo } from 'react';
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';
import StatsCards from './StatsCards';
import RecentlyPassedForm from './RecentlyPassedForm';
import { useRecentlyPassed } from '../../../contexts/RecentlyPassedContext';
import { useLessons } from '../../../contexts/LessonsContext';
import { useStudents } from '../../../contexts/StudentsContext';
import { useTests } from '../../../contexts/TestsContext';

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (value.seconds) {
    return new Date(value.seconds * 1000);
  }
  try {
    return new Date(value);
  } catch {
    return null;
  }
};

export default function DashboardTab({ enquiries }) {
  const { passes, loading, addPass, updatePass, removePass } = useRecentlyPassed();
  const { lessons } = useLessons();
  const { students } = useStudents();
  const { tests } = useTests();

  const stats = useMemo(() => {
    const now = new Date();
    const weekRange = {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 })
    };

    const lessonsThisWeek = lessons.filter((lesson) => {
      if (!lesson.date || lesson.status === 'cancelled') return false;
      return isWithinInterval(lesson.date, weekRange);
    }).length;

    const openEnquiries = (enquiries || []).filter((enquiry) => {
      const status = enquiry.status || 'new';
      return status !== 'completed' && status !== 'converted';
    });

    const recentThreshold = new Date();
    recentThreshold.setDate(recentThreshold.getDate() - 30);

    const newLearners = students.filter((student) => {
      const startDate = toDate(student.start_date);
      return startDate && startDate >= recentThreshold;
    }).length;

    const upcomingTestsList = tests
      .map((test) => {
        if (!test.date) return null;
        const [hours = '0', minutes = '0'] = (test.time || '00:00').split(':');
        const dateTime = new Date(test.date);
        dateTime.setHours(Number(hours), Number(minutes), 0, 0);
        return {
          ...test,
          dateTime
        };
      })
      .filter((test) => test && ['booked', 'rebooked'].includes(test.status) && test.dateTime >= now)
      .sort((a, b) => a.dateTime - b.dateTime);

    const nextTestLabel = upcomingTestsList[0]
      ? format(upcomingTestsList[0].dateTime, 'EEE dd MMM HH:mm')
      : '';

    return {
      enquiriesCount: openEnquiries.length,
      lessonsThisWeek,
      newLearners,
      upcomingTests: upcomingTestsList.length,
      nextTestLabel
    };
  }, [enquiries, lessons, students, tests]);

  const handleSavePass = async (entry, editingId = null) => {
    if (editingId) {
      return await updatePass(editingId, entry);
    }
    return await addPass(entry);
  };

  const handleDeletePass = async (entryId) => {
    return await removePass(entryId);
  };

  return (
    <div className="space-y-6">
      <StatsCards {...stats} />
      <RecentlyPassedForm
        passes={passes}
        loading={loading}
        onSavePass={handleSavePass}
        onDeletePass={handleDeletePass}
      />
    </div>
  );
}
