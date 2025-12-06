import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { updateProfile, createUserWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import auth from '../../firebase/firebase.config'; 
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import LogInLoader from '../../component/Loader/LogInLoader/LogInLoader.jsx';
import SuccessModal from '../../component/PopUp/Register/SuccessModal.jsx'; 
import RegisterLoading from '../../component/Loader/Register/RegisterLoading.jsx';


const Register = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); 

    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [photoUrlFocused, setPhotoUrlFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    
    const [name, setName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhotoUrl, setRegPhotoUrl] = useState('');
    const [regPassword, setRegPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); 
        setIsLoading(true);
        // ... (Validation code same as before)
        const formName = name; 
        const formEmail = regEmail;
        const formPassword = regPassword;
        const formPhotoURL = regPhotoUrl; 
        
        // --- Password Validation ---
        if (formPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }
        if (!/[A-Z]/.test(formPassword)) {
            setError('Password must contain at least one capital letter.');
            setIsLoading(false);
            return;
        }
        if (!/[!@#$%^&*()]/.test(formPassword)) {
            setError('Password must contain at least one special character, e.g., !@#$%^&*().');
            setIsLoading(false);
            return;
        }
        
        try {
            // 1. Create User
            const userCredential = await createUserWithEmailAndPassword(auth, formEmail, formPassword);
            const user = userCredential.user;

            // 2. Update Profile (Add Name and PhotoURL)
            await updateProfile(user, {
                displayName: formName,
                photoURL: formPhotoURL,
            });
            
            // 3. Log out 
            // await signOut(auth);
            
            setIsLoading(false); 
            setShowSuccessModal(true); 
            // navigate('/login'); 
            

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already in use. Try logging in.');
            } else {
                setError('Registration failed. Please check network and credentials.');
            }
        }
        finally{ 
            
            if (!showSuccessModal) { 
                setIsLoading(false); 
            }
        }
    };

    const handleRedirectToLogin = () => {
        setShowSuccessModal(false);
        navigate('/app');
    };


    //Google Sign In Handler
    const handleGoogleSignIn=async()=>{
        setError('');
        setIsLoading(true); 
        try{
            await signInWithPopup(auth,googleProvider);
            navigate('/app'); 
            setIsLoading(false);
        setShowSuccessModal(true);
        }


        catch (err){
            console.error("Google Sign-In Error:",err);
            setError('Google Sign-In failed. Please try again.');
        }

        finally{
            setIsLoading(false);
        }
    }


    return (
        
        <div className="relative flex items-center justify-center min-h-screen ">
            {isLoading && <RegisterLoading/>}
            {/*  Success Modal render */}
            {showSuccessModal && <SuccessModal onRedirect={handleRedirectToLogin} onClose={handleRedirectToLogin} />}

            <div className="card w-full max-w-md p-6 rounded-lg bg-[#131a2e] text-white shadow-[0_0_20px_rgba(109,40,217,0.7)] hover:shadow-[0_0_30px_rgba(99,102,241,0.9)]  border border-transparent hover:border-indigo-80 transition duration-500 z-10">
                
                <form className="card-body" onSubmit={handleRegister}>
                    
                    {/* Lottie Animation */}
                   <h2 className="card-title  justify-center">
                        <div style={{ width: '290px', height: '250px', marginBottom: '-55px', marginTop: '-50px' }}>
                            <DotLottieReact
                            src="https://lottie.host/af20f4e8-5f25-4a6a-be89-5f8f152ed2f1/VdKzLjZPfm.lottie"
                            loop
                            autoplay
                            />
                        </div>
                    </h2>
                
                    <h2 className="text-3xl font-bold pt-6 text-center text-primary mb-4">Create Account</h2>


                    {error && (
                        <div role="alert" className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/*  Input Fields (Name, Email, Photo URL, Password - Same as before) */}
                    {/* ... */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="name-input"
                            className={`absolute top-0 pointer-events-none font-bold  transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${name || nameFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100  text-[11px] px-1  z-10 left-3' 
                                : 'text-gray-400 opacity-80 pt-2 left-3' 
                            }`}
                        >
                            Your Name
                        </label>
                        <input
                            id="name-input"
                            type="text"
                            name="name"
                            placeholder="" 
                            className="input  w-full pt-2 pb-1 bg-transparent border-gray-700 text-gray-100 placeholder-gray-500 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setNameFocused(true)}
                            onBlur={() => setTimeout(() => setNameFocused(false), 100)} 
                            required={true}
                        />
                    </div>
                    
                    {/* 🚀 Email Input Field */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="email-input"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${regEmail || emailFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1 z-10 left-3 text-[12px]' 
                                : 'text-gray-400 opacity-80 pt-2 left-3' 
                            }`}
                        >
                            Email Address
                        </label>
                        <input
                            id="email-input"
                            type="email"
                            name="email"
                            placeholder="" 
                            className="input w-full pt-2 pb-2 bg-transparent border-gray-700 text-gray-100 placeholder-gray-500 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none" 
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setTimeout(() => setEmailFocused(false), 100)} 
                            required={true}
                        />
                    </div>

                    {/*  Photo URL Input Field */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="photoURL-input"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${regPhotoUrl || photoUrlFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 text-[11px] px-1 z-10 left-3' 
                                : 'text-gray-400 opacity-80 pt-2 left-3' 
                            }`}
                        >
                            Photo URL (Optional)
                        </label>
                        <input
                            id="photoURL-input"
                            type="url"
                            name="photoURL"
                            placeholder="" 
                            className="input w-full pt-2 pb-2 bg-transparent border-gray-700 text-gray-100 placeholder-gray-500 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none" 
                            value={regPhotoUrl}
                            onChange={(e) => setRegPhotoUrl(e.target.value)}
                            onFocus={() => setPhotoUrlFocused(true)}
                            onBlur={() => setTimeout(() => setPhotoUrlFocused(false), 100)} 
                            required={false}
                        />
                    </div>

                    {/*  Password Input Field */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="password-input"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${regPassword || passwordFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 text-[11px] px-1  z-10 left-3' 
                                : 'text-gray-400 opacity-80 pt-2 left-3' 
                            }`}
                        >
                            Password
                        </label>
                        <input
                            id="password-input"
                            type="password"
                            name="password"
                            placeholder="" 
                            className="input w-full pt-2 pb-2 bg-transparent border-gray-700 text-gray-100 placeholder-gray-500 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none" 
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setTimeout(() => setPasswordFocused(false), 100)} 
                            required={true}
                        />
                    </div>


                    <div className="form-control  mt-5">
                        <button type="submit" className={`w-full btn btn-secondary text-white font-bold ${isLoading || showSuccessModal ? 'btn-disabled':''}` } disabled={isLoading || showSuccessModal} >
                    Registered
                        </button>
                    </div>


                {/* Google Sign In Option  */}
                <div className="divider text-gray-500">OR</div>


                <div className="form-control">
                    <button 
                        type="button" 
                        onClick={handleGoogleSignIn}  
                        className={` w-full btn bg-gray-700 border-gray-600 hover:bg-gray-600 text-white ${isLoading ? 'btn-disabled':''}`} 
                        disabled={isLoading} 
                    >
                        {/*  SVG color adjusted for dark background */}
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.343c-1.29 5.86-5.871 9.874-11.343 9.874-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.156 7.96 3.034l5.657-5.657C34.047 5.795 29.28 4 24 4c-11.05 0-20 8.95-20 20s8.95 20 20 20c11.05 0 20-8.95 20-20c0-1.341-.138-2.65-.389-3.917z" /><path fill="#FF3D00" d="M6.306 14.693l6.571 4.819C14.655 15.108 18.9 12 24 12c3.059 0 5.842 1.156 7.96 3.034l5.657-5.657C34.047 5.795 29.28 4 24 4c-7.963 0-14.836 4.364-18.368 10.693z" /><path fill="#4CAF50" d="M24 44c5.108 0 9.771-1.638 13.313-4.481l-5.657-5.657C29.842 37.844 27.059 39 24 39c-5.448 0-10.129-4.32-11.343-9.874L6.306 33.307C9.838 39.636 16.709 44 24 44z" /><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.343c-.87 4.072-3.6 7.391-7.743 8.746-.232.084-.467.162-.702.234 3.498-3.045 5.735-7.464 5.735-12.28 0-1.341-.138-2.65-.389-3.917z" /></svg>
                        Sign up with Google (Gmail)
                    </button>        
                </div>
                </form>

                <div className="text-center p-4 pt-0">
                    <p className="text-gray-400">
                        Already have an account? <Link to="/login" className="link link-primary font-semibold">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;