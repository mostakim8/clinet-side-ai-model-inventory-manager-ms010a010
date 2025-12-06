import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const ProfileUpdate = () => {
    const { user, updateUserProfile, isLoading: isAuthLoading } = useAuth(); 
    
    const [name, setName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    
    useEffect(() => {
        setName(user?.displayName || '');
        setPhotoURL(user?.photoURL || '');
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        if (isAuthLoading) {
            toast.error("User data is loading. Please wait a moment.");
            return;
        }

        if (!user) {
            toast.error("Authentication required. Redirecting to login.");
            return;
        }

        const newName = e.target.name.value;
        const finalPhotoURL = photoURL; 
        
        if (finalPhotoURL && !finalPhotoURL.startsWith('http')) {
             toast.error("Please enter a valid Image URL (must start with http or https).");
             return;
        }

        const profileChanged = newName !== user.displayName || finalPhotoURL !== user.photoURL;

        if (!profileChanged) {
            toast('No changes detected. Name or Photo URL is the same.', { icon: 'ℹ️' });
            return;
        }

        let updateToastId; 
        try {
            updateToastId = toast.loading('Saving changes...');
            
            await updateUserProfile(newName, finalPhotoURL);
            
           toast.success('Profile updated successfully!', { id: updateToastId });

        } catch (error) {
            console.error("Profile Update Failed:", error); 
            if (error.message.includes("No user is currently logged in")) {
                toast.error("Session error. Please refresh and try again.",{ id: updateToastId });
            } else {
                toast.error('Failed to update profile. ' + error.message ,{ id: updateToastId });
            }
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
                        src={photoURL || 'https://i.ibb.co/6y4tH7v/default-profile.png'} 
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
                            disabled={isAuthLoading} 
                        />
                    </div>
                    
                    <div className="space-y-2 p-4 border rounded-lg border-gray-600/50">
                        <label className="label">
                            <span className="label-text font-bold text-lg text-secondary">Update Profile Picture (Image URL)</span>
                        </label>
                        <input 
                            type="url"
                            name="photoURLInput"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                            placeholder="Paste ImgBB or other direct image URL here" 
                            className="input input-bordered w-full bg-base-300"
                            disabled={isAuthLoading}
                        />

                        <p className='text-xs text-gray-400 mt-2'>
                            Please use an external service like <a href="https://imgbb.com/" target="_blank" className="link link-accent font-bold">ImgBB</a> to host your image and paste the direct URL above.
                        </p>
                    </div>
                    
                    <input type="hidden" name="photoURL" value={photoURL} />

                    <button 
                        type="submit" 
                        className="w-full btn btn-primary mt-6" 
                        disabled={isAuthLoading} 
                    >
                        {isAuthLoading ? 'Loading User Data...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdate;