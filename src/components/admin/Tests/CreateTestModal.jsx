import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useStudents } from '../../../contexts/StudentsContext';
import { useLessons } from '../../../contexts/LessonsContext';
import StudentDropdown from '../LessonPlanner/StudentDropdown';
import { isSameDay } from '../../../utils/dateHelpers';
import { timeRangesOverlap } from '../../../utils/timeHelpers';

const DEFAULT_LOCATION = 'Worcester Test Centre';

export default function CreateTestModal({ isOpen, onClose, onCreate }) {
  const { getStudentById } = useStudents();
  const { lessons } = useLessons();
  const [formData, setFormData] = useState({
    student_id: '',
    car: 'instructor',
    location: DEFAULT_LOCATION,
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lessonConflict, setLessonConflict] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      car: 'instructor',
      location: DEFAULT_LOCATION,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      notes: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_id) {
      setErrors({ student_id: 'Please choose a student' });
      return;
    }
    setLoading(true);
    const student = getStudentById(formData.student_id);
    if (!student) {
      setErrors({ student_id: 'Student not found' });
      setLoading(false);
      return;
    }
    const payload = {
      ...formData,
      date: new Date(`${formData.date}T${formData.time}`),
      student_name: student.name
    };
    if (lessonConflict) {
      const proceed = window.confirm(
        `This test overlaps with ${lessonConflict.student_name}'s lesson at ${lessonConflict.start_time}. Book anyway?`
      );
      if (!proceed) {
        setLoading(false);
        return;
      }
    }
    const result = await onCreate(payload);
    setLoading(false);
    if (result?.success === false) {
      setErrors({ general: result.error || 'Unable to create test' });
    } else {
      resetForm();
      onClose();
    }
  };

  useEffect(() => {
    if (!formData.date || !formData.time) {
      setLessonConflict(null);
      return;
    }
    const selectedDate = new Date(formData.date);
    const conflict = lessons.find((lesson) => {
      if (!lesson.date || lesson.status === 'cancelled') return false;
      if (!isSameDay(lesson.date, selectedDate)) return false;
      return timeRangesOverlap(formData.time, 120, lesson.start_time, lesson.duration_minutes);
    });
    setLessonConflict(conflict || null);
  }, [formData.date, formData.time, lessons]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <Dialog.Title className="text-xl font-display font-bold text-dark">Book Test</Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Student</label>
              <StudentDropdown
                value={formData.student_id}
                onChange={(value) => handleChange('student_id', value)}
              />
              {errors.student_id && <p className="text-xs text-red-500 mt-1">{errors.student_id}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Using car</label>
                <div className="flex gap-3">
                  {[
                    { value: 'instructor', label: 'Instructor car' },
                    { value: 'own', label: 'Student car' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex-1 border rounded-lg px-4 py-2 cursor-pointer text-sm font-semibold ${
                        formData.car === option.value ? 'border-learner-red text-learner-red' : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        name="car"
                        value={option.value}
                        checked={formData.car === option.value}
                        onChange={() => handleChange('car', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Test centre</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-learner-red focus:outline-none"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-learner-red focus:outline-none"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Time</label>
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-learner-red focus:outline-none"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Notes</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-learner-red focus:outline-none resize-none"
                rows="3"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>
            {lessonConflict && (
              <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg">
                <strong>Lesson clash:</strong> {lessonConflict.student_name} has a lesson at{' '}
                {lessonConflict.start_time} ({lessonConflict.duration_minutes} mins). Adjust the test time or confirm when saving.
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-medium-grey hover:text-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-learner-red text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Book test
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
