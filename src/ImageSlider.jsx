import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductPage = ({ images }) => {
    // Image slider state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Image slider navigation functions
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="md:w relative">
            {images.length > 0 && (
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={images[currentImageIndex]}
                        alt={`${name} - Image ${currentImageIndex + 1}`}
                        className="w-[40vw] h-48 md:h-96 object-contain"
                    />

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75"
                            >
                                <ChevronLeft />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75"
                            >
                                <ChevronRight />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Thumbnail Indicators */}
            {/* <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 w-2 rounded-full ${
                            index === currentImageIndex
                                ? "bg-gray-800"
                                : "bg-gray-300"
                        }`}
                    />
                ))}
            </div> */}
        </div>
    );
};

export default ProductPage;
