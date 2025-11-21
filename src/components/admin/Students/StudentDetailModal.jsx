import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Trash2, CalendarPlus } from 'lucide-react';
import { useStudents } from '../../../contexts/StudentsContext';
import { formatPostcode } from '../../../utils/postcodeHelpers';

const defaultStudent = {
  name: '',
  email: '',
  phone: '',
  second_phone: '',
  postcode: '',
  licence_number: '',
  start_date: '',
  notes: '',
  image: '',
  emergency_contact: { name: '', phone: '', relationship: '' },
  lesson_history: {
    hours_taught: 0,
    theory_passed: false,
    test_booked: false,
    test_date: null
  }
};

export default function StudentDetailModal({ student, isOpen, onClose, onBookLesson, computedHours = 0 }) {
  const { updateStudent, archiveStudent } = useStudents();
  const [formData, setFormData] = useState(defaultStudent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const serializeDate = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value?.seconds) {
      const date = new Date(value.seconds * 1000);
      return date.toISOString().split('T')[0];
    }
    try {
      return new Date(value).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        ...defaultStudent,
        ...student,
        start_date: student.start_date || '',
        lesson_history: {
          ...defaultStudent.lesson_history,
          ...(student.lesson_history || {}),
          hours_taught: computedHours,
          test_date: student.lesson_history?.test_date
            ? serializeDate(student.lesson_history.test_date)
            : ''
        },
        emergency_contact: {
          ...defaultStudent.emergency_contact,
          ...(student.emergency_contact || {})
        }
      });
      setError(null);
      setSuccess(null);
      setSaving(false);
    }
  }, [student, isOpen, computedHours]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergency_contact: { ...prev.emergency_contact, [field]: value }
    }));
  };

  const handleLessonHistoryChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      lesson_history: { ...prev.lesson_history, [field]: value }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!student) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      second_phone: formData.second_phone || '',
      postcode: formatPostcode(formData.postcode),
      licence_number: formData.licence_number || '',
      start_date: formData.start_date || '',
      notes: formData.notes || '',
      emergency_contact: formData.emergency_contact,
      lesson_history: {
        ...formData.lesson_history,
        hours_taught: Number(computedHours || 0),
        test_date: formData.lesson_history?.test_date
          ? new Date(formData.lesson_history.test_date)
          : null,
        theory_passed: Boolean(formData.lesson_history?.theory_passed),
        test_booked: Boolean(formData.lesson_history?.test_booked)
      }
    };

    const result = await updateStudent(student.id, payload);
    setSaving(false);

    if (result.success === false) {
      setError(result.error || 'Unable to save student.');
    } else {
      setSuccess('Student updated successfully.');
    }
  };

  const handleArchive = async () => {
    if (!student) return;
    const confirmed = window.confirm(
      'Are you sure you want to remove this student? You can restore them later from Firestore.'
    );
    if (!confirmed) return;

    setSaving(true);
    const result = await archiveStudent(student.id);
    setSaving(false);

    if (result.success === false) {
      setError(result.error || 'Unable to archive student.');
      return;
    }

    if (onClose) onClose();
  };

  const handleBookLesson = () => {
    if (student && onBookLesson) {
      onBookLesson(student.id);
      if (onClose) onClose();
    }
  };

  const avatar = useMemo(() => formData.image || '/driving-instructor-worcester.webp', [formData.image]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 sm:items-center sm:justify-center">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <Dialog.Title className="text-2xl font-bold text-dark font-rajdhani">
                {formData.name || 'Student'}
              </Dialog.Title>
              <p className="text-sm text-medium-grey">Manage student details and admin actions</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3 bg-light-grey/60 rounded-xl p-5 border border-gray-200">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img src={avatar} alt={formData.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold text-dark">{formData.name}</div>
                    <div className="text-sm text-medium-grey">{formData.postcode}</div>
                  </div>
                  <div className="w-full space-y-2 text-sm">
                    <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-left">
                      <div className="font-semibold text-dark">Primary</div>
                      <div className="text-medium-grey">{formData.phone || 'Not provided'}</div>
                    </div>
                    {formData.second_phone && (
                      <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-left">
                        <div className="font-semibold text-dark">Secondary</div>
                        <div className="text-medium-grey">{formData.second_phone}</div>
                      </div>
                    )}
                    <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-left">
                      <div className="font-semibold text-dark">Email</div>
                      <div className="text-medium-grey break-words">{formData.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      type="button"
                      onClick={handleBookLesson}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-learner-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <CalendarPlus size={18} />
                      Book lesson
                    </button>
                    <button
                      type="button"
                      onClick={handleArchive}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                      disabled={saving}
                    >
                      <Trash2 size={18} />
                      Delete student
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:flex-1">
                <form className="space-y-6" onSubmit={handleSave}>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  <section className="space-y-3">
                    <h4 className="text-lg font-semibold text-dark">Basic Info</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Full name</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Email</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Phone</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Second phone</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.second_phone || ''}
                          onChange={(e) => handleChange('second_phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Postcode</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.postcode}
                          onChange={(e) => handleChange('postcode', e.target.value.toUpperCase())}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Licence number</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.licence_number || ''}
                          onChange={(e) => handleChange('licence_number', e.target.value.toUpperCase())}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Start date</label>
                        <input
                          type="date"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.start_date || ''}
                          onChange={(e) => handleChange('start_date', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Notes</label>
                        <textarea
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none resize-none"
                          rows="3"
                          value={formData.notes || ''}
                          onChange={(e) => handleChange('notes', e.target.value)}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-lg font-semibold text-dark">Emergency contact</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Name</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.emergency_contact?.name || ''}
                          onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Phone</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.emergency_contact?.phone || ''}
                          onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Relationship</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.emergency_contact?.relationship || ''}
                          onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-lg font-semibold text-dark">Lesson progress</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-dark mb-1 block">Hours taught</label>
                      <div className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-dark font-semibold">
                        {Math.round((computedHours || 0) * 10) / 10} hours (auto-calculated)
                      </div>
                    </div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-dark">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.lesson_history?.theory_passed)}
                          onChange={(e) => handleLessonHistoryChange('theory_passed', e.target.checked)}
                        />
                        Theory passed
                      </label>
                      <label className="flex items-center gap-2 text-sm font-semibold text-dark">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.lesson_history?.test_booked)}
                          onChange={(e) => handleLessonHistoryChange('test_booked', e.target.checked)}
                        />
                        Test booked
                      </label>
                      <div>
                        <label className="text-sm font-semibold text-dark mb-1 block">Test date</label>
                        <input
                          type="date"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                          value={formData.lesson_history?.test_date || ''}
                          onChange={(e) => handleLessonHistoryChange('test_date', e.target.value)}
                          disabled={!formData.lesson_history?.test_booked}
                        />
                      </div>
                    </div>
                  </section>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-medium-grey hover:text-dark transition-colors"
                      onClick={onClose}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-learner-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                      disabled={saving}
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
