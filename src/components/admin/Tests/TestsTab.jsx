import { ClipboardCheck } from 'lucide-react';

export default function TestsTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-16 w-16 bg-learner-red text-white rounded-full flex items-center justify-center mb-4">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-display font-bold text-dark mb-2">Tests Management</h3>
        <p className="text-medium-grey text-center max-w-md">
          Track upcoming driving tests, test bookings, and results. This feature is coming soon.
        </p>
      </div>
    </div>
  );
}
