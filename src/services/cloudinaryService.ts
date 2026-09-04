const CLOUD_NAME = 'dy723wnsq';
const UPLOAD_PRESET = 'qbotwebfree';

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Image upload failed');

  const data = await res.json();
  return data.secure_url;
}

export function cloudinaryThumbnail(url: string): string {
  return url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto,f_auto/');
}

export function cloudinaryFull(url: string): string {
  return url.replace('/upload/', '/upload/w_600,q_auto,f_auto/');
}
