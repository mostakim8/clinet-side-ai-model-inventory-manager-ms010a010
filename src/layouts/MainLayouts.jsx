import { Outlet, useLocation, Link } from "react-router-dom";
import Navbar from "../component/shared/Navbar";
import Footer from "../component/shared/Footer";
import Slider from "../component/Slider/Slider"; // আপনার ফোল্ডার পাথ অনুযায়ী আপডেট করা হয়েছে


const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/app'; 

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white ">
      <Navbar />
      
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