import { useMemo, useState } from 'react';
import { CalendarPlus, Filter } from 'lucide-react';
import { useTests } from '../../../contexts/TestsContext';
import { useStudents } from '../../../contexts/StudentsContext';
import CreateTestModal from './CreateTestModal';
import TestResultModal from './TestResultModal';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'booked', label: 'Booked' },
  { id: 'completed', label: 'Completed' },
  { id: 'failed', label: 'Failed' },
  { id: 'rebooked', label: 'Rebooked' },
  { id: 'cancelled', label: 'Cancelled' }
];

const statusBadge = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-50 text-green-700';
    case 'failed':
      return 'bg-red-50 text-red-600';
    case 'rebooked':
      return 'bg-purple-50 text-purple-600';
    case 'cancelled':
      return 'bg-gray-100 text-gray-500';
    default:
      return 'bg-blue-50 text-blue-700';
  }
};

export default function TestsTab() {
  const { tests, loading, addTest, changeTestStatus } = useTests();
  const { getStudentById } = useStudents();
  const [filter, setFilter] = useState('booked');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resultModal, setResultModal] = useState({ open: false, mode: 'pass', test: null });
  const [tableError, setTableError] = useState(null);
  const [tableSuccess, setTableSuccess] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const filteredTests = useMemo(() => {
    if (filter === 'all') return tests;
    return tests.filter((test) => test.status === filter);
  }, [tests, filter]);

  const handleCreateTest = async (payload) => {
    setTableError(null);
    setTableSuccess(null);
    return await addTest(payload);
  };

  const openResultModal = (mode, test) => {
    setResultModal({ open: true, mode, test });
  };

  const handleResultSubmit = async (payload) => {
    if (!resultModal.test) return { success: false };
    setProcessingId(resultModal.test.id);
    const result = await changeTestStatus(resultModal.test.id, payload.status, payload);
    setProcessingId(null);
    if (result?.success === false) {
      setTableError(result.error || 'Unable to update test.');
    } else {
      setTableSuccess('Test updated.');
    }
    return result;
  };

  const handleSimpleStatus = async (test, status) => {
    setProcessingId(test.id);
    setTableError(null);
    setTableSuccess(null);
    const result = await changeTestStatus(test.id, status);
    setProcessingId(null);
    if (result?.success === false) {
      setTableError(result.error || 'Unable to update test.');
    } else {
      setTableSuccess('Test updated.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm uppercase text-medium-grey font-semibold tracking-wide">
              Tests
            </div>
            <h3 className="text-2xl font-display font-bold text-dark">Manage bookings</h3>
          </div>
          <div className="hidden md:flex flex-wrap gap-2">
            {STATUS_FILTERS.map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                  filter === item.id
                    ? 'bg-learner-red text-white border-learner-red'
                    : 'bg-white text-medium-grey border-gray-200 hover:border-learner-red'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="w-full md:hidden">
            <label className="text-xs font-semibold text-medium-grey uppercase tracking-wide">
              Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-learner-red focus:border-transparent text-sm"
            >
              {STATUS_FILTERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {(tableError || tableSuccess) && (
          <div className="text-sm">
            {tableError && <div className="text-red-600">{tableError}</div>}
            {tableSuccess && <div className="text-green-700">{tableSuccess}</div>}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-light-grey text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-dark">Student</th>
                <th className="px-4 py-3 font-semibold text-dark">Car</th>
                <th className="px-4 py-3 font-semibold text-dark">Location</th>
                <th className="px-4 py-3 font-semibold text-dark">Date & Time</th>
                <th className="px-4 py-3 font-semibold text-dark">Status</th>
                <th className="px-4 py-3 font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!filteredTests.length && (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-medium-grey">
                    {loading ? 'Loading tests...' : 'No tests for this filter.'}
                  </td>
                </tr>
              )}
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-light-grey/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-dark">{test.student_name}</div>
                    <div className="text-xs text-medium-grey">
                      {getStudentById(test.student_id)?.phone || ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-dark">
                    {test.car === 'own' ? 'Student car' : 'Instructor car'}
                  </td>
                  <td className="px-4 py-3 text-dark">{test.location}</td>
                  <td className="px-4 py-3 text-dark">
                    {test.date ? test.date.toLocaleDateString() : '—'} {test.time}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        test.status
                      )}`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {test.status === 'booked' && (
                        <>
                          <button
                            type="button"
                            onClick={() => openResultModal('pass', test)}
                            className="text-xs font-semibold px-3 py-1 border border-green-500 text-green-600 rounded hover:bg-green-50"
                          >
                            Mark passed
                          </button>
                          <button
                            type="button"
                            onClick={() => openResultModal('fail', test)}
                            className="text-xs font-semibold px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50"
                          >
                            Mark failed
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimpleStatus(test, 'cancelled')}
                            className="text-xs font-semibold px-3 py-1 border border-gray-300 text-medium-grey rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {test.status === 'failed' && (
                        <button
                          type="button"
                          onClick={() => handleSimpleStatus(test, 'rebooked')}
                          className="text-xs font-semibold px-3 py-1 border border-purple-500 text-purple-600 rounded hover:bg-purple-50"
                        >
                          Mark rebooked
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateTestModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateTest}
      />
      <TestResultModal
        isOpen={resultModal.open}
        mode={resultModal.mode}
        test={resultModal.test}
        onClose={() => setResultModal({ open: false, mode: 'pass', test: null })}
        onSubmit={handleResultSubmit}
      />
    </div>
  );
}
