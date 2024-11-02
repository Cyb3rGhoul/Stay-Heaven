import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed overflow-hidden inset-0 z-50 bg-black/80">
      <div className="relative w-full h-full flex flex-col">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 max-md:top-24 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Main image container */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={images[currentIndex]}
              alt={`Full size ${currentIndex + 1}`}
              className="max-h-[50vh] w-auto max-w-[95vw] object-contain"
            />
          </div>
          
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        <div className="w-full p-4 bg-black/50">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all
                    ${currentIndex === index ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100'}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageGallery = ({ images = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  const safeImages = images?.filter(img => img) || [];
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && !isPaused && safeImages.length > 1 && !isModalOpen) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % safeImages.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isMobile, isPaused, safeImages.length, isModalOpen]);

  const handleImageClick = (index) => {
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  if (isMobile) {
    return (
      <>
        <div 
          className="relative w-full aspect-video max-h-[300px] overflow-hidden rounded-lg"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="relative w-full h-full cursor-pointer"
            onClick={() => handleImageClick(currentImageIndex)}
          >
            <img
              src={safeImages[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            />
            
            {safeImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {safeImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <ImageModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={safeImages}
          initialIndex={modalInitialIndex}
        />
      </>
    );
  }

  const renderImage = (img, index, extraClasses = '') => (
    <div 
      key={index} 
      className={`relative group overflow-hidden cursor-pointer ${extraClasses}`}
      onClick={() => handleImageClick(index)}
    >
      <img
        src={img}
        alt={`Gallery ${index + 1}`}
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
    </div>
  );

  const getDesktopLayout = () => {
    switch (safeImages.length) {
      case 0:
        return (
          <div className="w-full aspect-video max-h-[550px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">No images available</p>
          </div>
        );
      
      case 1:
        return (
          <div className="w-full aspect-video max-h-[550px] overflow-hidden">
            {renderImage(safeImages[0], 0, 'w-full h-full')}
          </div>
        );
      
      case 2:
        return (
          <div className="w-full grid grid-cols-2 gap-4 aspect-video max-h-[550px]">
            {safeImages.map((img, index) => renderImage(img, index))}
          </div>
        );
      
      case 3:
        return (
          <div className="w-full grid grid-cols-2 gap-4 aspect-video max-h-[550px]">
            {renderImage(safeImages[0], 0)}
            <div className="grid grid-rows-2 gap-4">
              {safeImages.slice(1).map((img, index) => renderImage(img, index + 1))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="w-full grid grid-cols-3 gap-4 aspect-video max-h-[550px]">
            {renderImage(safeImages[0], 0, 'col-span-2 h-full')}
            <div className="grid grid-rows-3 gap-4">
              {safeImages.slice(1).map((img, index) => renderImage(img, index + 1))}
            </div>
          </div>
        );
      
      default: // 5 or more images
        return (
          <div className="w-full grid grid-cols-3 gap-4 aspect-video max-h-[550px]">
            {renderImage(safeImages[0], 0, 'col-span-2 h-full')}
            <div className="grid grid-rows-2 gap-4">
              <div className="grid grid-cols-2 gap-4">
                {safeImages.slice(1, 3).map((img, index) => renderImage(img, index + 1))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {safeImages.slice(3, 5).map((img, index) => renderImage(img, index + 3))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="p-4 bg-white rounded-lg shadow-lg">
        {getDesktopLayout()}
      </div>
      <ImageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={safeImages}
        initialIndex={modalInitialIndex}
      />
    </div>
  );
};

export default ImageGallery;