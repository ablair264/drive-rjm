import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Lightbulb, AlertTriangle } from 'lucide-react';
import { useLessons } from '../../../contexts/LessonsContext';
import { useStudents } from '../../../contexts/StudentsContext';
import { useTests } from '../../../contexts/TestsContext';
import { validateLessonForm } from '../../../utils/validation';
import { formatPostcode } from '../../../utils/postcodeHelpers';
import { computeRecommendedSlot, checkTimeConflict } from '../../../utils/lessonRecommendations';
import { isSameDay } from '../../../utils/dateHelpers';
import { timeRangesOverlap } from '../../../utils/timeHelpers';
import StudentDropdown from './StudentDropdown';
import CreateStudentModal from '../Students/CreateStudentModal';

const DURATION_OPTIONS = [
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 150, label: '2.5 hours' },
  { value: 180, label: '3 hours' }
];

export default function CreateLessonModal({ isOpen, onClose, initialDate = null, initialStudentId = null }) {
  const { createLesson, lessons } = useLessons();
  const { getStudentById } = useStudents();
  const { tests } = useTests();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [timeConflict, setTimeConflict] = useState(null);
  const [testConflict, setTestConflict] = useState(null);

  const defaultDate = initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    student_id: initialStudentId || '',
    date: defaultDate,
    start_time: '09:00',
    duration_minutes: 120,
    start_postcode: '',
    end_postcode: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        student_id: initialStudentId || '',
        date: initialDate ? initialDate.toISOString().split('T')[0] : prev.date
      }));
    }
  }, [initialStudentId, initialDate, isOpen]);

  // Auto-fill postcode when student is selected
  useEffect(() => {
    if (formData.student_id) {
      const student = getStudentById(formData.student_id);
      if (student) {
        setFormData(prev => ({
          ...prev,
          start_postcode: student.postcode,
          end_postcode: student.postcode
        }));
      }
    }
  }, [formData.student_id, getStudentById]);

  // Compute recommended slot when date/postcode changes
  useEffect(() => {
    if (formData.date && formData.start_postcode && formData.duration_minutes) {
      const dateObj = new Date(formData.date);
      const recommended = computeRecommendedSlot(
        dateObj,
        formData.start_postcode,
        formData.duration_minutes,
        lessons
      );
      setRecommendation(recommended);
    }
  }, [formData.date, formData.start_postcode, formData.duration_minutes, lessons]);

  // Check for time conflicts
  useEffect(() => {
    if (formData.date && formData.start_time && formData.duration_minutes) {
      const dateObj = new Date(formData.date);
      const conflict = checkTimeConflict(
        dateObj,
        formData.start_time,
        formData.duration_minutes,
        lessons
      );
      setTimeConflict(conflict);

      const testClash = tests.find((test) => {
        if (test.status !== 'booked' || !test.date) return false;
        if (!isSameDay(test.date, dateObj)) return false;
        return timeRangesOverlap(
          formData.start_time,
          formData.duration_minutes,
          test.time,
          120
        );
      });
      setTestConflict(testClash || null);
    } else {
      setTimeConflict(null);
      setTestConflict(null);
    }
  }, [formData.date, formData.start_time, formData.duration_minutes, lessons, tests]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (testConflict) {
      const confirmCreate = window.confirm(
        `This lesson overlaps with a booked test for ${testConflict.student_name} at ${testConflict.time}. Create anyway?`
      );
      if (!confirmCreate) return;
    }
  };

  const handleUseRecommendation = () => {
    if (recommendation) {
      handleChange('start_time', recommendation.time);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateLessonForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Check for conflicts
    if (timeConflict && timeConflict.hasConflict) {
      const confirmCreate = window.confirm(
        `This lesson conflicts with ${timeConflict.conflictingLesson.student_name}'s lesson at ${timeConflict.conflictingLesson.start_time}. Create anyway?`
      );
      if (!confirmCreate) return;
    }

    setLoading(true);

    const student = getStudentById(formData.student_id);
    const lessonData = {
      ...formData,
      student_name: student.name,
      start_postcode: formatPostcode(formData.start_postcode),
      end_postcode: formatPostcode(formData.end_postcode || formData.start_postcode)
    };

    const result = await createLesson(lessonData);

    setLoading(false);

    if (result.success) {
      onClose();
      resetForm();
    } else {
      setErrors({ general: result.error });
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: initialStudentId || '',
      date: initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      start_time: '09:00',
      duration_minutes: 120,
      start_postcode: '',
      end_postcode: ''
    });
    setErrors({});
    setRecommendation(null);
    setTimeConflict(null);
  };

  const handleStudentCreated = (newStudentId) => {
    handleChange('student_id', newStudentId);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 sm:items-center sm:justify-center">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold text-dark font-rajdhani">
                Create New Lesson
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {errors.general && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {errors.general}
                </div>
              )}

              {/* Conflict Warning */}
              {timeConflict && timeConflict.hasConflict && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Time Conflict:</strong> This lesson overlaps with{' '}
                    {timeConflict.conflictingLesson.student_name}'s lesson at{' '}
                    {timeConflict.conflictingLesson.start_time}
                  </div>
                </div>
              )}

              {/* Student Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student <span className="text-red-500">*</span>
                </label>
                <StudentDropdown
                  value={formData.student_id}
                  onChange={(value) => handleChange('student_id', value)}
                  onAddNew={() => setShowStudentModal(true)}
                />
                {errors.student_id && (
                  <p className="mt-1 text-sm text-red-500">{errors.student_id}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleChange('start_time', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.start_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.start_time && <p className="mt-1 text-sm text-red-500">{errors.start_time}</p>}
                </div>
              </div>

              {/* Recommendation Display */}
              {recommendation && (
                <div className="mb-6 p-5 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
                        <Lightbulb size={22} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                          Smart Recommendation
                        </div>
                        <p className="text-base font-semibold text-dark mt-1">{recommendation.reason}</p>
                        <p className="text-sm text-blue-800 mt-1">
                          Suggested time:{' '}
                          <span className="font-bold text-blue-900">{recommendation.time}</span>
                        </p>
                      </div>
                    </div>
                    {recommendation.time !== formData.start_time ? (
                      <button
                        type="button"
                        onClick={handleUseRecommendation}
                        className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
                      >
                        Apply {recommendation.time}
                      </button>
                    ) : (
                      <div className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                        Using recommended slot
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conflict warnings */}
              {testConflict && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  <strong>Test clash:</strong> {testConflict.student_name} has a booked test at{' '}
                  {testConflict.time} on this day ({testConflict.location}). Adjust the lesson time or confirm when saving.
                </div>
              )}

              {/* Duration */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {DURATION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('duration_minutes', option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.duration_minutes === option.value
                          ? 'bg-learner-red text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.duration_minutes && (
                  <p className="mt-1 text-sm text-red-500">{errors.duration_minutes}</p>
                )}
              </div>

              {/* Postcodes */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Postcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.start_postcode}
                    onChange={(e) => handleChange('start_postcode', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.start_postcode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="WR6 6HX"
                    required
                  />
                  {errors.start_postcode && (
                    <p className="mt-1 text-sm text-red-500">{errors.start_postcode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Postcode
                  </label>
                  <input
                    type="text"
                    value={formData.end_postcode}
                    onChange={(e) => handleChange('end_postcode', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.end_postcode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Same as start"
                  />
                  {errors.end_postcode && (
                    <p className="mt-1 text-sm text-red-500">{errors.end_postcode}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-learner-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Lesson'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Student Creation Modal */}
      <CreateStudentModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onStudentCreated={handleStudentCreated}
      />
    </>
  );
}
