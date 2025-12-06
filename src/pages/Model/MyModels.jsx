import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider'; // Path corrected
import { getAuth } from "firebase/auth"; 
import { Link } from 'react-router-dom';

const SERVER_BASE_URL = 'http://localhost:5001';

const MyModels = () => {
    const { user } = useAuth(); 
    const [myModels, setMyModels] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 🔑 ADDED: Deleting state for button spinner
    const [isDeleting, setIsDeleting] = useState(false); 
    const [deletingId, setDeletingId] = useState(null); 

    // Custom Toast/Notification state
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    // Firebase Auth Instance (Component-er shurute nite hobe)
    const auth = getAuth(); 

    // --- Custom Toast Notification ---
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message, type }), 4000);
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
         if (!user?.email) {
            setLoading(false);
            return;
        }
        
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
                showToast('Could not fetch your models. Ensure the server is running.', 'error');
            });
    };
    
    useEffect(() => {
        if (user?.email) {
            fetchMyModels();
        } else {
            setLoading(false);
        }
    }, [user?.email]); // user.email change হলে  re-run হবে

    // --- Delete Handler (Token Included) ---
    const handleDelete = async (id, name) => { 
        
        const currentUser = auth.currentUser;

        if (!currentUser) {
            showToast('Error: Please log in again.', 'error');
            return;
        }

        const isConfirmed = window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`);

        if (isConfirmed) {
            //  Set loading state for the specific button
            setIsDeleting(true);
            setDeletingId(id);

            try {
                // CRITICAL: Firebase theke ID Token toiri kora hochche
                const token = await currentUser.getIdToken(); 
                
                // Send DELETE request to the server
                const res = await fetch(`${SERVER_BASE_URL}/models/${id}`, { 
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // ✅ FIX: Token included here
                    }
                });

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
                    showToast(`${name} has been removed from the inventory.`, 'success');
                    setMyModels(prevModels => prevModels.filter(model => model._id !== id));
                } else {
                    showToast('Model was not deleted, possibly not found.', 'error');
                }
            }
            catch(error) {
                console.error("Delete Error:", error);
                showToast(`Model could not be deleted. Details: ${error.message}`, 'error');
            } finally {
                // Reset loading state
                setIsDeleting(false);
                setDeletingId(null);
            }
        }
    };


    //  Data Fetching Spinner (Already correct)
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return <div className="text-center py-20 text-xl text-error">Please log in to view your models.</div>;
    }

    return (
        <div className="py-10 px-4 md:px-0">
            <ToastNotification /> 
            
            <h1 className="text-4xl font-bold text-center mb-10 text-secondary">
                My Model Inventory ({myModels.length})
            </h1>
            <p className="text-center text-sm text-gray-500 mb-6">
                Showing models created by: <span className='font-semibold text-primary'>{user?.email || 'N/A'}</span>
            </p>
            
            {myModels.length === 0 ? (
                <p className="text-center text-xl text-gray-500">You haven’t added any models yet.
                 <Link to="/app/add-model" className='link link-primary font-bold'> Add One Now</Link>।
                </p>
            ) : (
                <div className="overflow-x-auto max-w-7xl mx-auto bg-base-200 p-4 rounded-xl shadow-lg">
                    <table className="table w-full">
                        {/* Table Head: Added Framework, Use Case, and View Details */}
                        <thead>
                            <tr className='text-md text-primary'>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Framework</th> {/* New Column */}
                                <th>Use Case</th> {/* New Column */}
                                <th>Created By</th> {/* New Column */}
                                <th>Management</th> {/* Actions Column Renamed */}
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {myModels.map(model => (
                                <tr key={model._id} className='hover:bg-base-300 transition duration-150'>
                                    {/* Image */}
                                    <td>
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12 bg-base-300">
                                                <img 
                                                    src={model.imageUrl || `https://placehold.co/100x100/CCCCCC/666666?text=No+Image`} 
                                                    alt={`Image of ${model.modelName}`} 
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    {/* Name */}
                                    <td className='truncate font-bold text-gray-700'>{model.modelName}</td>
                                    
                                    {/* Framework */}
                                    <td>
                                        <span className="badge badge-lg badge-outline badge-primary  truncate">
                                            {model.framework || model.category || 'N/A'}
                                        </span>
                                    </td>
                                    
                                    {/* Use Case */}
                                    <td>
                                        <span className='text-sm text-gray-600 max-w-[150px] inline-block truncate'>
                                            {model.useCase || 'General AI'}
                                        </span>
                                    </td>
                                    
                                    {/* Created By (Developer Email) */}
                                    <td>
                                        <span className='text-xs font-mono text-gray-500 max-w-[100px] inline-block truncate'>
                                            {model.developerEmail}
                                        </span>
                                    </td>

                                    {/* Management (View, Edit, Delete) */}
                                    <td className="flex flex-col space-y-1">
                                        
                                        {/* View Details Button */}
                                        <Link 
                                            to={`/app/model/${model._id}`} 
                                            className={`btn btn-sm btn-success text-white transition duration-300 ${isDeleting ? 'btn-disabled' : ''}`}
                                            disabled={isDeleting}
                                        >
                                            View Details
                                        </Link>

                                        {/* Edit Button */}
                                        <Link 
                                            to={`/app/update-model/${model._id}`} 
                                            className={`btn btn-info btn-sm text-white hover:opacity-80 transition duration-300 ${isDeleting ? 'btn-disabled' : ''}`}
                                            disabled={isDeleting}
                                        >
                                            Edit
                                        </Link>
                                        
                                        {/* Delete button with spinner logic */}
                                        <button 
                                            onClick={() => handleDelete(model._id, model.modelName)}
                                            className={`btn btn-error btn-sm text-white hover:opacity-80 transition duration-300 
                                                ${isDeleting && deletingId === model._id ? 'loading' : ''}
                                            `}
                                            disabled={isDeleting}
                                        >
                                            {/* Text is hidden when loading to show only the spinner */}
                                            {isDeleting && deletingId === model._id ? '' : 'Delete'}
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