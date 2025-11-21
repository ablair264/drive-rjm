import { useState } from 'react';

export default function RecentlyPassedForm({ passes, onAddPass }) {
  const [formState, setFormState] = useState({
    name: '',
    tests: '',
    desc: '',
    image: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.desc) return;

    const entry = {
      name: formState.name,
      tests: formState.tests,
      desc: formState.desc,
      image: formState.image || '/driving-instructor-worcester.webp'
    };

    onAddPass(entry, editingIndex);
    setFormState({ name: '', tests: '', desc: '', image: '' });
    setEditingIndex(null);
  };

  const handleDeletePass = (index) => {
    onAddPass(null, index, true);
    if (editingIndex === index) {
      setFormState({ name: '', tests: '', desc: '', image: '' });
      setEditingIndex(null);
    }
  };

  const startEditPass = (index) => {
    const entry = passes[index];
    if (!entry) return;
    setFormState({
      name: entry.name || '',
      tests: entry.tests || '',
      desc: entry.desc || '',
      image: entry.image || ''
    });
    setEditingIndex(index);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form Section */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-display font-bold text-dark">
            {editingIndex !== null ? 'Edit Recently Passed' : 'Add Recently Passed'}
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
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Image (upload or URL)</label>
            <input
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-learner-red focus:outline-none transition-colors"
              value={formState.image}
              onChange={(e) => setFormState({ ...formState, image: e.target.value })}
              placeholder="/driving-instructor-worcester.webp or paste URL"
            />
            <div className="mt-2 flex items-center gap-3">
              <label className="cursor-pointer bg-light-grey px-4 py-2 border border-dashed border-gray-300 text-sm font-semibold text-dark hover:border-learner-red transition-colors">
                Upload file
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <span className="text-xs text-medium-grey">Upload local image (base64)</span>
            </div>
            {formState.image && (
              <div className="mt-3">
                <p className="text-xs text-medium-grey mb-1">Preview:</p>
                <div className="h-28 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={formState.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-learner-red text-white px-5 py-3 font-bold tracking-wide clip-angle shadow-lg hover:bg-dark transition-colors"
          >
            {editingIndex !== null ? 'Save Changes' : 'Add to Recently Passed'}
          </button>
          {editingIndex !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingIndex(null);
                setFormState({ name: '', tests: '', desc: '', image: '' });
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
          <span className="text-sm text-medium-grey">{passes.length} listed</span>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {passes.map((p, i) => (
            <div key={`${p.name}-${i}`} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
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
                    onClick={() => startEditPass(i)}
                    className="px-3 py-2 text-xs font-semibold border border-dark text-dark hover:bg-dark hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePass(i)}
                    className="px-3 py-2 text-xs font-semibold border border-learner-red text-learner-red hover:bg-learner-red hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
