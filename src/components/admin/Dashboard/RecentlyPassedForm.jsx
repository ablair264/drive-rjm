import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { convertImageToWebp } from './imageUtils';

export default function RecentlyPassedForm({ passes, loading, onSavePass, onDeletePass }) {
  const [formState, setFormState] = useState({
    name: '',
    tests: '',
    desc: '',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.desc) return;

    const entry = {
      name: formState.name,
      tests: formState.tests,
      desc: formState.desc,
      image: formState.image || '/driving-instructor-worcester.webp'
    };

    setSubmitting(true);
    setError(null);
    const result = await onSavePass(entry, editingId);
    if (result?.success === false) {
      setError(result.error || 'Unable to save entry.');
    } else {
      setFormState({ name: '', tests: '', desc: '', image: '' });
      setEditingId(null);
    }
    setSubmitting(false);
  };

  const handleDeletePass = async (passId) => {
    if (!passId) return;
    setSubmitting(true);
    setError(null);
    const result = await onDeletePass(passId);
    if (result?.success === false) {
      setError(result.error || 'Unable to delete entry.');
    } else if (editingId === passId) {
      setFormState({ name: '', tests: '', desc: '', image: '' });
      setEditingId(null);
    }
    setSubmitting(false);
  };

  const startEditPass = (pass) => {
    if (!pass) return;
    setFormState({
      name: pass.name || '',
      tests: pass.tests || '',
      desc: pass.desc || '',
      image: pass.image || ''
    });
    setEditingId(pass.id);
  };

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };


  const handleProcessedImage = async (file) => {
    if (!file) return;
    setProcessingImage(true);
    setError(null);
    try {
      const processed = await convertImageToWebp(file);
      setFormState((prev) => ({ ...prev, image: processed }));
    } catch (err) {
      console.error(err);
      setError('Unable to process image. Please try a different file.');
    }
    setProcessingImage(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleProcessedImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleProcessedImage(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form Section */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-display font-bold text-dark">
            {editingId ? 'Edit Recently Passed' : 'Add Recently Passed'}
          </h3>
          <p className="text-sm text-medium-grey">Add a learner success story to the carousel.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Name / Area</label>
            <input
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-learner-red focus:outline-none transition-colors"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              placeholder="e.g. Sophie, Worcester"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Test Result (optional)</label>
            <input
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-learner-red focus:outline-none transition-colors"
              value={formState.tests}
              onChange={(e) => setFormState({ ...formState, tests: e.target.value })}
              placeholder="Passed 1st time / 2 minors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-learner-red focus:outline-none transition-colors resize-none"
              rows="3"
              value={formState.desc}
              onChange={(e) => setFormState({ ...formState, desc: e.target.value })}
              placeholder="Short note about their journey"
              required
            />
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Image URL (optional)</label>
              <input
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-learner-red focus:outline-none transition-colors"
                value={formState.image}
                onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                placeholder="Paste an external image URL"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-2">Upload image</label>
              <div
                onClick={triggerFileDialog}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  isDragging ? 'border-learner-red bg-learner-red/5' : 'border-gray-300 hover:border-learner-red'
                }`}
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
                    <ImagePlus className="w-10 h-10 text-learner-red" />
                  )}
                  <p className="text-dark font-semibold">
                    Click to browse or drag & drop an image
                  </p>
                  <p className="text-xs">
                    We’ll convert it to WEBP and resize to 1600×900px for the homepage carousel.
                  </p>
                </div>
              </div>
            </div>

            {formState.image && (
              <div className="mt-3">
                <p className="text-xs text-medium-grey mb-1">Preview:</p>
                <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={formState.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-learner-red text-white px-5 py-3 font-bold tracking-wide clip-angle shadow-lg hover:bg-dark transition-colors disabled:opacity-60 disabled:pointer-events-none"
            disabled={submitting}
          >
            {editingId ? 'Save Changes' : 'Add to Recently Passed'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormState({ name: '', tests: '', desc: '', image: '' });
                setError(null);
              }}
              className="w-full border-2 border-dark text-dark px-5 py-3 font-bold tracking-wide hover:bg-dark hover:text-white transition-colors"
            >
              Cancel edit
            </button>
          )}
        </form>
      </div>

      {/* List Section */}
      <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-dark">Recent Passes</h3>
          <span className="text-sm text-medium-grey">
            {passes.length} total {loading && '(loading...)'}
          </span>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {passes.map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="h-32 bg-gray-100">
                <img
                  src={p.image || '/driving-instructor-worcester.webp'}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="text-lg font-bold text-dark">{p.name}</div>
                {p.tests && (
                  <div className="text-sm font-semibold text-learner-red uppercase tracking-wide">
                    {p.tests}
                  </div>
                )}
                <p className="text-sm text-medium-grey">{p.desc}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => startEditPass(p)}
                    className="px-3 py-2 text-xs font-semibold border border-dark text-dark hover:bg-dark hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePass(p.id)}
                    className="px-3 py-2 text-xs font-semibold border border-learner-red text-learner-red hover:bg-learner-red hover:text-white transition-colors disabled:opacity-60"
                    disabled={submitting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!passes.length && !loading && (
            <div className="col-span-2 text-center text-medium-grey text-sm">
              No passes yet. Add your first learner success story!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
