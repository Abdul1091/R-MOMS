import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../api/auth';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await changePassword(formData);
            setMessage(response.message);
        } catch (err) {
            setError(err.error || 'Failed to change password');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Change Password</h1>
            {message && <p className="text-green-500 text-center mb-4">{message}</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="mb-4">
                <input
                    type="password"
                    name="current_password"
                    placeholder="Current Password"
                    value={formData.current_password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    name="new_password"
                    placeholder="New Password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300">
                Change Password
            </button>
        </form>
    );
};

export default ChangePassword;