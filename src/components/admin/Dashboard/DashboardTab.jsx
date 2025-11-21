import { useState, useEffect } from 'react';
import { Inbox, CalendarClock, ClipboardCheck } from 'lucide-react';
import StatsCards from './StatsCards';
import RecentlyPassedForm from './RecentlyPassedForm';

export default function DashboardTab({ enquiries }) {
  const [recentlyPassed, setRecentlyPassed] = useState([]);

  // Load from localStorage (will migrate to Firebase later)
  useEffect(() => {
    const stored = localStorage.getItem('recentlyPassed');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyPassed(parsed);
        }
      } catch (e) {
        console.error('Error loading recently passed:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('recentlyPassed', JSON.stringify(recentlyPassed));
  }, [recentlyPassed]);

  const handleAddPassed = (entry, editIndex = null, isDelete = false) => {
    setRecentlyPassed((prev) => {
      if (isDelete && editIndex !== null) {
        return prev.filter((_, idx) => idx !== editIndex);
      }
      if (entry && editIndex !== null) {
        return prev.map((item, idx) => (idx === editIndex ? entry : item));
      }
      if (entry) {
        return [entry, ...prev];
      }
      return prev;
    });
  };

  return (
    <div className="space-y-6">
      <StatsCards enquiriesCount={enquiries?.length || 0} />
      <RecentlyPassedForm
        passes={recentlyPassed}
        onAddPass={handleAddPassed}
      />
    </div>
  );
}
