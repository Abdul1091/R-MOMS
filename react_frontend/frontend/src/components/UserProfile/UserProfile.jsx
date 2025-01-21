import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile } from '../../api/user';
import { changePassword } from '../../api/auth';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        profile_picture: '',
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchUserProfile();
                setProfile(data);
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    profile_picture: data.profile_picture || '',
                });
            } catch (err) {
                setError(err.error || 'Failed to load profile');
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedProfile = await updateUserProfile(formData);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (err) {
            setError(err.error || 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('New password and confirmation do not match');
            return;
        }

        try {
            await changePassword(passwordData);
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: '',
            });
            setIsChangingPassword(false);
            setError(null);
        } catch (err) {
            setError(err.error || 'Failed to change password');
        }
    };

    if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>
            {profile ? (
                isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Profile Edit Form */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">First Name:</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="p-2 border rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Last Name:</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="p-2 border rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-2 border rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Profile Picture URL:</label>
                            <input
                                type="text"
                                name="profile_picture"
                                value={formData.profile_picture}
                                onChange={handleChange}
                                className="p-2 border rounded-md shadow-sm"
                            />
                        </div>
                        
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : isChangingPassword ? (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Current Password:</label>
                            <input
                                type="password"
                                name="current_password"
                                value={passwordData.current_password}
                                onChange={handlePasswordChange}
                                className="p-2 border rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">New Password:</label>
                            <input
                                type="password"
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                className="p-2 border rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Confirm New Password:</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={passwordData.confirm_password}
                                onChange={handlePasswordChange}
                                className="p-2 border rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                            >
                                Change Password
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsChangingPassword(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        
                        {/* Profile Details */}
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                        >
                            Change Password
                        </button>
                    </div>
                )
            ) : (
                <p className="text-center text-gray-600">Loading profile...</p>
            )}
        </div>
    );
};

export default UserProfile;