import { Link } from 'react-router-dom';

const Footer = () => {
    // Current year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer p-10 bg-neutral text-neutral-content mt-16 border-t border-gray-700">
            <aside>
                {/* Simple Logo Placeholder */}
                <div className="text-3xl font-bold text-primary">AI Market</div>
                <p className='mt-2'>
                    AI Model Inventory Manager.<br/>
                    Providing reliable technology since 2024.
                </p>
                <p className="text-sm mt-4">
                    Copyright © {currentYear} - All rights reserved.
                </p>
            </aside> 
            <nav>
                <h6 className="footer-title">Services</h6> 
                <Link to="/add-model" className="link link-hover">Upload Model</Link>
                <Link to="/" className="link link-hover">Explore Models</Link>
                <Link to="/purchase-history" className="link link-hover">Purchase History</Link>
            </nav> 
            <nav>
                <h6 className="footer-title">Company</h6> 
                <a href="#about" className="link link-hover">About Us</a> 
                <Link to="/my-models" className="link link-hover">My Inventory</Link>
                <Link to="/register" className="link link-hover">Join as Developer</Link>
            </nav> 
            <nav>
                <h6 className="footer-title">Legal</h6> 
                <a href="#" className="link link-hover">Terms of use</a> 
                <a href="#" className="link link-hover">Privacy policy</a> 
                <a href="#" className="link link-hover">Cookie policy</a>
            </nav>
        </footer>
    );
};

export default Footer;