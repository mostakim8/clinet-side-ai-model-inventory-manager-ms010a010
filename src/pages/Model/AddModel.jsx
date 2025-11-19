import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
// Note: Using native fetch API as requested.

const AddModel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const SERVER_BASE_URL = 'http://localhost:5001'; 

    // State for loading/disabled button
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddModel = async (e) => {
        e.preventDefault();
        
        if (!user || !user.email) {
            Swal.fire('Error', 'Please log in to add a model.', 'error');
            return;
        }

        setIsSubmitting(true);
        const form = e.target;

        // Collect form data
        const newModel = {
            modelName: form.modelName.value,
            description: form.description.value,
            price: parseFloat(form.price.value),
            category: form.category.value,
            // ✅ FIX: Image URL shothikbhabe form-er input field theke neowa holo
            imageUrl: form.imageUrl.value, 
            developerEmail: user.email, 
        };
        
        try {
            // 1. Get the Firebase ID Token for authorization
            const token = await user.getIdToken();

            // 2. Send secure POST request using built-in fetch
            const res = await fetch(`${SERVER_BASE_URL}/models`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 🔑 Firebase ID Token attached for authorization
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newModel),
            });
            
            if (!res.ok) {
                // Handle HTTP errors (e.g., 400 Bad Request, 500 Server Error)
                const errorData = await res.json();
                throw new Error(errorData.message || `Server responded with status ${res.status}`);
            }

            const data = await res.json();

            if (data._id) {
                Swal.fire({
                    icon: 'success',
                    title: 'Model Added!',
                    text: `${newModel.modelName} has been successfully added to the inventory.`,
                });
                form.reset(); 
                setTimeout(() => navigate('/my-models'), 500); 
            } else {
                 throw new Error("Model creation acknowledged, but no ID received.");
            }

        } catch (error) {
            // This catches network errors (like Load Failed) and validation errors from the server
            console.error('Model Add Error:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Add Failed',
                text: `Could not add model. Details: ${error.message}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-10 p-6 shadow-2xl bg-base-100 rounded-xl">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-primary">Add New AI Model</h1>
            
            <form onSubmit={handleAddModel} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Model Name */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Model Name</span></label>
                    <input type="text" name="modelName" placeholder="e.g., GPT-5, Midjourney 7" className="input input-bordered" required />
                </div>
                
                {/* Price */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Price (USD)</span></label>
                    <input type="number" step="0.01" name="price" placeholder="e.g., 99.99" className="input input-bordered" required />
                </div>

                {/* Image URL (New Field Added to satisfy Server Schema) */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Image URL</span></label>
                    <input 
                        type="url" 
                        name="imageUrl" 
                        placeholder="Paste image link here (required by server)" 
                        className="input input-bordered" 
                        required 
                    />
                </div>

                {/* Category */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Category</span></label>
                    <select name="category" className="select select-bordered" required>
                        <option value="" disabled selected>Select Category</option>
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
                    <input 
                        type="email" 
                        name="developerEmail" 
                        defaultValue={user?.email || 'Loading...'} 
                        readOnly 
                        className="input input-bordered bg-gray-200" 
                    />
                </div>

                {/* Description (Full Width) */}
                <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-semibold">Model Description</span></label>
                    <textarea name="description" placeholder="A brief description of the model's capabilities and unique features." className="textarea textarea-bordered h-32" required></textarea>
                </div>

                {/* Submit Button (Full Width) */}
                <div className="form-control mt-6 md:col-span-2">
                    <button 
                        type="submit" 
                        className={`btn btn-primary w-full transition duration-300 ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding Model...' : 'Add Model to Inventory'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddModel;