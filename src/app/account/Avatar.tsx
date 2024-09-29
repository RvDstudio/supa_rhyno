"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client'; // Adjust the import path as needed

interface AvatarProps {
  url: string | null;
  size: number;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size, onUpload }: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const imageUrl = URL.createObjectURL(data);
      setAvatarUrl(imageUrl);
    } catch (error: any) {
      console.error('Error downloading image:', error.message);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath); // Notify parent component about the new avatar path
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="rounded-full bg-gray-200 flex items-center justify-center"
          style={{ height: size, width: size }}
        >
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <label className="mt-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded" htmlFor="avatar-upload">
        {uploading ? 'Uploading...' : 'Upload Avatar'}
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}
