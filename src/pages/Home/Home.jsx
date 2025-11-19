import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider'; // Assuming AuthProvider path is correct

const SERVER_BASE_URL = 'http://localhost:5001';

// --- Card Component for Models ---
const ModelCard = ({ model }) => (
    <div className="card w-full bg-base-100 shadow-xl image-full hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
        <figure>
            <img 
                src={model.imageUrl || 'https://placehold.co/400x300/F3F4F6/9CA3AF?text=AI+Model'} 
                alt={model.modelName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://placehold.co/400x300/F3F4F6/9CA3AF?text=AI+Model';
                }}
            />
        </figure>
        <div className="card-body bg-black bg-opacity-50 hover:bg-opacity-70 transition duration-300 justify-end p-6">
            <h2 className="card-title text-3xl text-white font-bold mb-1">{model.modelName}</h2>
            <p className="text-sm text-gray-300">Category: <span className="font-semibold text-primary">{model.category}</span></p>
            <div className="flex justify-between items-center mt-3">
                <p className="text-xl font-extrabold text-white">${model.price.toFixed(2)}</p>
                <Link to={`/models/${model._id}`} className="btn btn-primary btn-sm hover:scale-105 transition duration-200">
                    Details
                </Link>
            </div>
            {/* Display Purchase Count */}
            <p className="text-xs text-gray-400 mt-2">
                Purchased: {model.purchased || 0} times
            </p>
        </div>
    </div>
);
// --- End Model Card ---

const Home = () => {
    const { user } = useAuth(); // User info is available here
    const [allModels, setAllModels] = useState([]);
    const [featuredModels, setFeaturedModels] = useState([]); // 🔑 New State for Latest 6 Models
    const [loading, setLoading] = useState(true);
    const [featuredLoading, setFeaturedLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Category options for filtering
    const categories = ['All', 'LLM', 'Image Gen', 'Audio/Speech', 'Data Analysis', 'Other'];

    // --- Custom Toast Notification Functions ---
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

    // 🔑 1. Fetch Latest 6 Models (Featured Section)
    useEffect(() => {
        setFeaturedLoading(true);
        fetch(`${SERVER_BASE_URL}/models?latest=true`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch featured models.');
                return res.json();
            })
            .then(data => {
                setFeaturedModels(data);
                setFeaturedLoading(false);
            })
            .catch(error => {
                console.error("Error fetching featured models:", error);
                setFeaturedLoading(false);
                // Not showing a toast for featured models as the main model list might still load
            });
    }, []); 

    // 2. Fetch All Models (with Category Filter)
    useEffect(() => {
        setLoading(true);
        // Construct the URL based on the selected category
        const url = selectedCategory === 'All' 
            ? `${SERVER_BASE_URL}/models`
            : `${SERVER_BASE_URL}/models?category=${selectedCategory}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch models.');
                return res.json();
            })
            .then(data => {
                setAllModels(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching all models:", error);
                showToast('Failed to load model list. Ensure the server is running.', 'error');
                setLoading(false);
            });
    }, [selectedCategory]); // Re-run when category changes

    // --- Render Logic ---
    return (
        <div className="min-h-screen">
            <ToastNotification />

            {/* 🔑 1. Featured Models Section (Latest 6) */}
            <section className="max-w-6xl mx-auto px-4 py-8">
                <h2 className="text-4xl font-bold text-secondary mb-8 border-b-4 border-accent pb-2 inline-block">✨ Latest AI Model Releases</h2>
                
                {featuredLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <span className="loading loading-spinner loading-lg text-secondary"></span>
                    </div>
                ) : featuredModels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredModels.map(model => (
                            <ModelCard key={model._id} model={model} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-xl text-gray-500">No new models to feature right now.</p>
                )}
            </section>

            <hr className="my-10 max-w-6xl mx-auto" />

            {/* 🔑 2. About AI Models Section (Static) */}
            <section id="about" className="max-w-6xl mx-auto px-4 py-12 bg-base-200 rounded-xl shadow-inner mb-10">
                <h2 className="text-4xl font-bold text-primary text-center mb-6">About Our AI Model Marketplace</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-4">
                        <span className="text-5xl text-accent mb-3 block">🧠</span>
                        <h3 className="text-xl font-semibold mb-2">Proprietary Access</h3>
                        <p className="text-gray-600">Gain exclusive access to high-performance, developer-uploaded AI models not available anywhere else.</p>
                    </div>
                    <div className="text-center p-4">
                        <span className="text-5xl text-accent mb-3 block">💰</span>
                        <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
                        <p className="text-gray-600">Transparent pricing set by the developers, ensuring you get the best value for advanced AI capabilities.</p>
                    </div>
                    <div className="text-center p-4">
                        <span className="text-5xl text-accent mb-3 block">🔒</span>
                        <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                        <p className="text-gray-600">Leverage secure, authenticated purchases recorded instantly in your private history (Firestore).</p>
                    </div>
                </div>
            </section>

            <hr className="my-10 max-w-6xl mx-auto" />

            {/* All Models Section with Filter */}
            <section className="max-w-6xl mx-auto px-4 py-8">
                <h2 className="text-4xl font-bold text-secondary mb-6 border-b-2 pb-2">Browse All Models</h2>
                
                {/* Category Filter Dropdown */}
                <div className="mb-8 flex items-center gap-4">
                    <label className="text-lg font-semibold text-gray-700">Filter by Category:</label>
                    <select 
                        className="select select-bordered w-full max-w-xs"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : allModels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allModels.map(model => (
                            <ModelCard key={model._id} model={model} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-xl text-gray-500">No models found in the selected category.</p>
                )}
            </section>

            <hr className="my-10 max-w-6xl mx-auto" />

            {/* 🔑 3. Get Started CTA Section (Static) */}
            <section className="max-w-6xl mx-auto px-4 py-16 bg-accent text-white rounded-xl shadow-2xl mb-10">
                <div className="text-center">
                    <h2 className="text-5xl font-extrabold mb-4">Ready to Build or Buy?</h2>
                    <p className="text-xl mb-8 opacity-90">Join our platform today to either upload your own AI models or acquire new ones for your next big project.</p>
                    <div className="flex justify-center gap-6">
                        {user ? (
                            <>
                                <Link to="/add-model" className="btn btn-lg btn-primary text-white transition duration-300">
                                    Upload Your Model
                                </Link>
                                <Link to="/my-models" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-accent transition duration-300">
                                    View My Inventory
                                </Link>
                            </>
                        ) : (
                            <Link to="/register" className="btn btn-lg btn-primary text-white transition duration-300">
                                Get Started Now
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;