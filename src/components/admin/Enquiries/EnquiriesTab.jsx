import { useState } from 'react';
import { useEnquiries } from '../../../contexts/EnquiriesContext';
import { useStudents } from '../../../contexts/StudentsContext';
import { formatPostcode } from '../../../utils/postcodeHelpers';

const formatDate = (value) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
};

const statusLabel = (status) => {
  switch (status) {
    case 'completed':
      return { text: 'Completed', className: 'bg-green-50 text-green-700' };
    case 'converted':
      return { text: 'Converted', className: 'bg-purple-50 text-purple-700' };
    default:
      return { text: 'Open', className: 'bg-amber-50 text-amber-700' };
  }
};

export default function EnquiriesTab({ enquiries, loading = false }) {
  const { updateEnquiryStatus } = useEnquiries();
  const { createStudent } = useStudents();
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleMarkComplete = async (enquiryId) => {
    setProcessingId(enquiryId);
    setError(null);
    setSuccess(null);
    const result = await updateEnquiryStatus(enquiryId, 'completed');
    setProcessingId(null);
    if (result?.success === false) {
      setError(result.error || 'Unable to update enquiry.');
    } else {
      setSuccess('Enquiry marked as completed.');
    }
  };

  const handleConvert = async (enquiry) => {
    setProcessingId(enquiry.id);
    setError(null);
    setSuccess(null);

    const studentData = {
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      postcode: formatPostcode(enquiry.postcode || ''),
      start_date: new Date().toISOString().split('T')[0],
      notes: `Converted from enquiry: ${enquiry.message || 'No additional notes'}`,
      service: enquiry.service || '',
      lesson_history: {
        hours_taught: 0,
        theory_passed: false,
        test_booked: false,
        test_date: null
      },
      emergency_contact: { name: '', phone: '', relationship: '' }
    };

    const result = await createStudent(studentData);
    if (result?.success === false) {
      setProcessingId(null);
      setError(result.error || 'Unable to create student from enquiry.');
      return;
    }

    await updateEnquiryStatus(enquiry.id, 'converted', {
      converted_student_id: result.id
    });
    setProcessingId(null);
    setSuccess('Enquiry converted to student and marked accordingly.');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-medium-grey uppercase tracking-wide">
            Enquiries
          </div>
          <h3 className="text-xl font-display font-bold text-dark">Latest submissions</h3>
        </div>
        <span className="text-sm text-medium-grey">
          {loading ? 'Loading…' : `${enquiries.length} total`}
        </span>
      </div>

      {(error || success) && (
        <div className="px-6 py-3 border-b border-gray-200 bg-light-grey/40 text-sm">
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-700">{success}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-light-grey text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-dark">Name</th>
              <th className="px-4 py-3 font-semibold text-dark">Contact</th>
              <th className="px-4 py-3 font-semibold text-dark">Service</th>
              <th className="px-4 py-3 font-semibold text-dark">Message</th>
              <th className="px-4 py-3 font-semibold text-dark">Status</th>
              <th className="px-4 py-3 font-semibold text-dark">Source</th>
              <th className="px-4 py-3 font-semibold text-dark">Date</th>
              <th className="px-4 py-3 font-semibold text-dark">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {enquiries.length === 0 && !loading && (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-medium-grey text-center">
                  No enquiries yet.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-medium-grey text-center">
                  Loading enquiries...
                </td>
              </tr>
            )}
            {enquiries.map((q) => {
              const statusInfo = statusLabel(q.status);
              return (
                <tr key={q.id} className="hover:bg-light-grey/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-dark">{q.name}</div>
                    <div className="text-xs text-medium-grey">{q.postcode}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-dark break-words">{q.email}</div>
                    <div className="text-xs text-medium-grey break-words">{q.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-dark">{q.service || '—'}</td>
                  <td className="px-4 py-3 text-medium-grey max-w-xs break-words">
                    {q.message ? q.message : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-medium-grey uppercase text-xs font-semibold">
                    {q.source || 'unknown'}
                  </td>
                  <td className="px-4 py-3 text-medium-grey text-xs">
                    {formatDate(q.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {q.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleMarkComplete(q.id)}
                          disabled={processingId === q.id}
                          className="px-3 py-1 text-xs font-semibold border border-green-600 text-green-700 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
                        >
                          Mark complete
                        </button>
                      )}
                      {q.status !== 'converted' && (
                        <button
                          type="button"
                          onClick={() => handleConvert(q)}
                          disabled={processingId === q.id}
                          className="px-3 py-1 text-xs font-semibold border border-learner-red text-learner-red rounded hover:bg-learner-red hover:text-white transition-colors disabled:opacity-50"
                        >
                          Convert to student
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
