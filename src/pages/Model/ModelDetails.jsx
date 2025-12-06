import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const SERVER_BASE_URL = 'http://localhost:5001';

// Mock Data Fallback
const MOCK_MODEL = {
    _id: "60f71c4c8e7e1c0c8e7e1c0c",
    modelName: "Mock AI Data Model (Fallback)",
    description: "This is a placeholder model to allow UI testing of the purchase button when the backend server is not reachable. The purchase attempt will still try to contact the server.",
    // price: 9.99,
    category: "Data Analysis",
    developerEmail: "mock.developer@example.com",
    purchased: 42,
    imageUrl: "https://placehold.co/800x600/60A5FA/ffffff?text=MOCK+DATA",
};


// --- Custom Toast Component ---
const ToastNotification = ({ show, message, type, onClose }) => {
    if (!show) return null;
    const colorClass = type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-success';
    
    return (
        <div className="toast toast-top toast-center z-100">
            <div className={`alert ${colorClass} shadow-lg text-white`}>
                <div>
                    <span className='font-semibold'>{message}</span>
                </div>
                <button onClick={onClose} className="btn btn-sm btn-ghost ml-4">✕</button>
            </div>
        </div>
    );
};
// --- End Toast Component ---

// Inline SVG for Checkmark
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

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message, type }), 4000);
    };

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    // Purchase Status Check Logic (Firestore)
    const checkPurchaseStatus = async (modelId, buyerEmail) => {
        const userId = auth.currentUser?.uid; 
        if (!userId) {
            setHasPurchased(false);
            return;
        }

        // Firestore Path for Private User Purchases
        // /artifacts/{appId}/users/{userId}/purchases
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
    
    // --- 1. Data Fetching Effect (Model data) ---
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

    // --- 2. Purchase Check Effect (Depends on Model data and Auth status) ---
    useEffect(() => {
        if (!isModelLoading && model && !isAuthLoading && isLoggedIn && user?.email) {
             checkPurchaseStatus(model._id, user.email);
        } else if (!isModelLoading && model) {
             setHasPurchased(false);
        }
    }, [isModelLoading, model, isAuthLoading, isLoggedIn, user?.email]); 


    // --- 3. Secure Purchase Transaction Logic ---
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
                // price: model.price,
                buyerEmail: user.email,
                developerEmail: model.developerEmail, 
            };
            
            // Call the purchase endpoint
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

            // Transaction successful, update UI and Firestore status
            showToast(`Thank you for buying ${model.modelName}! A receipt has been recorded.`, 'success');
            setHasPurchased(true); 
            
        } catch (err) {
            console.error('Purchase Transaction Failed:', err);
            showToast(`Transaction Failed: ${err.message}`, 'error');
        } finally {
            setIsPurchasing(false);
        }
    };

    // --- 4. Render Logic ---
    const isTotalLoading = isModelLoading || isAuthLoading;
    
    if (isTotalLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="ml-3 text-lg text-gray-700">{isAuthLoading ? 'Authenticating User...' : 'Loading Model Details...'}</p>
            </div>
        );
    }

    if (!model) { 
        return (
            <div className="text-center p-10 min-h-[60vh] bg-gray-50">
                <h1 className="text-4xl text-red-600 font-bold">Error Loading Model</h1>
                <p className="text-xl mt-4 text-gray-700">{error || 'Model data is empty.'}</p>
                <Link to="/" className="btn btn-primary mt-6">Back to Home</Link>
            </div>
        );
    }
    
    // Button er state ebong content nirnoy
    let buttonContent;
    let buttonDisabled = isPurchasing || user?.email === model.developerEmail || hasPurchased; 
    let buttonClass = "btn-lg w-full text-white font-bold transition duration-300 ";

    if (!isLoggedIn) {
        // Logged Out
        buttonContent = 'Login to Purchase'; 
        buttonClass += ' btn-warning';
        buttonDisabled = false; 
    } else if (user?.email === model.developerEmail) {
        // Developer
        buttonContent = (
            <span className="text-error font-bold">
                Your Model (Cannot Buy)
            </span>
        );
        buttonClass += ' btn-disabled ';
        buttonDisabled = true;
    } else if (hasPurchased) {
        // Already Purchased
        buttonContent = (
            <span className="flex items-center justify-center ">
                <CheckCircleIcon className="mr-2 h-6 w-6" /> Licensed (View History)
            </span>
        );
        buttonClass += ' btn-success';
        buttonDisabled = true;
    } else if (isPurchasing) {
        // Processing
        buttonContent = 'Processing Transaction...';
        buttonClass += ' btn-accent loading'; 
        buttonDisabled = true;
    } else {
        // Ready to Buy (Logged In, Not Purchased)
        buttonContent = `Buy Now`;
        buttonClass += ' btn-accent';
        buttonDisabled = false;
    }

    // Purchase button click handler: Logged In hole handlePurchase, na hole /login-e redirect
    const finalButtonAction = isLoggedIn ? handlePurchase : () => navigate('/login');

    return (
        <div className="container mx-auto p-4 md:p-10 min-h-screen">
            <ToastNotification 
                show={toast.show} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, show: false })} 
            />

            {/* Display warning if mock data is used */}
            {model._id === MOCK_MODEL._id && (
                <div role="alert" className="alert alert-warning mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>Warning: Could not connect to the live server. Displaying **MOCK DATA** for UI testing.</span>
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    
                    {/* Image and Primary Info (Col 1) */}
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
                        <div className="text-center py-4 bg-primary text-white rounded-lg shadow-xl">
                            {/* <p className="text-3xl font-extrabold">${model.price.toFixed(2)}</p> */}
                            <p className="text-sm opacity-80 mt-1">One-time License Fee</p>
                        </div>
                    </div>

                    {/* Details and Description (Col 2 & 3) */}
                    <div className="lg:col-span-2">

                        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{model.modelName}</h1>

            {/* description section */}
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Description</h3>
                            
                            {model.description && model.description.length > DESCRIPTION_LIMIT ? (
                                <>
                                    <p className="text-lg text-gray-600 whitespace-pre-wrap">
                                        {isExpanded 
                                            ? model.description 
                                            : model.description.substring(0, DESCRIPTION_LIMIT) + '...'
                                        }
                                    </p>
                                    <button 
                                        onClick={toggleDescription}
                                        className="text-primary hover:text-pink-500 font-bold mt-2 text-sm transition duration-200"
                                    >
                                        {isExpanded ? 'Show Less' : 'See More'}
                                    </button>
                                </>
                            ) : (
                                <p className="text-lg text-gray-600 whitespace-pre-wrap">{model.description}</p>
                            )}
                        </div>


                        <div className="grid grid-cols-2  gap-4 mb-6">

                {/* row 1 */}
                            <div className="bg-base-200 p-3 rounded-lg md:col-span-2">


                                <p className="text-xs text-gray-500 font-medium">Use Case</p>
                                <p className="text-lg font-semibold text-secondary break-words">{model.useCase || 'N/A'}</p>

                                {/* <p className="text-xs text-gray-500 font-medium">Category</p>
                                <p className="text-lg font-semibold text-secondary">{model.category}</p> */}
                            </div>
                    {/* data set section */}
                 <div className="bg-base-200 p-3 rounded-lg md:col-span-2">
                                <p className="text-xs text-gray-500 font-medium">Dataset</p>
                                <p className="text-lg font-semibold text-secondary break-words">{model.dataset || 'N/A'}</p>
                            </div>
                    {/* row-2 */}

                    {/* framework section */}
                            <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 font-medium">Framework</p>
                                <p className="text-lg font-semibold text-secondary">{model.framework}</p>
                            </div>

     {/* Category section */}
                        <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 font-medium">Category</p>
                                <p className="text-lg font-semibold text-secondary">{model.category}</p>
                            </div>

        {/* row-3 */}
        {/* purchase count section */}
                            <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 font-medium">Purchase Count</p>
                                <p className="text-lg font-semibold text-primary">{model.purchased || 0}</p>
                            </div>

                            {/* Developer section*/}
                               <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 font-medium">Developer</p>
                                <p className="text-lg font-semibold text-secondary truncate">{model.developerEmail}</p>
                            </div>

                  {/* row-4 */}

                  {/* Model Id */}
                             <div className="bg-base-200 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 font-medium">Model ID</p>
                                <p className="text-sm font-mono text-gray-700 truncate">{model._id}</p>
                            </div>
                        </div>

                        {/* Purchase Action Button */}
                        <div className="mt-8">
                            <button
                                onClick={finalButtonAction}
                                className={`btn ${buttonClass}`}
                                disabled={buttonDisabled}
                            >
                                {buttonContent}
                            </button>
                            {/* Link to history if purchased */}
                            {hasPurchased && (
                                <Link to="/app/purchase-history" className="btn btn-sm btn-link mt-2 block text-center">
                                    Go to My Purchase History
                                </Link>
                            )}

                            <p className="text-sm text-gray-500 mt-3 text-center">
                                {isLoggedIn ? 'Your purchase is secured by Firebase Authentication.' : 'Authentication is required for all transactions.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Purchase?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to buy <strong>{model.modelName}</strong> 
                            {/* for ${model.price.toFixed(2)} */}
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
                                onClick={confirmPurchase} // This calls the API transaction
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