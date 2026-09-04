import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  initialName?: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

export default function CategoryForm({ initialName = '', onSave, onClose }: Props) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider">
            {initialName ? 'Edit Category' : 'Add Category'}
          </h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Hot Drinks, Mains, Desserts"
          className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
          autoFocus
          maxLength={50}
        />
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black">
            Cancel
          </button>
          <button type="submit" disabled={!name.trim()} className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-30">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
