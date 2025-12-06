import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { toast } from 'react-hot-toast'; 

const SERVER_BASE_URL = 'http://localhost:5001'; 


export const AddModel = () => {
    const { user } = useAuth(); 
    const navigate = useNavigate();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [modelNameFocused, setModelNameFocused] = useState(false);
    const [frameworkFocused, setFrameworkFocused] = useState(false);
    const [useCaseFocused, setUseCaseFocused] = useState(false);
    const [datasetFocused, setDatasetFocused] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);
    const [imageUrlFocused, setImageUrlFocused] = useState(false);

    
    const handleAddModel = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // console.log("Current User Object:", user);
        // console.log("Is getIdToken function available?", typeof user?.getIdToken === 'function');


        //  firebase token fetching logic
        let token = null;

        if (user && typeof user.getIdToken === 'function') {
            try {
                token = await user.getIdToken(); 
                // console.log("Fetched Token:", token); 
            } catch (error) {
                console.error("Failed to fetch ID Token:", error);
                toast.error("Failed to retrieve authentication token.");
                setIsSubmitting(false);
                return;
            }
        } else {
            token = user?.accessToken || user?.idToken; 
        }

        if (!token){
            toast.error("Authentication required. Please Log in again");
            setIsSubmitting(false);
            return;
        }

        const form = e.target;
        
        // collect data
        const newModel = {
            modelName: form.modelName.value,
            framework: form.framework.value,
            useCase: form.useCase.value,
            dataset: form.dataset.value,
            description: form.description.value,
            imageUrl: form.imageUrl.value,
            category: form.category.value,
            developerEmail: user?.email, 
            // price: parseFloat(form.price.value) || 0, // যদি price ইনপুট থাকে
        };

        const addToastId = toast.loading("Adding model to inventory...");
        
        try {
            const response = await fetch(`${SERVER_BASE_URL}/models`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newModel),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed with status: ${response.status}`);
            }

            // সফল হলে
            toast.success('Model added successfully!', { id: addToastId });
            form.reset();
            navigate('/app/my-models'); 
            
        } catch (error) {
            console.error("Add Model Error:", error);
            toast.error(`Error adding model: ${error.message}`, { id: addToastId });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className=" min-h-screen flex items-center " >


            <div className="w-full max-w-5xl justify-center p-4 rounded-xl bg-[#131a2e] text-white shadow-[0_0_20px_rgba(109,40,217,0.7)] border border-transparent hover:border-indigo-80 transition duration-500 mx-auto">
                <h2 className="text-3xl font-bold text-center text-primary mb-2 mt-6">Add New AI Model</h2>
                
                <form 
                    onSubmit={handleAddModel} 
                    className=" card-body grid grid-cols-1 md:grid-cols-2 gap-8 p-10  mx-auto"
                >
                    
                    {/* Model Name (Float Label Design) */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="modelName"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${modelNameFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Model Name
                        </label>
                        <input type="text" 
                            name="modelName" 
                            id="modelName"
                            placeholder="" 
                            className="input w-full bg-transparent border-gray-700 text-gray-100 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none "
                            onFocus={()=> setModelNameFocused(true)}
                            onBlur={(e)=> setModelNameFocused(e.target.value.trim() !== '')} 
                            required 
                        />
                    </div>

                    {/* Framework (Float Label Design) */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="framework"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${frameworkFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Framework
                        </label>
                        <input type="text" 
                            name="framework" 
                            id="framework"
                            placeholder="" 
                            className="input w-full bg-transparent border-gray-700 text-gray-100 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none pt-4"
                            onFocus={()=> setFrameworkFocused(true)}
                            onBlur={(e)=> setFrameworkFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>

                    {/* Use Case (Float Label Design) */}
                    <div className="form-control relative mb-2">
                        <label 
                            htmlFor="useCase"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${useCaseFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Use Case
                        </label>
                        <input type="text" 
                            name="useCase" 
                            id="useCase"
                            placeholder="" 
                            className="input w-full bg-transparent border-gray-700 text-gray-100 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none pt-4"
                            onFocus={()=> setUseCaseFocused(true)}
                            onBlur={(e)=> setUseCaseFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>

                    {/* Dataset (Float Label Design) */}
                    <div className="form-control relative mb-2">
                        <label 
                            htmlFor="dataset"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${datasetFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Dataset
                        </label>
                        <input type="text" 
                            name="dataset" 
                            id="dataset"
                            placeholder="" 
                            className="input w-full bg-transparent border-gray-700 text-gray-100 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none pt-4"
                            onFocus={()=> setDatasetFocused(true)}
                            onBlur={(e)=> setDatasetFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>

                   

                    {/* Image URL (Float Label Design) */}
                    <div className="form-control relative mb-2">
                        <label 
                            htmlFor="imageUrl"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${imageUrlFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Image URL (ImgBB Link)
                        </label>
                        <input 
                            type="url" 
                            name="imageUrl" 
                            id="imageUrl"
                            placeholder=""
                            className="input w-full bg-transparent border-gray-700 text-gray-100 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none pt-4"
                            onFocus={()=> setImageUrlFocused(true)}
                            onBlur={(e)=> setImageUrlFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>


                    {/* Category (Regular Select Design) */}
                    <div className="form-control -mt-5 lg:mt-0">
                        <label className="label"><span className="label-text font-semibold text-gray-400">Category</span></label>
                        <select name="category" className="select select-bordered bg-transparent border-gray-700 text-gray-100 border rounded-lg lg:ms-3 w-full lg:w-91" required >
                            <option value="" disabled selected>Select Model Category</option>
                            <option value="LLM">Large Language Model (LLM)</option>
                            <option value="Image Gen">Image Generation</option>
                            <option value="Audio/Speech">Audio/Speech</option>
                            <option value="Data Analysis">Data Analysis</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {/* Description (Textarea - Full Width, Float Label Design) */}
                    <div className="form-control md:col-span-2 relative mb-2">
                        <label 
                            htmlFor="description"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${descriptionFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Model Description
                        </label>
                        <textarea 
                            name="description" 
                            id="description"
                            placeholder="" 
                            className="textarea textarea-bordered h-32 w-full bg-transparent border-gray-700 text-gray-100 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none pt-8"
                            onFocus={()=> setDescriptionFocused(true)}
                            onBlur={(e)=> setDescriptionFocused(e.target.value.trim() !== '')}
                            required
                        ></textarea>
                    </div>

                    {/* Developer Email (Read-only) */}
                    <div className="form-control md:col-span-1 ">
                        <label className="label"><span className="label-text font-semibold text-gray-400">Developer Email (Read Only)</span></label>
                        <input 
                            type="email" 
                            name="developerEmail" 
                            defaultValue={user?.email || 'Loading...'} 
                            readOnly 
                            className="input input-bordered bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600 sm:w-full" 
                        />
                    </div>
                    
 
                    {/* Submit Button (Full Width) */}
                    <div className="form-control mt-6 md:col-span-2">
                       <button type="submit"
                             className={`w-full bg-linear-to-r from-indigo-500 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.01] 
                             ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-100 **cursor-pointer**'}`}
                             disabled={isSubmitting}
                        >
                             {isSubmitting ? 'Adding Model...' : 'Add Model'}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddModel;