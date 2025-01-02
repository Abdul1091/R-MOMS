import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { resetPasswordRequest } from '../../api';

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
        <form onSubmit={handleSubmit}>
            <h1>Reset Password Request</h1>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Send Reset Instructions</button>
        </form>
    );
};

export default ResetPasswordRequest;