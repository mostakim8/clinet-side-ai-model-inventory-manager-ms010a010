import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const SERVER_BASE_URL = 'http://localhost:5001';

// Mock Data Fallback (unchanged)
const MOCK_MODEL = {
    _id: "60f71c4c8e7e1c0c8e7e1c0c",
    modelName: "Mock AI Data Model (Fallback)",
    description: "This is a placeholder model to allow UI testing of the purchase button when the backend server is not reachable. The purchase attempt will still try to contact the server.",
    category: "Data Analysis",
    developerEmail: "mock.developer@example.com",
    purchased: 42,
    imageUrl: "https://placehold.co/800x600/60A5FA/ffffff?text=MOCK+DATA",
};


const ToastNotification = ({ show, message, type, onClose }) => {
    if (!show) return null;
    const colorClass = type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-success';
    
    return (
        <div className="toast toast-top toast-center z-50">
            <div className={`alert ${colorClass} shadow-lg`}>
                <div>
                    <span className='font-semibold'>{message}</span>
                </div>
                <button onClick={onClose} className="btn btn-sm btn-ghost ml-4">✕</button>
            </div>
        </div>
    );
};

const CheckCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export const ModelDetails = () => {
    const { id } = useParams();
    const { user, isLoading: isAuthLoading } = useAuth(); 
    const navigate = useNavigate();

    const isLoggedIn = !!user;

    // Firebase setup 
    const auth = getAuth();
    const db = getFirestore();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    const [model, setModel] = useState(null);
    const [isModelLoading, setIsModelLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false); 
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false); 
    const DESCRIPTION_LIMIT = 200; 

    
    // Purchase Status Logic 
    const checkPurchaseStatus = async (modelId, buyerEmail) => {
        const userId = auth.currentUser?.uid; 
        if (!userId) {
            setHasPurchased(false);
            return;
        }

        const purchasesRef = collection(db, `artifacts/${appId}/users/${userId}/purchases`);
        
        try {
            const q = query(
                purchasesRef,
                where('modelId', '==', modelId),
                where('buyerEmail', '==', buyerEmail)
            );
            
            const querySnapshot = await getDocs(q);
            setHasPurchased(!querySnapshot.empty);
        } catch (error) {
            console.error("Error checking purchase status:", error);
            setHasPurchased(false); 
        }
    };
    
    useEffect(() => {
        setIsModelLoading(true);
        setError(null);

        fetch(`${SERVER_BASE_URL}/models/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Model could not be found or server error.');
                return res.json();
            })
            .then(data => {
                setModel(data);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setModel(MOCK_MODEL); 
                setError(`Warning: Could not fetch live data from server. Displaying mock model. (${err.message})`);
            })
            .finally(() => {
                setIsModelLoading(false); 
            });
            
    }, [id]); 

    useEffect(() => {
        if (!isModelLoading && model && !isAuthLoading && isLoggedIn && user?.email) {
             checkPurchaseStatus(model._id, user.email);
        } else if (!isModelLoading && model) {
             setHasPurchased(false);
        }
    }, [isModelLoading, model, isAuthLoading, isLoggedIn, user?.email]); 

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message, type }), 4000);
    };

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const handlePurchase = async () => {
        if (!model) {
            showToast('Model data is still loading or unavailable. Please try again.', 'warning');
            return;
        }

        if (!isLoggedIn) {
            showToast('Authentication failed. Please log in again.', 'error');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }

        if (hasPurchased) { 
            showToast('You have already purchased this model.', 'error');
            return;
        }

        if (user?.email === model.developerEmail) {
            showToast('You cannot purchase your own model.', 'error');
            return;
        }

        setShowConfirmModal(true);
    };

    const confirmPurchase = async () => {
        setShowConfirmModal(false);
        setIsPurchasing(true);
        
        try {
            const token = await user.getIdToken();

            const transactionData = {
                modelId: model._id,
                modelName: model.modelName,
                buyerEmail: user.email,
                developerEmail: model.developerEmail, 
            };
            
            const res = await fetch(`${SERVER_BASE_URL}/purchase-model`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(transactionData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Transaction failed with status ${res.status}`);
            }

            // Transaction successful
            showToast(`Thank you for buying ${model.modelName}! A receipt has been recorded.`, 'success');
            setHasPurchased(true); 
            
        } catch (err) {
            console.error('Purchase Transaction Failed:', err);
            showToast(`Transaction Failed: ${err.message}`, 'error');
        } finally {
            setIsPurchasing(false);
        }
    };


    const isTotalLoading = isModelLoading || isAuthLoading;
    
    if (isTotalLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] bg-base-200 text-base-content">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="ml-3 text-lg">{isAuthLoading ? 'Authenticating User...' : 'Loading Model Details...'}</p>
            </div>
        );
    }

    if (!model) { 
        return (
            <div className="text-center p-10 min-h-[60vh] bg-base-200 text-base-content">
                <h1 className="text-4xl text-error font-bold">Error Loading Model</h1>
                <p className="text-xl mt-4 text-base-content/80">{error || 'Model data is empty.'}</p>
                <Link to="/" className="btn btn-primary mt-6">Back to Home</Link>
            </div>
        );
    }
    
    let buttonContent;
    let buttonDisabled = isPurchasing || user?.email === model.developerEmail || hasPurchased; 
    let buttonClass = "btn-lg w-full font-bold transition duration-300 ";

    if (!isLoggedIn) {
        // Logged Out
        buttonContent = 'Login to Purchase'; 
        buttonClass += ' btn-warning text-warning-content';
        buttonDisabled = false; 
    } else if (user?.email === model.developerEmail) {
        // Developer
        buttonContent = (
            <span className="font-bold">
                Your Model (Cannot Buy)
            </span>
        );
        buttonClass += ' btn-disabled bg-base-300 text-base-content/60 border-none'; 
        buttonDisabled = true;
    } else if (hasPurchased) {
        //  Purchased
        buttonContent = (
            <span className="flex items-center justify-center  text-pink-400">
                <p>
                You have already bought it
                </p>
                
            </span>
        );
        buttonClass += ' btn-success text-success-content';
        buttonDisabled = true;
    } else if (isPurchasing) {
        buttonContent = 'Processing Transaction...';
        buttonClass += ' btn-accent loading text-accent-content'; 
        buttonDisabled = true;
    } else {
        // Buy 
        buttonContent = `Buy Now`;
        buttonClass += ' btn-accent text-accent-content';
        buttonDisabled = false;
    }

    // Purchase button click handler: Logged In hole handlePurchase, na hole /login-e page niye jabe
    const finalButtonAction = isLoggedIn ? handlePurchase : () => navigate('/login');

    return (
        <div className="container mx-auto p-4 md:p-10 min-h-screen bg-base-200">
            <ToastNotification 
                show={toast.show} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, show: false })} 
            />

            
            {model._id === MOCK_MODEL._id && (
                <div role="alert" className="alert alert-warning mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>Warning: Could not connect to the live server. Displaying **MOCK DATA** for UI testing.</span>
                </div>
            )}
            
            <div className="bg-base-100 rounded-xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    
                    {/* Image and Primary Info  */}
                    <div className="lg:col-span-1">
                        <figure className="aspect-video rounded-lg overflow-hidden shadow-lg mb-6">
                            <img 
                                src={model.imageUrl || 'https://placehold.co/800x600/F3F4F6/9CA3AF?text=Model+Image'} 
                                alt={model.modelName} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = 'https://placehold.co/800x600/F3F4F6/9CA3AF?text=Model+Image';
                                }}
                            />
                        </figure>
                        <div className="text-center py-4 bg-primary text-primary-content rounded-lg shadow-xl">
                            <h2 className="text-2xl font-extrabold">Price on Request</h2> 
                            <p className="text-sm opacity-80 mt-1">One-time License Fee</p>
                        </div>
                    </div>

                    {/* Details and Description  */}
                    <div className="lg:col-span-2 text-base-content">
                        <h1 className="text-5xl font-extrabold mb-4">{model.modelName}</h1>

                    {/* description section */}
                        <div className="border-b border-base-300 pb-4 mb-4">
                            <h3 className="text-xl font-semibold text-base-content/80 mb-2">Description</h3>
                            
                            {model.description && model.description.length > DESCRIPTION_LIMIT ? (
                                <>
                                    <p className="text-lg text-base-content/70 whitespace-pre-wrap">
                                        {isExpanded 
                                            ? model.description 
                                            : model.description.substring(0, DESCRIPTION_LIMIT) + '...'
                                        }
                                    </p>
                                    <button 
                                        onClick={toggleDescription}
                                        className="text-primary hover:text-secondary font-bold mt-2 text-sm transition duration-200"
                                    >
                                        {isExpanded ? 'Show Less' : 'See More'}
                                    </button>
                                </>
                            ) : (
                                <p className="text-lg text-base-content/70 whitespace-pre-wrap">{model.description}</p>
                            )}
                        </div>


                        <div className="grid grid-cols-2  gap-4 mb-6">
                            
                            {/* Use Case */}
                            <div className="bg-base-200 p-3 rounded-lg md:col-span-2">
                                <p className="text-xs text-base-content/60 font-medium">Use Case</p>
                                <p className="text-lg font-semibold text-secondary wrap-break-words">{model.useCase || 'N/A'}</p>
                            </div>
                    
                            {/* Dataset */}
                            <div className="bg-base-200 p-3 rounded-lg md:col-span-2">
                                <p className="text-xs text-base-content/60 font-medium">Dataset</p>
                                <p className="text-lg font-semibold text-secondary wrap-break-words">{model.dataset || 'N/A'}</p>
                            </div>

                            {/* Framework */}
                            <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-base-content/60 font-medium">Framework</p>
                                <p className="text-lg font-semibold text-secondary">{model.framework}</p>
                            </div>

                            {/* Category*/}
                            <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-base-content/60 font-medium">Category</p>
                                <p className="text-lg font-semibold text-secondary">{model.category}</p>
                            </div>

                            {/* Purchase Count */}
                            <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-base-content/60 font-medium">Purchase Count</p>
                                <p className="text-lg font-semibold text-primary">{model.purchased || 0}</p>
                            </div>

                            {/* Developer*/}
                            <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-base-content/60 font-medium">Developer</p>
                                <p className="text-lg font-semibold text-secondary truncate">{model.developerEmail}</p>
                            </div>

                            {/* Model Id */}
                            <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-base-content/60 font-medium">Model ID</p>
                                {/* 🔑 ফিক্স ৯: Model ID টেক্সট text-base-content/70 */}
                                <p className="text-sm font-mono text-base-content/70 truncate">{model._id}</p>
                            </div>
                        </div>

                        {/* Purchase Button */}
                        <div className="mt-8">
                            <button
                                onClick={finalButtonAction}
                                className={`btn ${buttonClass}`}
                                disabled={buttonDisabled}
                            >
                                {buttonContent}
                            </button>
                            {/* purchased history */}
                            {hasPurchased && (
                                <Link to="/app/purchase-history" className="btn btn-sm btn-link mt-2 block text-center text-primary hover:text-secondary">
                                    Go to My Purchase History
                                </Link>
                            )}

                            <p className="text-sm text-base-content/60 mt-3 text-center">
                                {isLoggedIn ? 'Your purchase is secured by Firebase Authentication.' : 'Authentication is required for all transactions.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-base-content bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-base-100 p-8 rounded-xl shadow-2xl max-w-sm w-full text-base-content">
                        <h3 className="text-2xl font-bold mb-4">Confirm Purchase?</h3>
                        <p className="text-base-content/80 mb-6">
                            Are you sure you want to buy <strong>{model.modelName}</strong> 
                            ?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => setShowConfirmModal(false)} 
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmPurchase} 
                                className={`btn btn-primary ${isPurchasing ? 'loading' : ''}`} 
                                disabled={isPurchasing}
                            >
                                {isPurchasing ? 'Processing...' : 'Yes, Purchase it!'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};