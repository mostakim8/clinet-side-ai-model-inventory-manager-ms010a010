import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { toast } from 'react-hot-toast'; 

const SERVER_BASE_URL = 'http://localhost:5001'; 


export const AddModel = () => {
    const { user } = useAuth(); 
    const navigate = useNavigate();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Floating Label Focus States
    const [modelNameFocused, setModelNameFocused] = useState(false);
    const [frameworkFocused, setFrameworkFocused] = useState(false);
    const [useCaseFocused, setUseCaseFocused] = useState(false);
    const [datasetFocused, setDatasetFocused] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);
    const [imageUrlFocused, setImageUrlFocused] = useState(false);

    
    const handleAddModel = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Authentication logic 
        let token = null;

        if (user && typeof user.getIdToken === 'function') {
            try {
                token = await user.getIdToken(); 
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
            
        };

        const addToastId = toast.loading("Adding model to inventory...");
        
        // API Call logic 
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

            // model add success
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
    
    const labelBgClass = " bg-base-100! ";
    
    return (
        <div className=" min-h-screen flex items-center bg-base-200" >

            <div className="w-full max-w-5xl justify-center p-4 rounded-xl bg-base-100 text-base-content shadow-xl border border-base-300 transition duration-500 mx-auto ">

                <h2 className="text-3xl font-bold text-center text-primary mb-2 mt-6">Add New AI Model</h2>
                
                <form 
                    onSubmit={handleAddModel} 
                    className="card-body grid grid-cols-1 md:grid-cols-2 gap-8 p-10 mx-auto"
                >
                    
                    {/* Model Name */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="modelName"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out   ${labelBgClass}
                            ${modelNameFocused
                                ? 'text-primary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80  rounded    mt-2 left-3' 
                            }`}
                        >
                            Model Name
                        </label>
                        <input type="text" 
                            name="modelName" 
                            id="modelName"
                            placeholder="" 
                            className={`input w-full bg-transparent border border-base-300 text-base-content rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-shown:pt-4`} 
                            
                            onFocus={()=> setModelNameFocused(true)}
                            onBlur={(e)=> setModelNameFocused(e.target.value.trim() !== '')} 
                            required 
                        />
                    </div>

                    {/* Framework */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="framework"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass}
                            ${frameworkFocused
                                ? 'text-primary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80 mt-2 left-3' 
                            }`}
                        >
                            Framework
                        </label>
                        <input type="text" 
                            name="framework" 
                            id="framework"
                            placeholder="" 
                            className="input w-full bg-transparent border-base-300 text-base-content border rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-shown:pt-4"
                            onFocus={()=> setFrameworkFocused(true)}
                            onBlur={(e)=> setFrameworkFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>

                    {/* Use Case */}
                    <div className="form-control relative mb-2">
                        <label 
                            htmlFor="useCase"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass}
                            ${useCaseFocused
                                ? 'text-primary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80 mt-2 left-3' 
                            }`}
                        >
                            Use Case
                        </label>
                        <input type="text" 
                            name="useCase" 
                            id="useCase"
                            placeholder="" 
                            className="input w-full bg-transparent border-base-300 text-base-content border rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-shown:pt-4"
                            onFocus={()=> setUseCaseFocused(true)}
                            onBlur={(e)=> setUseCaseFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>

                    {/* Dataset */}
                    <div className="form-control relative mb-2">
                        <label 
                            htmlFor="dataset"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass}
                            ${datasetFocused
                                ? 'text-primary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80 mt-2 left-3' 
                            }`}
                        >
                            Dataset
                        </label>
                        <input type="text" 
                            name="dataset" 
                            id="dataset"
                            placeholder="" 
                            className="input w-full bg-transparent border-base-300 text-base-content border rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-shown:pt-4"
                            onFocus={()=> setDatasetFocused(true)}
                            onBlur={(e)=> setDatasetFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>

                    {/* Image URL */}
                    <div className="form-control relative mb-2">
                        <label 
                            htmlFor="imageUrl"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass}
                            ${imageUrlFocused
                                ? 'text-primary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80 mt-2 left-3' 
                            }`}
                        >
                            Image URL (ImgBB Link)
                        </label>
                        <input 
                            type="url" 
                            name="imageUrl" 
                            id="imageUrl"
                            placeholder=""
                            className="input w-full bg-transparent border-base-300 text-base-content border rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-shown:pt-4"
                            onFocus={()=> setImageUrlFocused(true)}
                            onBlur={(e)=> setImageUrlFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>


                    {/* Category */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold text-base-content/70">Category</span></label>
                        <select name="category" 
                            className="select select-bordered bg-base-100 border-base-300 text-base-content rounded-lg w-full" 
                            required >
                            <option value="" disabled selected className='text-base-content'>Select Model Category</option>
                            <option value="LLM" className='text-base-content'>Large Language Model (LLM)</option>
                            <option value="Image Gen" className='text-base-content'>Image Generation</option>
                            <option value="Audio/Speech" className='text-base-content'>Audio/Speech</option>
                            <option value="Data Analysis" className='text-base-content'>Data Analysis</option>
                            <option value="Other" className='text-base-content'>Other</option>
                        </select>
                    </div>
                    {/* Description */}
                    <div className="form-control md:col-span-2 relative mb-2">
                        <label 
                            htmlFor="description"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass}
                            ${descriptionFocused
                                ? 'text-primary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80 mt-2 left-3' 
                            }`}
                        >
                            Model Description
                        </label>
                        <textarea 
                            name="description" 
                            id="description"
                            placeholder="" 
                            className="textarea textarea-bordered h-32 w-full bg-transparent border-base-300 text-base-content border rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none pt-8"
                            onFocus={()=> setDescriptionFocused(true)}
                            onBlur={(e)=> setDescriptionFocused(e.target.value.trim() !== '')}
                            required
                        ></textarea>
                    </div>

                    {/* Developer Email */}
                    <div className="form-control md:col-span-1 ">
                        <label className="label"><span className="label-text font-semibold text-base-content/70">Developer Email (Read Only)</span></label>
                        <input 
                            type="email" 
                            name="developerEmail" 
                            defaultValue={user?.email || 'Loading...'} 
                            readOnly 
                            className="input input-bordered bg-base-300 text-base-content/60 cursor-not-allowed border-base-300 sm:w-full" 
                        />
                    </div>
                    
 
                    {/* Submit Button  */}
                    <div className="form-control mt-6 md:col-span-2">
                       <button type="submit"
                             className={`btn btn-primary text-primary-content w-full font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.01] 
                             ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-100 cursor-pointer'}`}
                             disabled={isSubmitting}
                        >
                             {isSubmitting ? <span className="loading loading-spinner"></span> : 'Add Model'}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddModel;