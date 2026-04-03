import { useState } from 'react';

interface PhotoGalleryProps {
  photos: string[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setLightboxIndex(null);
    }
  };

  return (
    <>
      <div className="photo-gallery">
        {photos.slice(0, 4).map((url, i) => (
          <button
            key={url}
            className="photo-gallery__thumb"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(i);
            }}
          >
            <img src={url} alt="" className="photo-gallery__img" />
            {i === 3 && photos.length > 4 && (
              <span className="photo-gallery__more">+{photos.length - 4}</span>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="photo-gallery__lightbox" onClick={handleClose}>
          <button className="photo-gallery__lightbox-close" onClick={() => setLightboxIndex(null)}>
            &times;
          </button>
          {photos.length > 1 && (
            <button className="photo-gallery__lightbox-prev" onClick={handlePrev}>
              &#8249;
            </button>
          )}
          <img
            src={photos[lightboxIndex]}
            alt=""
            className="photo-gallery__lightbox-img"
          />
          {photos.length > 1 && (
            <button className="photo-gallery__lightbox-next" onClick={handleNext}>
              &#8250;
            </button>
          )}
          <div className="photo-gallery__lightbox-counter">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
