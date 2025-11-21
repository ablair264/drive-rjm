import { useState } from 'react';
import { useStudents } from '../../../contexts/StudentsContext';
import { Search, UserPlus } from 'lucide-react';

export default function StudentsTab({ onCreateStudent }) {
  const { students, loading } = useStudents();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.phone.toLowerCase().includes(query) ||
      student.postcode.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-600">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, phone, or postcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
            />
          </div>
          <button
            onClick={onCreateStudent}
            className="flex items-center gap-2 bg-learner-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <UserPlus size={20} />
            Add Student
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-medium-grey uppercase tracking-wide">
              Students
            </div>
            <h3 className="text-xl font-display font-bold text-dark">All Students</h3>
          </div>
          <span className="text-sm text-medium-grey">
            {filteredStudents.length} {searchQuery && `of ${students.length}`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-light-grey text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-dark">Name</th>
                <th className="px-4 py-3 font-semibold text-dark">Contact</th>
                <th className="px-4 py-3 font-semibold text-dark">Postcode</th>
                <th className="px-4 py-3 font-semibold text-dark">Hours Taught</th>
                <th className="px-4 py-3 font-semibold text-dark">Theory</th>
                <th className="px-4 py-3 font-semibold text-dark">Test Date</th>
                <th className="px-4 py-3 font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-medium-grey text-center">
                    {searchQuery ? 'No students found matching your search.' : 'No students yet. Add your first student!'}
                  </td>
                </tr>
              )}
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-light-grey/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-dark">{student.name}</div>
                    {student.licence_number && (
                      <div className="text-xs text-medium-grey">{student.licence_number}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-dark">{student.email}</div>
                    <div className="text-xs text-medium-grey">{student.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-dark font-mono text-xs">{student.postcode}</td>
                  <td className="px-4 py-3 text-dark">
                    {student.lesson_history?.hours_taught || 0}h
                  </td>
                  <td className="px-4 py-3">
                    {student.lesson_history?.theory_passed ? (
                      <span className="text-green-600 font-semibold">✓</span>
                    ) : (
                      <span className="text-gray-400">✗</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-dark text-xs">
                    {student.lesson_history?.test_date
                      ? new Date(student.lesson_history.test_date.seconds * 1000).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-learner-red hover:text-red-700 font-semibold text-xs"
                      onClick={() => console.log('Edit student:', student.id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
