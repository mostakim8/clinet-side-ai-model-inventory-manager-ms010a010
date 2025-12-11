import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider'; 
import ThemeToggle from '../themeToggle/ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth(); 
    const navigate = useNavigate();

    // Logout handler
    const handleLogout = async () => {
        try {
            await logout(); 
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
            window.alert("Logout failed. Check console for details.");
        }
    };

    const navLinks = (
        <>
            <li>
                <Link to={user ? "/app" : "/"} className='text-base-content'>Home</Link>
            </li>
            
            <li>
                <Link to={user ? "/app/models" : "/models"} className='text-base-content'>All Models</Link>
            </li> 
            
            {user && <li>
                <Link to="/app/add-model" className='text-base-content'>Add Model</Link>
            </li>}
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-lg sticky top-0 px-8 z-40 border-b border-base-300 transition duration-100">
            
            <div className="navbar-start">
                {/* Dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-base-content">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow font-semibold bg-base-100 text-base-content rounded-box w-52">
                        {navLinks}
                    </ul>
                </div>
                <Link to={user ? "/app" : "/"} className="btn btn-ghost text-xl font-bold text-primary hover:bg-transparent">
                    AI Model Marketplace
                </Link>
            </div>

            {/* Desktop*/}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 font-semibold text-base-content">
                    {navLinks}
                </ul>
            </div>

        
            <div className="navbar-end">
                <ThemeToggle/>
                {user ? (
                    
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                                
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || user.email} className="w-full h-full  rounded-full object-cover" />
                                ) : (
                                    <span className="text-xl">
                                        {user.displayName ? user.displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
                                    </span>
                                )}
                            </div>
                        </div>
                        <ul tabIndex={0} className="w-52 menu menu-sm dropdown-content mt-3 z-1 p-2 
                        bg-base-100 
                        text-base-content 
                        shadow 
                        rounded-box">
                            {/* Profile Info */}
                            <li>
                                <Link to="/app/profile-update" className="justify-between text-sm font-bold text-base-content">

                                <div className='flex flex-col items-start leading tight pr-2 -mr-14 '>
                                  {/* user name */}
                                {user.displayName && <span className=' truncate text-sm font-extrabold text-secondary'> {user.displayName}</span>}

                                {/* email  */}
                                <span className={`truncate text-xs text-base-content/70 ${!user.displayName && 'text-sm font-bold text-secondary'}`}>
                                  {user.email}
                                </span>
                                </div>
                                <span className='badge badge-primary badge-outline text-[10px] -mt-5 
                              '>Profile</span>
                                </Link>
                            </li>
                            
                            {/* My Models Dropdown*/}
                            <li>
                                <Link to="/app/my-models">
                                    My Models
                                </Link>
                            </li>
                            
                            {/* 3. Purchase History*/}
                            <li>
                                <Link to="/app/purchase-history">
                                    Model Purchase History
                                </Link>
                            </li>
                            
                            <div className="divider my-1 h-px bg-base-300"></div> 
                            
                            {/* 4. Logout  */}
                            <li>
                                <a onClick={handleLogout} className='text-error font-semibold'>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                ) : (
                    // log in
                    <Link to="/login" className="btn btn-primary text-white hover:bg-primary-focus transition duration-300">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;