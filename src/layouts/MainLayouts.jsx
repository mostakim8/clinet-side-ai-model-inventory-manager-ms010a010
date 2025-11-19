import { Outlet, useLocation, Link } from "react-router-dom";

import Navbar from "../component/shared/Navbar";
import Footer from "../component/shared/Footer";

// ব্যানার কম্পোনেন্ট (শুধুমাত্র হোম পেজের জন্য)
const Banner = () => (
    <div className="hero bg-base-100 py-16 lg:py-24 border-b border-gray-200">
        <div className="hero-content text-center">
            <div className="max-w-4xl">
                <h1 className="text-6xl font-extrabold mb-5 text-secondary leading-tight">
                    Build AI Model For Future
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                    Browse a range of cutting-edge AI models across different categories from our inventory, or easily upload and manage your own custom models.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link to="/models" className="btn btn-primary btn-lg text-white shadow-xl hover:bg-primary-focus transition duration-300">
                        Show All Models
                    </Link>
                    <Link to="/add-model" className="btn btn-outline btn-primary btn-lg shadow-xl transition duration-300">
                        Upload Model
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

const MainLayout = () => {
  // কোন পেজে আছি তা জানার জন্য useLocation ব্যবহার করা হচ্ছে
  const location = useLocation();
  // হোম পেজে অথবা /models রুটে ব্যানার দেখানো হবে
  const isHomePage = location.pathname === '/' || location.pathname === '/models'; 

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white ">
      <Navbar />
      
      {/* ব্যানারটি শুধুমাত্র হোম পেজে দেখানোর জন্য যোগ করা হলো */}
      {isHomePage && <Banner />}

      <main className="flex-grow container mx-auto p-4">
        {/* The Outlet renders the content of the current route (Home, Login, etc.) */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;