import { Outlet, useLocation, Link } from "react-router-dom";
import Navbar from "../component/shared/Navbar";
import Footer from "../component/shared/Footer";
// 🔑 Slider কম্পোনেন্ট ইম্পোর্ট করা হলো
import Slider from "../component/Slider/Slider"; // আপনার ফোল্ডার পাথ অনুযায়ী আপডেট করা হয়েছে

// ব্যানার কম্পোনেন্টটি সরিয়ে দেওয়া হলো

const MainLayout = () => {
  // কোন পেজে আছি তা জানার জন্য useLocation ব্যবহার করা হচ্ছে
  const location = useLocation();
  // হোম পেজে অথবা /models রুটে স্লাইডার দেখানো হবে
  const isHomePage = location.pathname === '/'; 

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white ">
      <Navbar />
      
      {/* 🔑 ব্যানারটির বদলে Slider কম্পোনেন্টটি শুধুমাত্র হোম পেজে দেখানো হলো */}
      {isHomePage && <Slider />}

      <main className="flex-grow container mx-auto p-4">
        {/* The Outlet renders the content of the current route (Home, Login, etc.) */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;