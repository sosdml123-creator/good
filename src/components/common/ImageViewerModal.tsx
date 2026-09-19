import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from './SafeImage';

export interface ImageViewerModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  title?: string;
  author?: string;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  title,
  author,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1)));
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex, images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Mobile touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> Next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> Prev
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 backdrop-blur-md select-none animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div 
        className="w-full flex items-center justify-between px-4 py-3 sm:py-4 bg-gradient-to-b from-black/80 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-white min-w-0 pr-2">
          {title && (
            <span className="text-sm font-bold truncate tracking-tight">{title}</span>
          )}
          {author && (
            <span className="text-xs text-white/70 truncate">작성자: {author}</span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          {images.length > 1 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </span>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform active:scale-95"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div 
        className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <SafeImage
            src={currentImage}
            alt={`사진 ${currentIndex + 1}`}
            className="max-h-[75vh] max-w-[92vw] sm:max-w-[80vw] object-contain rounded-2xl shadow-2xl transition-all duration-200"
          />
        </div>

        {/* Prev / Next buttons for desktop or tap */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all active:scale-90"
              aria-label="이전 사진"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all active:scale-90"
              aria-label="다음 사진"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Bar */}
      {images.length > 1 && (
        <div 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent overflow-x-auto no-scrollbar z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded-lg overflow-hidden shrink-0 transition-all ${
                currentIndex === idx 
                  ? 'ring-2 ring-white scale-105 opacity-100' 
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <SafeImage
                src={img}
                alt={`미리보기 ${idx + 1}`}
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
