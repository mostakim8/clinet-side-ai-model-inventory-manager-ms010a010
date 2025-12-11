import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider'; 
import { getAuth } from "firebase/auth"; 
import { Link } from 'react-router-dom';

const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyModels = () => {
    const { user } = useAuth(); 
    const [myModels, setMyModels] = useState([]);
    const [loading, setLoading] = useState(true);
    
    
    const [isDeleting, setIsDeleting] = useState(false); 
    const [deletingId, setDeletingId] = useState(null); 

   //toast
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    const auth = getAuth(); 

    //Toast Notification
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message, type }), 4000);
    };

    const ToastNotification = () => {
        if (!toast.show) return null;
        
        const colorClass = toast.type === 'success' 
            ? 'alert-success text-success-content' 
            : 'alert-error text-error-content';

        return (
            <div className="toast toast-end z-50">
                <div className={`alert ${colorClass} transition duration-300`}>
                    <span>{toast.message}</span>
                </div>
            </div>
        );
    };

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
    }, [user?.email]); 

    // Delete Handler 
    const handleDelete = async (id, name) => { 
        
        const currentUser = auth.currentUser;

        if (!currentUser) {
            showToast('Error: Please log in again.', 'error');
            return;
        }

        const isConfirmed = window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`);

        if (isConfirmed) {
            setIsDeleting(true);
            setDeletingId(id);

            try {
                const token = await currentUser.getIdToken(); 
                
                // Send DELETE request server
                const res = await fetch(`${SERVER_BASE_URL}/models/${id}`, { 
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });

                if (!res.ok) {
                    const err = await res.json();
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
                setIsDeleting(false);
                setDeletingId(null);
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

    if (!user) {
        return <div className="text-center py-20 text-xl text-error">Please log in to view your models.</div>;
    }

    return ( 
        <div className="py-10 px-4 md:px-0 ">
            <ToastNotification /> 
            
            <h1 className="text-4xl font-bold text-center mb-10 text-secondary">
                My Model Inventory ({myModels.length})
            </h1>
            <p className="text-center text-sm text-base-content/70 mb-6">
                Showing models created by: <span className='font-semibold text-primary'>{user?.email || 'N/A'}</span>
            </p>
            
            {myModels.length === 0 ? (
                <p className="text-center text-xl text-base-content/70">You haven’t added any models yet.
                 <Link to="/app/add-model" className='link link-primary font-bold'> Add One Now</Link>।
                </p>
            ) : (
                <div className="overflow-x-auto max-w-7xl mx-auto bg-base-100 p-4 rounded-xl shadow-lg border border-rounded">
                    
                    <table className="table w-full table-zebra"> 
                        
                        <thead>
                            <tr className='text-md text-base-content border-b-2 border-base-300'>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Framework</th> 
                                <th>Use Case</th> 
                                <th>Created By</th> 
                                <th>Details</th> 
                            </tr>
                        </thead>

                        <tbody>
                            {myModels.map(model => (
                                <tr key={model._id} className='hover:bg-base-200 transition duration-150'>
                                    
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
                                    <td className='truncate font-bold text-base-content'>{model.modelName}</td>
                                    
                                    {/* Framework */}
                                    <td>
                                        <span className="badge badge-lg badge-outline badge-primary truncate">
                                            {model.framework || model.category || 'N/A'}
                                        </span>
                                    </td>
                                    
                                    {/* Use Case */}
                                    <td>
                                        <span className='text-sm text-base-content/70 max-w-[150px] inline-block truncate'>
                                            {model.useCase || 'General AI'}
                                        </span>
                                    </td>
                                    
                                    {/* Developer Email */}
                                    <td>
                                        <span className='text-xs font-mono text-base-content/60 max-w-[100px] inline-block truncate'>
                                            {model.developerEmail}
                                        </span>
                                    </td>

                                    {/* Details Buttons */}
                                    <td className="flex flex-col space-y-1">
                                        
                                        <Link 
                                            to={`/app/model/${model._id}`} 
                                            className={`btn btn-sm btn-success text-success-content transition duration-300 ${isDeleting ? 'btn-disabled' : ''}`}
                                            disabled={isDeleting}
                                        >
                                            View Details
                                        </Link>

                                        {/* Edit Button */}
                                        <Link 
                                            to={`/app/update-model/${model._id}`} 
                                            className={`btn btn-info btn-sm text-info-content hover:opacity-80 transition duration-300 ${isDeleting ? 'btn-disabled' : ''}`}
                                            disabled={isDeleting}
                                        >
                                            Edit
                                        </Link>
                                        
                                        {/* Delete button*/}
                                        <button 
                                            onClick={() => handleDelete(model._id, model.modelName)}
                                            className={`btn btn-error btn-sm text-error-content hover:opacity-80 transition duration-300 
                                                ${isDeleting && deletingId === model._id ? 'loading' : ''}
                                            `}
                                            disabled={isDeleting}
                                        >
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