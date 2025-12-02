import React, { useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import AboutAIModelsSection from './AboutAIModelsSection';
// import { useAuth } from '../../providers/AuthProvider'; // Auth লজিক কমেন্ট করা হয়েছে
// import Loader from '../../components/Loader/Loader'; 


const WelcomeScreen = () => {
    // const { user, loading } = useAuth(); 
    const navigate = useNavigate();

    // 🔑 লগড-ইন ইউজারদের জন্য স্বয়ংক্রিয় রিডাইরেক্ট লজিক (কমেন্টেড):
    // useEffect(() => {
    //     if (!loading && user) {
    //         navigate('/app', { replace: true }); 
    //     }
    // }, [user, loading, navigate]);


    // 🛠️ একক বাটন লজিক: Get Started ক্লিক করলে সরাসরি /login রুটে নিয়ে যাবে।
    const handleGetStarted = () => {
        // এই নেভিগেশনটি ওয়ান-ক্লিক সাইনআপ/লগইন ফ্লো শুরু করে।
        // ইউজার এখন লগইন পেজে গিয়ে ইমেইল দেবে, এবং লগইন পেজটিই যাচাই করবে।
        navigate('/login'); 
    };
    

    // 🔑 Loading অবস্থায় শুধু একটি বার্তা বা Loader দেখাও:
    // if (loading) {
    //     return (
    //         <div 
    //             className="flex items-center justify-center min-h-screen w-full text-white"
    //             style={{ backgroundColor: '#0c101d' }}
    //         >
    //             <span className="loading loading-dots loading-lg text-indigo-400"></span>
    //             <p className="ml-4">Verifying user session...</p>
    //         </div>
    //     );
    // }
    
    // 🔑 স্ট্যাটিক Welcome Page (যদি লগড-আউট থাকে)
    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen text-white text-center"
            style={{ backgroundColor: '#0c101d' }}
        >
            <h1 className="text-6xl font-extrabold mb-6 text-indigo-400">
                Welcome to the AI Model Marketplace
            </h1>
            <p className="mb-10 text-xl text-gray-400 max-w-2xl">
               Discover, compare, and integrate the best AI models for your projects. Start your journey here.
            </p>

            {/* 🛠️ একক Get Started বাটন যা /login এ নিয়ে যাবে */}
            <button
                onClick={handleGetStarted}
                className="btn btn-lg bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-2xl transition duration-300 transform hover:scale-105"
            >
                Get Started
            </button>
            
            <p className="mt-4 text-gray-500 text-sm">
                Click "Get Started" to Login or Create an Account.
            </p>

           <AboutAIModelsSection/>
        </div>
    );
};

export default WelcomeScreen;