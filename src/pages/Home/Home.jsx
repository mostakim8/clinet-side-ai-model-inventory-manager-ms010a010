import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 
import { useAuth } from '../../providers/AuthProvider.jsx'; 
// 🔑 Slider কম্পোনেন্ট ইম্পোর্ট করা হলো
// import Slider from '../../component/Slider/Slider.jsx'; 

// Server base URL 
const SERVER_BASE_URL = 'http://localhost:5001'; 

export const Home = () => {
    const { user } = useAuth(); 

    // States for fetched data, loading status, and errors
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for the search query
    const [searchTerm, setSearchTerm] = useState(''); 

    // Data fetching logic
    useEffect(() => {
        const fetchModels = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch all models from the backend API
                const response = await fetch(`${SERVER_BASE_URL}/models`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                setModels(data);
            } catch (err) {
                console.error("Failed to fetch models:", err);
                setError(`Failed to load models. Please ensure the backend server is running on ${SERVER_BASE_URL} and the endpoint '/models' is correct.`);
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    // --- Loading State Display ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
        );
    }

    // --- Error State Display ---
    if (error) {
        return (
            <div role="alert" className="alert alert-error my-10 max-w-2xl mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Error: {error}</span>
            </div>
        );
    }
    
    // --- Empty State Display (No models fetched at all) ---
    if (models.length === 0) {
        return (
            <div className="text-center my-20 p-8 border border-gray-200 rounded-xl bg-white shadow-lg max-w-xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-700 mb-3">No Models Available</h2>
                <p className="text-gray-500 mb-6">The inventory is currently empty. Please add a model to populate the list.</p>
                <Link to="/add-model" className="btn btn-primary text-white">
                    Add Your First Model
                </Link>
            </div>
        );
    }

    // CORE LOGIC: Filter models based on the search term
    const filteredModels = models.filter(model =>
        model.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (model.category && model.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    let displayModels = filteredModels;
    if( searchTerm===''){
      const featuredModelIds = [...filteredModels].sort((a,b)=>{
        return b._id.localeCompare(a._id);
      }); // Example featured model IDs
      displayModels = featuredModelIds.slice(0, 6); // Show only top 6 featured models
    }

    // --- Main Content Display ---
    return (
        <div className="py-4"> 
            <Helmet>
                <title>AI Model Market - Discover</title>
            </Helmet>
            
            {/* 🔑 স্লাইডার যুক্ত করা হলো */}
            {/* <Slider />  */}
            
            {/* মেইন কন্টেন্ট ডিসপ্লে কন্টেইনার (Slider থেকে কিছুটা গ্যাপ দেওয়া হলো) */}
            <div className="mt-8 px-4 sm:px-6 lg:px-8"> 

                <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
                    Discover the Best AI Models
                </h1>
                
                {/* 🔑 NEW: H4 and Search Bar Container */}
                <div className="flex flex-col sm:flex-row justify-between mb-10 py-4 rounded-lg gap-4 md:gap-0">
                    {/* H4 Title (Left Side) */}
                    <h4 className="text-2xl font-semibold text-primary mb-4 md:mb-0">
                      Latest AI Models </h4>

                    {/* Search Input Field (Right Side) */}
                    <div className="w-full sm:w-50"> 
                        <label className="input input-bordered flex items-center gap-2 w-full shadow-md bg-black-200 text-gray-400">
                        
                            <input
                                type="text"
                                placeholder="Search models by name or category..."
                                className="grow"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                {/* END H4 and Search Bar Container */}

                {/* Display message if no models match the search */}
                {searchTerm.length > 0 && filteredModels.length === 0 && (
                    <div className="text-center my-10 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-base-100 max-w-xl mx-auto">
                        <h3 className="text-2xl font-semibold text-gray-700">No Results Found 😔</h3>
                        <p className="text-gray-500 mt-2">
                            We couldn't find any models matching **"{searchTerm}"** in the name or category.
                        </p>
                        <button 
                            onClick={() => setSearchTerm('')} 
                            className="btn btn-sm btn-outline btn-primary mt-4"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Use filteredModels for mapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Fetched models data is mapped here */}
                    {displayModels.map((model) => {
                        return (
                            <div key={model._id} className="card bg-gray-500 shadow-xl hover:shadow-2xl transition duration-300">
                                <figure className="h-48 overflow-hidden">
                                    <img 
                                        src={model.imageUrl || 'https://placehold.co/400x300/CCCCCC/666666?text=No+Image'} 
                                        alt={model.modelName} 
                                        className="w-full h-full object-cover"
                                    />
                                </figure>
                                <div className="card-body p-6">
                                    <h2 className="card-title text-xl text-white">{model.modelName}</h2>
                                    <p className="text-2xl font-bold text-accent">${parseFloat(model.price).toFixed(2)}</p>
                                    
                                    <div className="card-actions justify-end mt-4">
                                        <Link 
                                            to={`/model/${model._id}`} 
                                            className="btn btn-primary btn-outline w-full"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


    {/* 'Show All Models' Button (Only shown when not searching and there are more than 6 models) */}
                {searchTerm === '' && models.length > 6 && (
                    <div className="text-center my-10">
                        <Link to="/models" className="btn btn-secondary btn-lg shadow-lg">
                            Show All {models.length} Models
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
};