import { useEffect, useState } from 'react';
// Path Correction: AuthProvider-er shothik path dhora holo (assuming providers is inside src)
import { useAuth } from '../../providers/AuthProvider'; // ⬅️ Path corrected: Changed '../../' to '../'
import { getAuth } from "firebase/auth"; // 🔥 Firebase Auth Instance-er jonno onibarjo
import { Link } from 'react-router-dom';

const SERVER_BASE_URL = 'http://localhost:5001';

const MyModels = () => {
    // Auth context থেকে user info নেওয়া
    const { user } = useAuth(); 
    const [myModels, setMyModels] = useState([]);
    const [loading, setLoading] = useState(true);
    // Custom Toast/Notification state
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    // Firebase Auth Instance (Component-er shurute nite hobe)
    const auth = getAuth(); 

    // --- Custom Toast Notification ---
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const ToastNotification = () => {
        if (!toast.show) return null;
        
        const colorClass = toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white';

        return (
            <div className="toast toast-end z-50">
                <div className={`alert ${colorClass} transition duration-300`}>
                    <span>{toast.message}</span>
                </div>
            </div>
        );
    };

    // --- Core function to fetch data for the logged-in user ---
    const fetchMyModels = () => {
         // ইউজার ইমেইল না থাকলে বা লোড হতে না পারলে রিটার্ন করা 
         if (!user?.email) {
            setLoading(false);
            return;
        }
        
        // Query by developer email (backend-কে বলা হচ্ছে এই ইমেইলের মডেল দাও)
        fetch(`${SERVER_BASE_URL}/models?email=${user.email}`) 
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch user models.');
                }
                return res.json();
            })
            .then(data => {
                setMyModels(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching user models:", error);
                setLoading(false);
                // ⭐ Custom Toast ব্যবহার করা হলো ⭐
                showToast('Could not fetch your models. Ensure the server is running.', 'error');
            });
    };
    
    // --- Initial Fetch: ইউজার লগইন করলে ডেটা লোড করা ---
    useEffect(() => {
        if (user?.email) {
            fetchMyModels();
        } else {
            setLoading(false);
        }
    }, [user?.email]); // user.email change হলে এটি re-run হবে

    // --- Delete Handler (Token Included) ---
    const handleDelete = async (id, name) => { 
        
        const currentUser = auth.currentUser;

        if (!currentUser) {
            showToast('Error: Please log in again.', 'error');
            return;
        }

        const isConfirmed = window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`);

        if (isConfirmed) {
            try {
                // 🔥 CRITICAL: Firebase theke ID Token toiri kora hochche
                const token = await currentUser.getIdToken(); 
                
                // Send DELETE request to the server
                const res = await fetch(`${SERVER_BASE_URL}/models/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // ✅ FIX: Token included here
                    }
                });

                // সার্ভার থেকে error message থাকলে তা handle করা
                if (!res.ok) {
                    const err = await res.json();
                    // Unauthorized (401) or Forbidden (403) check
                    if (res.status === 401 || res.status === 403) {
                         throw new Error(err.message || 'Unauthorized access. Token issue or ownership mismatch.');
                    }
                    throw new Error(err.message || 'Server responded with error.');
                }
                
                const data = await res.json();

                if (data.deletedCount > 0) {
                    // ⭐ Custom Toast ব্যবহার করা হলো ⭐
                    showToast(`${name} has been removed from the inventory.`, 'success');
                    // UI থেকে ডিলিট হওয়া মডেলটি সরিয়ে দেওয়া
                    setMyModels(prevModels => prevModels.filter(model => model._id !== id));
                } else {
                    // ⭐ Custom Toast ব্যবহার করা হলো ⭐
                    showToast('Model was not deleted, possibly not found.', 'error');
                }
            }
            catch(error) {
                console.error("Delete Error:", error);
                // ⭐ Custom Toast ব্যবহার করা হলো ⭐
                showToast(`Model could not be deleted. Details: ${error.message}`, 'error');
            }
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // যদি ইউজার লগড ইন না থাকে (Private Route এটি ব্লক করবে, কিন্তু তবুও সেফটির জন্য)
    if (!user) {
        return <div className="text-center py-20 text-xl text-error">Please log in to view your models.</div>;
    }

    return (
        <div className="py-10 px-4 md:px-0">
            <ToastNotification /> {/* ⭐ Toast component এখানে যোগ করা হলো ⭐ */}
            
            <h1 className="text-4xl font-bold text-center mb-10 text-secondary">
                Uploaded Model Inventory ({myModels.length})
            </h1>
            <p className="text-center text-sm text-gray-500 mb-6">
                Showing models created by: <span className='font-semibold text-primary'>{user?.email || 'N/A'}</span>
            </p>
            
            {myModels.length === 0 ? (
                <p className="text-center text-xl text-gray-500">You haven’t added any models yet.
                 <Link to="/add-model" className='link link-primary font-bold'>Add One Now</Link>।
                </p>
            ) : (
                <div className="overflow-x-auto max-w-5xl mx-auto bg-base-200 p-4 rounded-xl shadow-lg">
                    <table className="table w-full">
                        {/* Table Head: Added Image Column */}
                        <thead>
                            <tr className='text-lg text-primary'>
                                <th>Image</th> {/* New Column */}
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {/* Table Body: Added Image Display */}
                        <tbody>
                            {myModels.map(model => (
                                <tr key={model._id} className='hover:bg-base-300 transition duration-150'>
                                    <td>
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12 bg-base-300">
                                                {/* Displaying Image: Uses model.imageUrl or a placeholder */}
                                                <img 
                                                    src={model.imageUrl || `https://ibb.co.com/Z0Xttnq`} 
                                                    alt={`Image of ${model.modelName}`} 
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className='font-medium'>{model.modelName}</td>
                                    <td>{model.category}</td>
                                    <td className='font-mono'>${model.price}</td>
                                    <td className="flex gap-2">
                                        {/* Edit Button */}
                                        <Link 
                                            to={`/update-model/${model._id}`} 
                                            className="btn btn-info btn-sm text-white hover:opacity-80 transition duration-300"
                                        >
                                            Edit
                                        </Link>
                                        {/* Delete button */}
                                        <button 
                                            onClick={() => handleDelete(model._id, model.modelName)}
                                            className="btn btn-error btn-sm text-white hover:opacity-80 transition duration-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyModels;