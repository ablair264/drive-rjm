import { Inbox, CalendarClock, ClipboardCheck } from 'lucide-react';
import StatsCards from './StatsCards';
import RecentlyPassedForm from './RecentlyPassedForm';
import { useRecentlyPassed } from '../../../contexts/RecentlyPassedContext';

export default function DashboardTab({ enquiries }) {
  const { passes, loading, addPass, updatePass, removePass } = useRecentlyPassed();

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
      <StatsCards enquiriesCount={enquiries?.length || 0} />
      <RecentlyPassedForm
        passes={passes}
        loading={loading}
        onSavePass={handleSavePass}
        onDeletePass={handleDeletePass}
      />
    </div>
  );
}
