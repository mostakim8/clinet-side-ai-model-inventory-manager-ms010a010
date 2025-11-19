import { useState } from 'react'; 
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider'; 
import { getAuth } from "firebase/auth";
import { Helmet } from 'react-helmet-async';

// Server base URL must match the backend's address
const SERVER_BASE_URL = 'http://localhost:5001'; 

const UpdateModel = () => {
    // 1. Data load kora using useLoaderData (data-ti Routes.jsx-er loader function theke asche)
    const modelToUpdate = useLoaderData();
    
    // Destructure model properties
    const { 
        _id, 
        modelName, 
        description, 
        price, 
        category, 
        imageUrl,
        useCase, // Assuming other optional fields
        dataset 
    } = modelToUpdate || {}; 
    
    // Hooks and Context
    const { user } = useAuth();
    const navigate = useNavigate();
    const auth = getAuth(); // Firebase Auth instance

    // State for UI management
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

    // Safety check: If data loading fails
    if (!modelToUpdate) {
        return <div className="text-center py-20 text-xl text-error">Error: Model data could not be loaded for editing. Please check the URL and server connectivity.</div>;
    }


    // 2. Handle the PATCH (Update) form submission
    const handleUpdateModel = async (e) => { 
        e.preventDefault();
        
        if (!user) {
            showToast('Authentication required to update model.', 'error');
            return;
        }

        // 🔑 Start loading state
        setIsSubmitting(true);
        
        const form = e.target;
        
        // Collect updated form data
        const updatedModelName = form.modelName.value;
        const updatedDescription = form.description.value;
        const updatedPrice = parseFloat(form.price.value);
        const updatedCategory = form.category.value;
        const updatedImageUrl = form.imageUrl.value; 
        
        // 3. Update payload
        const updatedModel = {
            modelName: updatedModelName,
            description: updatedDescription,
            price: updatedPrice,
            category: updatedCategory,
            imageUrl: updatedImageUrl, 
            useCase: form.useCase?.value || useCase,
            dataset: form.dataset?.value || dataset,
        };
        
        try {
            // 4. Get the Firebase ID Token
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("User not authenticated.");
            
            const token = await currentUser.getIdToken(); 

            // 5. Send secure PATCH request with the Model ID in the URL
            const res = await fetch(`${SERVER_BASE_URL}/models/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // 🔑 CRITICAL: Token attached for server-side verification and ownership check
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(updatedModel),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server responded with status ${res.status}`);
            }

            const data = await res.json();

            // Success check (checks for mongo modifiedCount or a returned object)
            if (data.modifiedCount > 0 || data.modelName) { 
                showToast('Model Updated! Changes saved successfully.', 'success');
                // Redirect user to their model list after a short delay
                setTimeout(() => navigate('/my-models'), 500); 
            } else {
                showToast('No modifications were needed or made.', 'info');
            }

        } catch (error) {
            console.error('Update Error:', error.message);
            showToast(`Update Failed. Details: ${error.message}`, 'error');
        } finally {
            // 🔑 End loading state after operation completes
            setIsSubmitting(false);
        }
    };
    
    
    return (
        <div className="max-w-4xl mx-auto my-10 p-6 shadow-2xl bg-base-100 rounded-2xl border-t-8 border-secondary">
            <Helmet>
                <title>Update Model - {modelName}</title>
            </Helmet>
            <ToastNotification /> 
            
            <h1 className="text-4xl font-extrabold text-center mb-4 text-secondary">
                Edit AI Model: <span className="text-primary">{modelName}</span>
            </h1>
            <p className="text-center text-gray-500 mb-8">
                Model ID: <span className="font-mono text-sm bg-base-200 px-2 py-1 rounded">{_id}</span>
            </p>
            
            <form onSubmit={handleUpdateModel} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Model Name */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Model Name</span></label>
                    <input type="text" name="modelName" defaultValue={modelName} className="input input-bordered" required />
                </div>
                
                {/* Price */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Price (USD)</span></label>
                    {/* toFixed(2) ensures two decimal places for currency format */}
                    <input type="number" step="0.01" name="price" defaultValue={parseFloat(price).toFixed(2)} className="input input-bordered" required />
                </div>

                {/* Category (Maps to Framework) */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Category (Framework)</span></label>
                    <select name="category" className="select select-bordered" defaultValue={category} required>
                        <option value="LLM">Large Language Model (LLM)</option>
                        <option value="Image Gen">Image Generation</option>
                        <option value="Audio/Speech">Audio/Speech</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                {/* Developer Email (Read-only) */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Developer Email</span></label>
                    <input type="email" name="developerEmail" defaultValue={user?.email || 'Loading...'} readOnly className="input input-bordered bg-gray-200" />
                </div>
                
                {/* Image URL (Full Width) */}
                <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-semibold text-accent">Image URL</span></label>
                    <input type="url" name="imageUrl" defaultValue={imageUrl} placeholder="Paste image link here" className="input input-bordered input-accent" required />
                    <p className="text-xs text-gray-500 mt-1">
                        A visually appealing image is required for the inventory listing.
                    </p>
                </div>

                {/* Description (Full Width) */}
                <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-semibold">Model Description</span></label>
                    <textarea name="description" defaultValue={description} className="textarea textarea-bordered h-32" required></textarea>
                </div>

                {/* Submit Button (Full Width) */}
                <div className="form-control mt-6 md:col-span-2">
                    <button 
                        type="submit" 
                        className={`btn btn-secondary w-full transition duration-300 ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                    >
                         {isSubmitting ? 'Saving Changes...' : 'Save Model Updates'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateModel;