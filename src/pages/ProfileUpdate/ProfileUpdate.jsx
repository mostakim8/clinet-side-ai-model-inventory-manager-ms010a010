// client/src/pages/ProfileUpdate.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { Helmet } from 'react-helmet-async'; // ✅ Eta shothik
import { toast } from 'react-hot-toast';

const ProfileUpdate = () => {
    // AuthProvider theke user o updateUserProfile function use kora
    const { user, updateUserProfile } = useAuth();
    
    const [name, setName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    
    // User data change hole state update kora
    useEffect(() => {
        setName(user?.displayName || '');
        setPhotoURL(user?.photoURL || '');
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        // Form-er input theke notun value nawa
        const newName = e.target.name.value;
        const newPhotoURL = e.target.photoURL.value;

        try {
            // 🔑 CORE LOGIC: AuthProvider er function call kora
            await updateUserProfile(newName, newPhotoURL);
            
            // Success toast message
            toast.success('Profile updated successfully! Reloading...');
            
            // Update successful hole page-ke force reload korte hobe 
            // jate AuthProvider-er 'onAuthStateChanged' notun user data fetch korte pare.
            window.location.reload(); 

        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile. ' + error.message);
        }
    };

    return (
        <div className="min-h-[calc(100vh-250px)] flex flex-col items-center justify-center p-4">
             <Helmet>
                <title>AI Market | Update Profile</title>
            </Helmet>
            <div className="w-full max-w-lg p-8 space-y-6 bg-base-100 rounded-lg shadow-xl border border-primary/20">
                <h2 className="text-3xl font-bold text-center text-primary">Update Profile</h2>
                
                {/* Current User Info Card */}
                <div className="flex flex-col items-center p-4 bg-base-200 rounded-lg border border-gray-700/50">
                    <img 
                        src={user?.photoURL || 'https://i.ibb.co/6y4tH7v/default-profile.png'} 
                        alt="Current Profile" 
                        className="w-24 h-24 object-cover rounded-full border-4 border-accent"
                    />
                    <p className="mt-4 text-xl font-semibold">{user?.displayName || 'User Name Not Set'}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                </div>

                {/* Profile Update Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">New Name</span>
                        </label>
                        <input 
                            type="text" 
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter new display name" 
                            className="w-full input input-bordered bg-base-300" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">New Photo URL</span>
                        </label>
                        <input 
                            type="url" 
                            name="photoURL"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                            placeholder="Paste new photo URL" 
                            className="w-full input input-bordered bg-base-300" 
                        />
                    </div>
                    <button type="submit" className="w-full btn btn-primary mt-6">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdate;