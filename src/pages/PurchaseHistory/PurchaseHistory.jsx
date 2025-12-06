import React, { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { collection, query, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const SERVER_BASE_URL = 'http://localhost:5001'; 

export const PurchaseHistory = () => {
    const { user, isLoading: isAuthLoading, db, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // use global app id
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    useEffect(() => {
        if (isAuthLoading) return;

        // if user is not logged in, redirect to login page
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchPurchases = async () => {
            setIsLoading(true);
            setError(null);
            
            const userId = user?.uid;
            if (!userId) {
                setError("User ID not available. Please ensure you are logged in.");
                setIsLoading(false);
                return;
            }

            // --- 1. Fetch Purchase Records from Firestore ---
            const historyCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/purchases`);
            let fetchedPurchases = [];
            
            try {
                const q = query(historyCollectionRef); 
                const querySnapshot = await getDocs(q);
                
                fetchedPurchases = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Timestamp useable form
                    purchaseDate: doc.data().purchaseDate?.toDate ? doc.data().purchaseDate.toDate().toLocaleDateString() : 'N/A'
                }));
                
            } catch (err) {
                console.error("Error fetching purchase history:", err);
                setError("Failed to load purchase history. Check console for details.");
                setIsLoading(false);
                return;
            }

            // --- 2. Fetch Detailed Model Data from Backend Server ---
            try {
                const modelDetailsPromises = fetchedPurchases.map(async (purchase) => {
                    const res = await fetch(`${SERVER_BASE_URL}/models/${purchase.modelId}`);
                    if (!res.ok) {
                        console.warn(`Model details not found for ID: ${purchase.modelId}`);
                        return { ...purchase, modelDetails: { framework: 'N/A', useCase: 'N/A', imageUrl: '' } };
                    }
                    const modelData = await res.json();
                    
                    return { ...purchase, modelDetails: modelData };
                });

                const purchasesWithDetails = await Promise.all(modelDetailsPromises);

                setPurchases(purchasesWithDetails.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))); 

            } catch (err) {
                 console.error("Error fetching model details:", err);
                 setPurchases(fetchedPurchases);
                 setError("Warning: Could not fetch detailed model info (Framework/Image). Displaying basic history.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPurchases();
    }, [isAuthLoading, isLoggedIn, user, db, navigate]);


    if (isAuthLoading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="ml-3 text-lg text-gray-700">
                    {isAuthLoading ? 'Checking Authentication...' : 'Loading Purchase History...'}
                </p>
            </div>
        );
    }
    
    if (error && !purchases.length) { // Error display only if no data at all
         return (
            <div className="p-10 min-h-screen bg-gray-50 text-center">
                <h1 className="text-3xl font-bold text-red-600">Error</h1>
                <p className="mt-4 text-gray-700">{error}</p>
                <Link to="/" className="btn btn-primary mt-6">Go to Home</Link>
            </div>
        );
    }

    if (!isLoggedIn) {
         return (
            <div className="p-10 min-h-screen bg-gray-50 text-center">
                <h1 className="text-3xl font-bold text-warning">Access Denied</h1>
                <p className="mt-4 text-gray-700">Please log in to view your purchase history.</p>
                <Link to="/login" className="btn btn-warning mt-6">Log In Now</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-10 min-h-screen">
            <h1 className="text-4xl font-extrabold text-primary mb-8 border-b pb-4">
                My Purchase History
            </h1>
            
            {/* Display Soft Error/Warning if model details failed */}
            {error && purchases.length > 0 && (
                 <div role="alert" className="alert alert-warning mb-6 shadow-md max-w-4xl mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{error}</span>
                </div>
            )}


            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-sm text-gray-600 mb-6 border-b pb-4">
                    <p>Buyer Email: <strong className="text-primary">{user.email || 'N/A'}</strong></p>
                    <p>Total Purchases: <strong className="text-secondary font-bold">{purchases.length}</strong></p>
                </div>
                
                {purchases.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-2xl text-gray-500">No purchases found yet!</p>
                        <p className="mt-2 text-gray-400">Time to explore our <Link to="/" className="text-accent underline">AI Model Market</Link>.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full bg-amber-50 ">
                            <thead>
                                {/* table headline */}
                                <tr className="bg-base-200 text-sm">
                                    <th>Image</th> {/* NEW */}
                                    <th>Name</th>
                                    <th>Framework</th> {/* NEW */}
                                    <th>Use Case</th> {/* NEW */}
                                    <th>Created By (Developer)</th>
                                    <th>Purchase Date</th>
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((p) => (
                                    <tr key={p.id}>
                                        {/* Image (NEW) */}
                                        <td>
                                            <div className="avatar ">
                                                <div className="mask mask-squircle w-12 h-12 bg-base-300">
                                                    <img 
                                                        src={p.modelDetails?.imageUrl || 'https://placehold.co/100x100/CCCCCC/666666?text=No+Image'} 
                                                        alt={p.modelName} 
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Name */}
                                        <td className="font-semibold text-gray-800 text-center">
                                            {p.modelName}
                                        </td>

                                        {/* Framework (NEW) */}
                                        <td>
                                            <span className="badge badge-sm badge-outline badge-info truncate text-center">
                                                {p.modelDetails?.framework || 'N/A'}
                                            </span>
                                        </td>
                                        
                                        {/* Use Case (NEW) */}
                                        <td>
                                            <span className='text-xs text-gray-600 max-w-[100px] inline-block truncate'>
                                                {p.modelDetails?.useCase || 'N/A'}
                                            </span>
                                        </td>
                                        
                                        {/* Created By (Developer Email) */}
                                        <td className="text-gray-600 text-xs font-mono">
                                            {p.developerEmail}
                                        </td>
                                        
                                        {/* Purchase Date */}
                                        <td className='text-sm font-medium text-gray-600 text-center'>
                                            {p.purchaseDate}
                                        </td>
                                        
                                        {/* View Details Button (NEW) */}
                                        <td>
                                            <Link 
                                                to={`/app/model/${p.modelId}`} 
                                                className="btn btn-xs btn-primary btn-outline truncate "
                                            >
                                                View Details
                                            </Link>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};