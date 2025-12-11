import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; 

const SERVER_BASE_URL = 'http://localhost:5001'; 


const fetchLatestModels = async () => {
    try {
        const response = await fetch(`${SERVER_BASE_URL}/models/latest?limit=6`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : []; 
    } 
    catch (error) {
        console.error("Error fetching latest models:", error);
        return [];
    }
};


const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slides, setSlides] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadModels = async () => {
            setIsLoading(true);
            const data = await fetchLatestModels();
            setSlides(data);
            setIsLoading(false);
        };

        loadModels();
    }, []); 


    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        if (slides.length <= 1) return;
        
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); 

        return () => clearInterval(interval);
    }, [currentIndex, slides.length]); 


    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto h-96 mt-8 mb-16 flex items-center justify-center bg-base-300 text-base-content rounded-lg shadow-2xl">
                <span className="loading loading-spinner loading-lg text-primary mr-3"></span>
                Loading latest AI Models...
            </div>
        );
    }
    
    if (slides.length === 0) {
        return (
            <div className="w-full max-w-6xl mx-auto h-96 mt-8 mb-16 flex items-center justify-center bg-base-300 text-error rounded-lg shadow-2xl">
                No latest models found.
            </div>
        );
    }

    return (
        
        <div className="relative w-full max-w-7xl mx-auto h-96 mt-8 mb-16 overflow-hidden rounded-lg shadow-2xl  border border-base-content/10">

            {/* slide container */}
            <div 
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)`}}
                >
                {slides.map((slide) => (
                    <div 
                        key={slide._id} 
                        className="w-full shrink-0 h-full relative"
                    >
                        {console.log ("Navigating Model ID:", slide._id)}
                        
                        <img 
                            src={slide.imageUrl || 'https://via.placeholder.com/1200x400?text=Image+Not+Available'} 
                            alt={slide.modelName} 
                            className="w-full h-full  object-cover absolute top-0 left-0"
                        />
                        
                        <div className="absolute inset-0 bg-black/60 flex flex-col  items-center justify-center text-center p-10 ">
                            
                            <h1 className="text-6xl font-extrabold text-indigo-200/90 drop-shadow-lg ">
                                {slide.modelName}
                            </h1>
                            
                            {/* View Details */}
                            <Link 
                                to={`/app/model/${slide._id||slide.id}`} 
                                
                                className="btn mt-4 z-30 transition duration-300 transform hover:scale-105"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* left Arrow  */}
            <button 
                onClick={prevSlide} 
                className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/75 transition z-40" aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>

            {/* right Arrow  */}
            <button 
                onClick={nextSlide} 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/75 transition z-40" aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default Slider;