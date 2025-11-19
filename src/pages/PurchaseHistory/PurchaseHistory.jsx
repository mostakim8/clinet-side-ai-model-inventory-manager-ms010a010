import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider'; // ⬅️ Path corrected to '../../'
import { getAuth } from "firebase/auth"; 
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { Link } from 'react-router-dom';

const PurchaseHistory = () => {
    const { user } = useAuth();
    const auth = getAuth();
    const db = getFirestore();

    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Global App ID for Firestore path (MANDATORY)
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const userId = auth.currentUser?.uid || 'anonymous';
    // Firestore path for user's private purchase history
    const purchasesCollectionPath = `artifacts/${appId}/users/${userId}/purchases`;

    // --- Toast Functions ---
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const ToastNotification = () => {
        if (!toast.show) return null;
        const colorClass = toast.type === 'error' ? 'bg-red-500' : 'bg-green-500';

        return (
            <div className="toast toast-end z-50">
                <div className={`alert ${colorClass} text-white transition duration-300 shadow-xl`}>
                    <span>{toast.message}</span>
                </div>
            </div>
        );
    };
    // --- End Toast Functions ---

    // --- Fetch Purchase History (Real-time with onSnapshot) ---
    useEffect(() => {
        // Must wait for user to be authenticated
        if (!user || !user.uid) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, purchasesCollectionPath),
            where('buyerId', '==', user.uid)
        );

        // Attach real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedPurchases = [];
            querySnapshot.forEach((doc) => {
                fetchedPurchases.push({ ...doc.data(), id: doc.id });
            });
            // Sort by purchase date (newest first)
            fetchedPurchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
            setPurchases(fetchedPurchases);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching purchases:", error);
            showToast('Failed to load purchase history from database.', 'error');
            setLoading(false);
        });

        // Cleanup function for the listener
        return () => unsubscribe();
    }, [user?.uid]);

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return <div className="text-center py-20 text-3xl text-error">Please log in to view your purchase history.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <ToastNotification />
            
            <h1 className="text-4xl font-extrabold text-center mb-10 text-secondary">
                My Purchase History ({purchases.length})
            </h1>
            
            {purchases.length === 0 ? (
                <p className="text-center text-xl text-gray-500">
                    আপনি এখনও কোনো মডেল কিনেননি। <Link to="/" className='link link-primary font-bold'>হোম পেজে যান</Link>।
                </p>
            ) : (
                <div className="space-y-4">
                    {purchases.map((purchase) => (
                        <div key={purchase.id} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary hover:shadow-xl transition duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{purchase.modelName}</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Category: <span className='font-semibold'>{purchase.category || 'N/A'}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-extrabold text-green-600">
                                        ${purchase.price.toFixed(2)}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
                                <p><strong>Developer:</strong> {purchase.developerEmail}</p>
                                <Link 
                                    to={`/models/${purchase.modelId}`} 
                                    className='btn btn-sm btn-outline btn-info'
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;