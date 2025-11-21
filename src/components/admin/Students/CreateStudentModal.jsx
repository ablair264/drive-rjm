import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { useStudents } from '../../../contexts/StudentsContext';
import { validateStudentForm } from '../../../utils/validation';
import { formatPostcode } from '../../../utils/postcodeHelpers';

export default function CreateStudentModal({ isOpen, onClose, onStudentCreated }) {
  const { createStudent } = useStudents();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    licence_number: '',
    start_date: new Date().toISOString().split('T')[0],
    notes: '',
    image: '',
    second_phone: '',
    emergency_contact: {
      name: '',
      phone: '',
      relationship: ''
    },
    lesson_history: {
      hours_taught: 0,
      theory_passed: false,
      test_booked: false,
      test_date: null
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateStudentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    // Format postcode before saving
    const studentData = {
      ...formData,
      postcode: formatPostcode(formData.postcode)
    };

    const result = await createStudent(studentData, imageFile);

    setLoading(false);

    if (result.success) {
      // Call callback with new student ID
      if (onStudentCreated) {
        onStudentCreated(result.id);
      }
      onClose();
      resetForm();
    } else {
      setErrors({ general: result.error });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      postcode: '',
      licence_number: '',
      start_date: new Date().toISOString().split('T')[0],
      notes: '',
      image: '',
      second_phone: '',
      emergency_contact: { name: '', phone: '', relationship: '' },
      lesson_history: {
        hours_taught: 0,
        theory_passed: false,
        test_booked: false,
        test_date: null
      }
    });
    setErrors({});
    setShowAdditionalInfo(false);
    setShowEmergencyContact(false);
    setImagePreview('');
    setImageFile(null);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 sm:items-center sm:justify-center">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <Dialog.Title className="text-2xl font-bold text-dark font-rajdhani">
              Add New Student
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

            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-dark mb-4">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="07..."
                    required
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) => handleChange('postcode', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.postcode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="WR6 6HX"
                    required
                  />
                  {errors.postcode && <p className="mt-1 text-sm text-red-500">{errors.postcode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={formData.licence_number}
                    onChange={(e) => handleChange('licence_number', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-dark mb-2">Student Photo (optional)</h3>
              <p className="text-sm text-medium-grey mb-3">
                Upload a portrait photo or paste an image URL. Uploaded files are stored in Firebase Storage.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                  placeholder="https://example.com/photo.jpg"
                />
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-light-grey px-4 py-2 border border-dashed border-gray-300 text-sm font-semibold text-dark hover:border-learner-red transition-colors">
                    Upload file
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                  </label>
                  {imageFile && (
                    <button
                      type="button"
                      className="text-sm text-learner-red font-semibold"
                      onClick={clearUploadedImage}
                    >
                      Remove uploaded file
                    </button>
                  )}
                </div>
                {(imagePreview || formData.image) && (
                  <div>
                    <p className="text-xs text-medium-grey mb-1">Preview:</p>
                    <div className="h-40 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={imagePreview || formData.image}
                        alt="Student preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information (Collapsible) */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="flex items-center gap-2 text-lg font-semibold text-dark mb-4 hover:text-learner-red"
              >
                {showAdditionalInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                Additional Information
              </button>

              {showAdditionalInfo && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Second Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.second_phone}
                      onChange={(e) => handleChange('second_phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                      rows="3"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Contact (Collapsible) */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowEmergencyContact(!showEmergencyContact)}
                className="flex items-center gap-2 text-lg font-semibold text-dark mb-4 hover:text-learner-red"
              >
                {showEmergencyContact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                Emergency Contact
              </button>

              {showEmergencyContact && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergency_contact.name}
                      onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergency_contact.phone}
                      onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                        errors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.emergency_contact_phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.emergency_contact_phone}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={formData.emergency_contact.relationship}
                      onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                      placeholder="Mother, Father, Partner, etc."
                    />
                  </div>
                </div>
              )}
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
                {loading ? 'Creating...' : 'Create Student'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
