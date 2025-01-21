import React, { useState } from 'react';
import { resetPasswordRequest } from '../../api/auth';

const ResetPasswordRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await resetPasswordRequest(email);
            setMessage(response.message);
        } catch (err) {
            setError(err.error || 'Failed to send reset instructions');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Reset Password Request</h1>
            {message && <p className="text-green-500 text-center mb-4">{message}</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="mb-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300">
                Send Reset Instructions
            </button>
        </form>
    );
};

export default ResetPasswordRequest;