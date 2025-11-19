import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider'; 
import { getAuth } from "firebase/auth"; 
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

const SERVER_BASE_URL = 'http://localhost:5001';

const ModelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const auth = getAuth();
    // ⚠️ IMPORTANT: db instance must be initialized after firebase init, which happens implicitly here.
    const db = getFirestore(); 

    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPurchased, setIsPurchased] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Global App ID for Firestore path (MANDATORY)
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const userId = auth.currentUser?.uid || 'anonymous';
    // Firestore path for user's private purchase history
    const purchasesCollectionPath = `artifacts/${appId}/users/${userId}/purchases`;

    // --- Toast & Utility Functions ---
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const ToastNotification = () => {
        if (!toast.show) return null;
        const colorClass = toast.type === 'success' 
            ? 'bg-green-500' 
            : toast.type === 'info' 
                ? 'bg-blue-500'
                : 'bg-red-500';

        return (
            <div className="toast toast-end z-50">
                <div className={`alert ${colorClass} text-white transition duration-300 shadow-xl`}>
                    <span>{toast.message}</span>
                </div>
            </div>
        );
    };

    // --- 1. Fetch Model Data ---
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        // Fetch model details
        fetch(`${SERVER_BASE_URL}/models/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Model not found or network error.');
                return res.json();
            })
            .then(data => {
                setModel(data);
                setLoading(false);
                // Check if the user has already purchased this model (runs after model data is set)
                if (user?.uid) {
                    checkPurchaseStatus(data._id);
                }
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                showToast(`Failed to load model details: ${error.message}`, 'error');
                setLoading(false);
            });
    }, [id, user?.uid]); // Reload if ID or user changes

    // --- 2. Check Purchase Status using Firestore (Task 8 related) ---
    const checkPurchaseStatus = async (modelId) => {
        if (!userId || userId === 'anonymous') return;

        try {
            // Querying the user's private purchase collection
            const q = query(
                collection(db, purchasesCollectionPath),
                where('modelId', '==', modelId),
                where('buyerId', '==', userId)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setIsPurchased(true);
            }
        } catch (e) {
            console.error("Error checking purchase status:", e);
            // This error is non-critical for viewing the page
        }
    };

    // --- 3. Handle Purchase Logic (CRITICAL FIX) ---
    const handlePurchase = async () => {
        if (!user) {
            showToast('Please log in to purchase this model.', 'info');
            return;
        }

        if (isPurchased) {
            showToast('You already own this model.', 'info');
            return;
        }

        setIsProcessing(true);

        const purchaseData = {
            modelId: model._id,
            modelName: model.modelName,
            price: model.price,
            developerEmail: model.developerEmail,
            buyerEmail: user.email,
            buyerId: userId,
            category: model.category, // Include category for history display
            purchaseDate: new Date().toISOString(),
        };

        try {
            // Get Firebase Token for server authentication
            const token = await user.getIdToken();
            
            // 1. Record the transaction in Firestore (Private History)
            const purchaseRef = doc(db, purchasesCollectionPath, `${model._id}-${userId}`);
            await setDoc(purchaseRef, purchaseData);
            
            // 2. CRITICAL FIX: Update Server-Side Purchase Counter (Public Count)
            // Call the PATCH endpoint to increment the 'purchased' field
            const res = await fetch(`${SERVER_BASE_URL}/models/purchase/${model._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (!res.ok) {
                 // Log a warning if the public count update fails, but proceed since the private record is saved
                console.warn(`Server purchase count update failed with status ${res.status}.`);
            }

            setIsPurchased(true);
            showToast(`Purchase successful! You now own ${model.modelName}.`, 'success');
            
        } catch (e) {
            console.error("Purchase Error:", e);
            showToast(`Transaction failed. Details: ${e.message || 'Check network connection.'}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!model) {
        return <div className="text-center py-20 text-3xl text-error">Model not found.</div>;
    }

    // Determine button state and text
    const buttonText = isPurchased ? 'Owned' : 'Buy Now';
    const buttonClass = isPurchased 
        ? 'btn-success cursor-not-allowed' 
        : 'btn-primary hover:bg-primary-focus';

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <ToastNotification />
            
            {/* Header and Back Button */}
            <button onClick={() => navigate('/')} className="btn btn-ghost mb-6 text-primary">
                ← Back to Home
            </button>

            <div className="bg-base-200 p-8 rounded-2xl shadow-2xl flex flex-col lg:flex-row gap-8">
                {/* Left Side: Image */}
                <div className="flex-shrink-0 lg:w-1/3">
                    <img
                        src={model.imageUrl || 'https://placehold.co/400x300/F3F4F6/9CA3AF?text=AI+Model'}
                        alt={model.modelName}
                        className="w-full h-auto object-cover rounded-xl shadow-lg aspect-square"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x300/F3F4F6/9CA3AF?text=AI+Model';
                        }}
                    />
                </div>

                {/* Right Side: Details and Action */}
                <div className="flex-grow lg:w-2/3">
                    <h1 className="text-5xl font-extrabold text-secondary mb-3">{model.modelName}</h1>
                    <p className="text-xl font-medium text-gray-600 mb-6">{model.category}</p>

                    <div className="divider"></div>
                    
                    {/* Price and Action */}
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <span className="text-4xl font-bold text-primary">
                            ${model.price.toFixed(2)}
                        </span>
                        
                        {/* Buy Button (Task 8 & Purchase Counter) */}
                        <button
                            onClick={handlePurchase}
                            className={`btn btn-lg ${buttonClass} text-white transition duration-300`}
                            disabled={isProcessing || isPurchased || !user}
                        >
                            {isProcessing ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                buttonText
                            )}
                        </button>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3 text-secondary">Description</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{model.description}</p>
                    </div>

                    {/* Metadata */}
                    <div className="text-sm text-gray-500 border-t pt-4">
                        <p><strong>Developer:</strong> {model.developerEmail}</p>
                        <p><strong>Model ID:</strong> {model._id}</p>
                        <p><strong>Total Purchases:</strong> <span className='font-bold text-secondary'>{model.purchased || 0}</span></p> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelDetails;