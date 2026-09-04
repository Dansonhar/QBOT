import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import type { WaOrderItem } from '../../types/waorder';

interface Props {
  initial?: WaOrderItem;
  onSave: (item: { name: string; price: number; description: string; image_url: string | null }) => void;
  onClose: () => void;
}

export default function ItemForm({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price?.toString() || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.image_url || null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert('Image must be under 500KB. Please compress or resize your image before uploading.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch {
      alert('Upload failed. Please try again.');
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price);
    if (!name.trim() || isNaN(p) || p < 0) return;
    onSave({ name: name.trim(), price: Math.round(p * 100) / 100, description: description.trim(), image_url: imageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-6 space-y-4 my-8">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider">
            {initial ? 'Edit Item' : 'Add Item'}
          </h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Photo (optional)</label>
          {imageUrl ? (
            <div className="relative w-full h-40 bg-gray-100">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setImageUrl(null)} className="absolute top-1 right-1 bg-black/70 text-white p-1 hover:bg-black">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400">
              {uploading ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Upload image (max 500KB)</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Iced Kopi O"
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
            maxLength={100}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Price (RM)</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description"
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
            maxLength={200}
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || !price || isNaN(parseFloat(price)) || parseFloat(price) < 0}
            className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-30"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
