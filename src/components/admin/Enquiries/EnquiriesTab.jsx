export default function EnquiriesTab({ enquiries }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-medium-grey uppercase tracking-wide">
            Enquiries
          </div>
          <h3 className="text-xl font-display font-bold text-dark">Latest submissions</h3>
        </div>
        <span className="text-sm text-medium-grey">{enquiries.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-light-grey text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-dark">Name</th>
              <th className="px-4 py-3 font-semibold text-dark">Contact</th>
              <th className="px-4 py-3 font-semibold text-dark">Service</th>
              <th className="px-4 py-3 font-semibold text-dark">Message</th>
              <th className="px-4 py-3 font-semibold text-dark">Source</th>
              <th className="px-4 py-3 font-semibold text-dark">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {enquiries.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-medium-grey text-center">
                  No enquiries yet.
                </td>
              </tr>
            )}
            {enquiries.map((q, idx) => (
              <tr key={idx} className="hover:bg-light-grey/70 transition-colors">
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
                <td className="px-4 py-3 text-medium-grey uppercase text-xs font-semibold">
                  {q.source || 'unknown'}
                </td>
                <td className="px-4 py-3 text-medium-grey text-xs">
                  {q.createdAt ? new Date(q.createdAt).toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
