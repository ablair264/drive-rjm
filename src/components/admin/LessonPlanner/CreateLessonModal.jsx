import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Lightbulb, AlertTriangle } from 'lucide-react';
import { useLessons } from '../../../contexts/LessonsContext';
import { useStudents } from '../../../contexts/StudentsContext';
import { validateLessonForm } from '../../../utils/validation';
import { formatPostcode } from '../../../utils/postcodeHelpers';
import { computeRecommendedSlot, checkTimeConflict } from '../../../utils/lessonRecommendations';
import StudentDropdown from './StudentDropdown';
import CreateStudentModal from '../Students/CreateStudentModal';

const DURATION_OPTIONS = [
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 150, label: '2.5 hours' },
  { value: 180, label: '3 hours' }
];

export default function CreateLessonModal({ isOpen, onClose, initialDate = null }) {
  const { createLesson, lessons } = useLessons();
  const { getStudentById } = useStudents();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [timeConflict, setTimeConflict] = useState(null);

  const [formData, setFormData] = useState({
    student_id: '',
    date: initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    start_time: '09:00',
    duration_minutes: 120,
    start_postcode: '',
    end_postcode: ''
  });

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
    }
  }, [formData.date, formData.start_time, formData.duration_minutes, lessons]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
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
      student_id: '',
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
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
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleChange('start_time', e.target.value)}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                        errors.start_time ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {recommendation && recommendation.time !== formData.start_time && (
                      <button
                        type="button"
                        onClick={handleUseRecommendation}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm whitespace-nowrap"
                        title={recommendation.reason}
                      >
                        Use {recommendation.time}
                      </button>
                    )}
                  </div>
                  {errors.start_time && <p className="mt-1 text-sm text-red-500">{errors.start_time}</p>}
                </div>
              </div>

              {/* Recommendation Display */}
              {recommendation && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                  <Lightbulb size={20} className="flex-shrink-0 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Recommendation:</strong> {recommendation.reason}
                    {recommendation.time !== formData.start_time && (
                      <span> (Suggested time: {recommendation.time})</span>
                    )}
                  </div>
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
