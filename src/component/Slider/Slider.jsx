import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slidesData = [
    { 
        id: 1, 
        title: "AI Model Marketplace", 
        description: "Explore thousands of powerful AI models ready for integration.", 
        color: "text-indigo-400" 
    },
    { 
        id: 2, 
        title: "Seamless Integration", 
        description: "Easily integrate models with our comprehensive API documentation.", 
        color: "text-pink-400" 
    },
    { 
        id: 3, 
        title: "Grow Your Business", 
        description: "Find the perfect AI solution to scale your product and services.", 
        color: "text-green-400" 
    },
];

const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
        );
    };


    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [currentIndex]); 

    return (
        <div className="relative w-full max-w-6xl mx-auto h-full mt-8 mb-16 overflow-hidden rounded-lg shadow-2xl bg-[#1a1a2e] border border-[#131a2e]">
            
            {/* slide container */}
            <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slidesData.map((slide) => (
                    <div 
                        key={slide.id} 
                        className="w-full flex-shrink-0 p-12 text-center"
                    >
                        {/*  slide element */}
                        <h1 className={`text-4xl font-extrabold mb-4 ${slide.color}`}>
                            {slide.title}
                        </h1>
                        <p className="text-xl text-gray-300">
                            {slide.description}
                        </p>
                        <button className="mt-8 btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
                            Learn More
                        </button>
                    </div>
                ))}
            </div>

            {/* left Arrow  */}
            <button 
                onClick={prevSlide} 
                className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/75 transition z-20"
            >
                <ChevronLeft size={24} />
            </button>

            {/* right Arrow  */}
            <button 
                onClick={nextSlide} 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/75 transition z-20"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                {slidesData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            index === currentIndex ? 'bg-indigo-500' : 'bg-gray-600 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;