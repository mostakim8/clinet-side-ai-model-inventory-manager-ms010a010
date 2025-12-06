import { useState } from 'react'; 
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider'; 
import { getAuth } from "firebase/auth";
import { Helmet } from 'react-helmet-async';

// Server base URL must match the backend's address
const SERVER_BASE_URL = 'http://localhost:5001'; 

const UpdateModel = () => {
    // Data load kora using useLoaderData
    const modelToUpdate = useLoaderData();
    
    // Destructure model properties
    const { 
        _id, 
        modelName, 
        description,  
        category, 
        imageUrl,
        useCase, 
        dataset 
    } = modelToUpdate || {}; 
    
    // Hooks and Context
    const { user } = useAuth();
    const navigate = useNavigate();
    const auth = getAuth(); 

    // State for UI management
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    // 🔑 ফ্লোটিং লেবেলের জন্য ফোকাস স্টেটগুলো
    const [modelNameFocused, setModelNameFocused] = useState(false);
    const [imageUrlFocused, setImageUrlFocused] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);


    // --- Custom Toast Notification Functions ---
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const ToastNotification = () => {
        if (!toast.show) return null;
        let colorClass = 'bg-gray-500'; 
        if (toast.type === 'success') {
            colorClass = 'bg-green-500';
        } else if (toast.type === 'error') {
            colorClass = 'bg-red-500';
        } else if (toast.type === 'info') {
            colorClass = 'bg-blue-500';
        }

        return (
            <div className="toast toast-end z-50">
                <div className={`alert ${colorClass} text-white transition duration-300 shadow-xl`}>
                    <span>{toast.message}</span>
                </div>
            </div>
        );
    };
    // --- End Toast Functions ---

    if (!modelToUpdate) {
        return <div className="text-center py-20 text-xl text-error">Error: Model data could not be loaded for editing. Please check the URL and server connectivity.</div>;
    }


    // Handle the PATCH (Update) form submission
    const handleUpdateModel = async (e) => { 
        e.preventDefault();
        
        if (!user) {
            showToast('Authentication required to update model.', 'error');
            return;
        }

        setIsSubmitting(true);
        const form = e.target;
        
        const updatedModelName = form.modelName.value;
        const updatedDescription = form.description.value;
        const updatedCategory = form.category.value;
        const updatedImageUrl = form.imageUrl.value; 
        
        const updatedModel = {
            modelName: updatedModelName,
            description: updatedDescription,
            category: updatedCategory,
            imageUrl: updatedImageUrl, 
            useCase: form.useCase?.value || useCase, // ধরে নেওয়া হচ্ছে useCase এবং dataset এর ইনপুট যোগ করা হয়নি
            dataset: form.dataset?.value || dataset,
        };
        
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("User not authenticated.");
            
            const token = await currentUser.getIdToken(); 

            const res = await fetch(`${SERVER_BASE_URL}/models/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(updatedModel),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server responded with status ${res.status}`);
            }

            const data = await res.json();

            if (data.modifiedCount > 0 || data.modelName) { 
                showToast('Model Updated! Changes saved successfully.', 'success');
                setTimeout(() => navigate('/app/my-models'), 500); 
            } else {
                showToast('No modifications were needed or made.', 'info');
            }

        } catch (error) {
            console.error('Update Error:', error.message);
            showToast(`Update Failed. Details: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8" >
            <Helmet>
                <title>Update Model - {modelName}</title>
            </Helmet>
            <ToastNotification /> 
            
            <div className="w-full max-w-4xl mx-auto my-10 p-8 shadow-[0_0_40px_rgba(109,40,217,0.3)] rounded-xl bg-linear-to-br from-[#131a2e] to-[#182035] text-white border border-indigo-900/50 transition duration-500">
            
                <h1 className="text-4xl font-extrabold text-center mb-2 text-pink-500">
                    Edit AI Model: <span className="text-primary">{modelName}</span>
                </h1>
                <p className="text-center text-gray-400 mb-8">
                    Model ID: <span className="font-mono text-sm bg-gray-700 px-2 py-1 rounded text-white">{_id}</span>
                </p>
                
                <form onSubmit={handleUpdateModel} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
                    
                    {/* Model Name (Float Label Design + Focus Effect) */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="modelName"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${modelNameFocused || modelName 
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Model Name
                        </label>
                        <input type="text" 
                            name="modelName" 
                            id="modelName"
                            defaultValue={modelName} 
                            placeholder="" 
                            //  Focus Effect add
                            className="input w-full bg-transparent border-gray-700 text-gray-100 border rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:shadow-md focus:shadow-primary/30 focus:outline-none pt-4"
                            onFocus={()=> setModelNameFocused(true)}
                            onBlur={(e)=> setModelNameFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>
                    
                    {/* Category (Select Input - Standard Label) */}
                    <div className="form-control -mt-6">
                        <label className="label"><span className="label-text font-semibold text-gray-400">Category (Framework)</span></label>
                        <select 
                            name="category" 
                            className="select select-bordered bg-gray-700 text-white border-gray-600 focus:border-primary focus:ring-primary ms-0 lg:ms-0" 
                            defaultValue={category} 
                            required
                        >
                            <option value="LLM">Large Language Model (LLM)</option>
                            <option value="Image Gen">Image Generation</option>
                            <option value="Audio/Speech">Audio/Speech</option>
                            <option value="Data Analysis">Data Analysis</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    {/* Developer Email (Read-only) */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold text-gray-400 ps-3">Developer Email</span></label>
                        <input 
                            type="email" 
                            name="developerEmail" 
                            defaultValue={user?.email || 'Loading...'} 
                            readOnly 
                            className="input input-bordered bg-gray-800 text-gray-400 cursor-not-allowed border-gray-700 " 
                        />
                    </div>
                    
                    {/* Image URL (Float Label Design + Highlight) */}
                    <div className="form-control relative mt-6">
                        <label 
                            htmlFor="imageUrl"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${imageUrlFocused || imageUrl 
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
                            defaultValue={imageUrl} 
                            placeholder=""
                            className="input w-full bg-transparent border-accent text-white border-2 focus:ring-2 focus:ring-accent focus:border-accent focus:shadow-lg focus:shadow-accent/20 pt-4" 
                            onFocus={()=> setImageUrlFocused(true)}
                            onBlur={(e)=> setImageUrlFocused(e.target.value.trim() !== '')}
                            required 
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            A visually appealing image is required for the inventory listing.
                        </p>
                    </div>

                    {/* Description (Full Width - Float Label Design + Focus Effect) */}
                    <div className="form-control md:col-span-2 relative mb-2">
                        <label 
                            htmlFor="description"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${descriptionFocused || description
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Model Description
                        </label>
                        <textarea 
                            name="description" 
                            id="description"
                            defaultValue={description} 
                            placeholder="" 
                            //  Textarea Focus Effect add
                            className="textarea textarea-bordered h-32 w-full bg-transparent border-gray-700 text-white border-gray-600 transition duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:shadow-md focus:shadow-primary/30 pt-8" 
                            onFocus={()=> setDescriptionFocused(true)}
                            onBlur={(e)=> setDescriptionFocused(e.target.value.trim() !== '')}
                            required
                        ></textarea>
                    </div>

                    {/* Submit Button (Full Width) */}
                    <div className="form-control mt-6 md:col-span-2">
                        <button 
                            type="submit" 
                            className={`btn btn-secondary w-full text-white font-bold rounded-xl transition duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-secondary/50 ${isSubmitting ? 'loading' : ''}`}
                            disabled={isSubmitting}
                        >
                             {isSubmitting ? 'Saving Changes...' : 'Save Model Updates'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateModel;