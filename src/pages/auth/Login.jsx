import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; 
import RegistorBtn from '../../components/buttons/RegistorBtn.jsx';
import LogInLoader from '../../components/Loader/LogInLoader/LogInLoader.jsx';


// পরিবর্তন ১: export const login থেকে const Login এ পরিবর্তন
const Login = () => { // ফাংশনের নাম বড় হাতের
    const [email, setEmail] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/app'); 
            
        } catch (err) {
            console.error(err);
            let errorMessage = "An unknown error occurred.";
            if (err.code === 'auth/invalid-email' || err.code === 'auth/wrong-password') errorMessage = 'Invalid email address or password.';
            else if (err.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
            else if (err.code === 'auth/weak-password') errorMessage = 'Password should be at least 6 characters.';
            else if (err.code === 'auth/too-many-requests') errorMessage = 'Access temporarily blocked due to too many failed attempts.';

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const labelBgClass = " bg-base-100! ";

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-base-200">
            {isLoading && <LogInLoader />}
            
            <div className="card w-full max-w-md p-6 rounded-lg bg-base-100 text-base-content shadow-xl shadow-base-content/10 dark:shadow-[0_0_25px_rgba(109,40,217,0.7)]  dark:hover:shadow-[0_0_35px_rgba(99,102,241,0.9)] border border-base-300 transition duration-500 z-10">
                
                <form className="card-body" onSubmit={handleSubmit}>
                    
                    {/*Animation */}
                    <h2 className="card-title text-primary justify-center">
                        <div style={{ 
                            width: '250px', 
                            height: '250px', marginBottom: '-70px', marginTop: '-80px' }}>
                            <DotLottieReact
                                src="https://lottie.host/ad7cb7f5-fa39-4825-bfdb-1aba3b76dc70/bMGjzqthd6.lottie"
                                loop
                                autoplay
                            />
                        </div>
                    </h2>
                
                    {error && (
                        <div role="alert" className="alert alert-error mb-4 text-error-content">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Email Input  */}
                    <div className="form-control relative mb-6"> 
                        <label 
                            htmlFor="email-input"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass}
                            ${email || emailFocused
                                ? 'text-primary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80 mt-2 left-3' 
                            }`}
                        >
                            Email Address
                        </label>

                        <input
                            id="email-input"
                            type="email"
                            placeholder="" 
                            className="input w-full bg-transparent border border-base-300 text-base-content 
                            placeholder-base-content/50 rounded-lg transition duration-300 
                            focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={()=> setEmailFocused(true)}
                            onBlur={()=> setEmailFocused(email.trim() !== '')}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="form-control relative mb-2">
                        <label  htmlFor="password-input"
                        className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass}
                            ${password || passwordFocused
                                ? 'text-primary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80 mt-2 left-3' 
                            }`}
                        >
                            Password
                        </label>

                        <input
                          id='password-input'
                          type="password"
                          placeholder=""
                          className="input w-full pt-2 pb-2 bg-transparent border border-base-300 text-base-content 
                          placeholder-base-content/50 rounded-lg transition duration-300 
                          focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"

                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(password.trim() !== '')}
                            required
                        />
                    </div>

                    {/* Log In Button  */}
                    <div className="form-control mt-1"> 
                        <button 
                            type="submit" 
                            className={`btn btn-primary text-primary-content w-full font-bold rounded-xl ${isLoading ? 'btn-disabled' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className="loading loading-spinner"></span> : 'Log In'}
                        </button>
                    </div>
                    
                    <div className="text-center mt-4">
                        <p className="text-sm text-base-content/70 mb-4">
                            Don't have an account? 
                        </p>

                         {/* Registration Button  */}
                         <div className="w-full flex justify-center">
                            <RegistorBtn onClick={()=>navigate ('/register')} 
                                className="group" 
                                > 
                                Registration
                            </RegistorBtn> 
                         </div> 
                    </div>
                </form>
            </div>
        </div>
    );
};

// পরিবর্তন ২: Default Export যোগ করুন
export default Login;