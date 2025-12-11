import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 
import { useAuth } from '../../providers/AuthProvider.jsx'; 

const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export const AllModels = () => {
    const { user } = useAuth(); 

    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState(''); 

    useEffect(() => {
        const fetchModels = async () => {
            try {
                setLoading(true);
                setError(null);
        
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
        );
    }

    // Error Display
    if (error) {
        return (
            <div role="alert" className="alert alert-error my-10 max-w-2xl mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Error: {error}</span>
            </div>
        );
    }
    
    if (models.length === 0) {
        return (
            <div className="text-center my-20 p-8 border border-gray-200 rounded-xl shadow-lg max-w-xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-700 mb-3">No Models Available</h2>
                <p className="text-gray-500 mb-6">The inventory is currently empty. Please add a model to populate the list.</p>
                <Link to="/add-model" className="btn btn-primary text-white">
                    Add Your First Model
                </Link>
            </div>
        );
    }

    
    const filteredModels = models.filter(model =>
        model.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (model.category && model.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    let displayModels = filteredModels; 
    
    return (
        <div className="py-4"> 
            <Helmet>
                <title>AI Model Market - All Models</title>
            </Helmet>

            <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
                All Available AI Models
            </h1>
            
            <div className="flex flex-col md:flex-row justify-between mb-10 px-4 py-4 rounded-lg gap-4 md:gap-0">
                
                <h4 className="text-2xl font-semibold text-primary mb-4 md:mb-0">
                    Showing All {models.length} Models
                </h4>

                {/* Search Input */}
                <div className="w-full md:w-96 "> 
                    <label className="input input-bordered flex w-full items-center gap-2 input-md shadow-md bg-transparent border-base-content/20 text-base-content ">
                        <input
                            type="text"
                            placeholder="Search models by name or category..."
                            className="grow placeholder-base-900 
                            text-gray-400
                            dark:bg-transparent border-none  focus:outline-none "
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            {/* if no models match the search this msg */}
            {searchTerm.length > 0 && filteredModels.length === 0 && (
                <div className="text-center my-10 p-8 border-2 border-dashed border-gray-300 rounded-xl  max-w-xl mx-auto">
                    <h3 className="text-2xl font-semibold text-gray-700">No Results Found</h3>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayModels.map((model) => {
                    return (
                        <div key={model._id} className="card bg-gray-700/10 shadow-xl hover:shadow-2xl transition duration-300">
                            <figure className="h-48 overflow-hidden">
                                <img 
                                    src={model.imageUrl || 'https://placehold.co/400x300/CCCCCC/666666?text=No+Image'} 
                                    alt={model.modelName} 
                                    className="w-full h-full object-cover transition duration-500 hover:scale-110"
                                />
                            </figure>
                            <div className="card-body p-6 flex flex-col justify-between">
                                <h2 className="card-title text-2xl font-extrabold truncate mb-2">{model.modelName}</h2>

                                {/*framework */}
                            <div className=" space-y-1 text-sm text-gray-600">
                             <p className='flex justify-between items-center'>
                            <span className=' font-semibold'> Framework:
                            </span>
                            <span className='badge badge-neutral '>{model.framework} 
                            </span>
                             </p>

                             {/* use case   */}
                             <p className='flex justify-between items-center'>
                                        <span className='font-semibold'>Use Case:</span> 
                                        <span className='text-right max-w-[70%] truncate'>{model.useCase}</span>
                                    </p>
                                </div>
                                
                                <div className="card-actions justify-end mt-4">
                                    <Link 
                                        to={`/app/model/${model._id}`} 
                                        className="btn btn-ghost bg-indigo-600 hover:bg-indigo-700 text-white 
                                w-full font-bold shadow-lg shadow-indigo-500/50 transition duration-300"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AllModels;