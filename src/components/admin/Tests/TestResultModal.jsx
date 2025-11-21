import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useRecentlyPassed } from '../../../contexts/RecentlyPassedContext';
import { convertImageToWebp } from '../Dashboard/imageUtils';

export default function TestResultModal({ isOpen, onClose, mode, test, onSubmit }) {
  const { addPass } = useRecentlyPassed();
  const [formData, setFormData] = useState({
    certificate: '',
    minors: 0,
    majors: 0,
    notes: '',
    addToRecentlyPassed: true,
    passDescription: '',
    passImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        certificate: '',
        minors: 0,
        majors: 0,
        notes: '',
        addToRecentlyPassed: true,
        passDescription: '',
        passImage: ''
      });
      setError(null);
      setLoading(false);
      setProcessingImage(false);
    }
  }, [isOpen, test, mode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!test) return;
    setLoading(true);
    setError(null);

    const payload =
      mode === 'pass'
        ? {
            status: 'completed',
            pass_details: {
              certificate: formData.certificate,
              minors: Number(formData.minors) || 0,
              notes: formData.notes
            }
          }
        : {
            status: 'failed',
            fail_details: {
              minors: Number(formData.minors) || 0,
              majors: Number(formData.majors) || 0,
              notes: formData.notes
            }
          };

    const result = await onSubmit(payload);
    if (result?.success === false) {
      setError(result.error || 'Unable to update test.');
      setLoading(false);
      return;
    }

    if (mode === 'pass' && formData.addToRecentlyPassed) {
      await addPass({
        name: `${test.student_name}`,
        tests: `Passed with ${formData.minors || 0} minors`,
        desc: formData.passDescription || formData.notes || `${test.student_name} passed their test!`,
        image: formData.passImage || '/driving-instructor-worcester.webp'
      });
    }

    setLoading(false);
    onClose();
  };

  const title = mode === 'pass' ? 'Mark test as passed' : 'Mark test as failed';

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:items-center sm:justify-center">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <Dialog.Title className="text-xl font-display font-bold text-dark">{title}</Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            <p className="text-sm text-medium-grey">
              {test?.student_name} • {test?.location} • {test?.date?.toLocaleDateString()}{' '}
              {test?.time}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">
                  Minors
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                  value={formData.minors}
                  onChange={(e) => handleChange('minors', e.target.value)}
                />
              </div>
              {mode === 'fail' && (
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">
                    Majors
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                    value={formData.majors}
                    onChange={(e) => handleChange('majors', e.target.value)}
                  />
                </div>
              )}
            </div>
            {mode === 'pass' && (
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">
                  Certificate number (optional)
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none"
                  value={formData.certificate}
                  onChange={(e) => handleChange('certificate', e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">Notes</label>
              <textarea
                rows="3"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none resize-none"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>
            {mode === 'pass' && (
              <div className="space-y-3 border border-gray-200 rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-dark">
                  <input
                    type="checkbox"
                    checked={formData.addToRecentlyPassed}
                    onChange={(e) => handleChange('addToRecentlyPassed', e.target.checked)}
                  />
                  Add to Recently Passed carousel
                </label>
                {formData.addToRecentlyPassed && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">
                        Carousel description
                      </label>
                      <textarea
                        rows="2"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-learner-red focus:outline-none resize-none"
                        placeholder="e.g. Passed first time with 2 minors!"
                        value={formData.passDescription}
                        onChange={(e) => handleChange('passDescription', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">
                        Upload image (1600×900 WEBP)
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                          processingImage
                            ? 'border-gray-300'
                            : 'border-gray-300 hover:border-learner-red'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <div className="flex flex-col items-center gap-2 text-medium-grey">
                          {processingImage ? (
                            <Loader2 className="w-8 h-8 animate-spin text-learner-red" />
                          ) : (
                            <ImagePlus className="w-8 h-8 text-learner-red" />
                          )}
                          <p className="text-dark font-semibold text-sm">
                            Click to browse image
                          </p>
                          <p className="text-xs">
                            We’ll convert it to WEBP and resize automatically.
                          </p>
                        </div>
                      </div>
                      {formData.passImage && (
                        <div className="mt-3 h-24 border rounded-lg overflow-hidden">
                          <img
                            src={formData.passImage}
                            alt="Pass preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-medium-grey hover:text-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-learner-red text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Save result
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
  const handleProcessedImage = async (file) => {
    if (!file) return;
    setProcessingImage(true);
    try {
      const converted = await convertImageToWebp(file);
      setFormData((prev) => ({ ...prev, passImage: converted }));
    } catch (err) {
      console.error(err);
      setError('Unable to process image. Please try another file.');
    }
    setProcessingImage(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleProcessedImage(file);
  };
