import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider'; 
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
    // Auth context theke user info newa
    const { user } = useAuth();
    const navigate = useNavigate();
    const auth = getAuth();

    // Logout handler
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Successful sign out er por login page e redirect
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
            // Simple alert used as a fallback, ideally replaced by a toast/modal
            window.alert("Logout failed. Check console for details.");
        }
    };

    // Common navigation links for both mobile and desktop
    const navLinks = (
        <>
            <li><Link to="/">Home</Link></li>
            {/* Only show these links if the user is logged in */}
            {user && <li><Link to="/add-model">Add Model</Link></li>}
            {user && <li><Link to="/my-models">My Models</Link></li>}
            {/* 🔑 CRITICAL: Purchase History Link */}
            {user && <li><Link to="/purchase-history">Purchase History</Link></li>}
        </>
    );

    return (
        <div className="navbar bg-base-300 shadow-lg sticky top-0 z-40">
            <div className="navbar-start">
                {/* Mobile Dropdown (Hamburger Menu) */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navLinks}
                    </ul>
                </div>
                {/* Logo/Brand */}
                <Link to="/" className="btn btn-ghost text-xl font-bold text-primary hover:bg-transparent">
                    AI Model Marketplace
                </Link>
            </div>

            {/* Desktop Links */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 font-semibold">
                    {navLinks}
                </ul>
            </div>

            {/* User/Auth Actions */}
            <div className="navbar-end">
                {user ? (
                    // Authenticated User Dropdown
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                {/* Email er prothom letter */}
                                {user.email ? user.email[0].toUpperCase() : 'U'}
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <span className="justify-between text-sm font-bold text-secondary">
                                    {user.email}
                                </span>
                            </li>
                            {/* Dropdown e shob important user links */}
                            <li><Link to="/add-model">Add Model</Link></li>
                            <li><Link to="/my-models">My Models</Link></li>
                            <li><Link to="/purchase-history">Purchase History</Link></li>
                            <li><a onClick={handleLogout} className='text-error font-semibold'>Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    // Guest User Links
                    <Link to="/login" className="btn btn-primary text-white hover:bg-primary-focus transition duration-300">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;