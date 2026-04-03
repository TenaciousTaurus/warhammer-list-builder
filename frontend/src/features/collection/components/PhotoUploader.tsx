import { useState, useRef } from 'react';
import { supabase } from '../../../shared/lib/supabase';

interface PhotoUploaderProps {
  userId: string;
  entryId: string;
  existingPhotos: string[];
  onPhotosChange: (photos: string[]) => void;
}

const MAX_PHOTOS = 8;
const MAX_SIZE_MB = 5;

export function PhotoUploader({ userId, entryId, existingPhotos, onPhotosChange }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_PHOTOS - existingPhotos.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_PHOTOS} photos per entry`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    setError(null);

    const newUrls: string[] = [];

    for (const file of toUpload) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`${file.name} exceeds ${MAX_SIZE_MB}MB limit`);
        continue;
      }

      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const filename = `${userId}/${entryId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('collection-photos')
        .upload(filename, file, { upsert: false });

      if (uploadError) {
        console.error('Photo upload failed:', uploadError);
        setError(uploadError.message);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('collection-photos')
        .getPublicUrl(filename);

      newUrls.push(urlData.publicUrl);
    }

    if (newUrls.length > 0) {
      onPhotosChange([...existingPhotos, ...newUrls]);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = async (url: string) => {
    // Extract path from public URL
    const bucketPath = url.split('/collection-photos/')[1];
    if (bucketPath) {
      await supabase.storage.from('collection-photos').remove([bucketPath]);
    }
    onPhotosChange(existingPhotos.filter((p) => p !== url));
  };

  return (
    <div className="photo-uploader">
      {existingPhotos.length > 0 && (
        <div className="photo-uploader__gallery">
          {existingPhotos.map((url) => (
            <div key={url} className="photo-uploader__thumb">
              <img src={url} alt="" className="photo-uploader__img" />
              <button
                type="button"
                className="photo-uploader__remove"
                onClick={() => handleRemove(url)}
                title="Remove photo"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {existingPhotos.length < MAX_PHOTOS && (
        <label className="photo-uploader__add">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFileSelect}
            className="photo-uploader__input"
            disabled={uploading}
          />
          {uploading ? (
            <span className="photo-uploader__add-text">Uploading...</span>
          ) : (
            <span className="photo-uploader__add-text">
              + Add Photos ({existingPhotos.length}/{MAX_PHOTOS})
            </span>
          )}
        </label>
      )}

      {error && <div className="photo-uploader__error">{error}</div>}
    </div>
  );
}
