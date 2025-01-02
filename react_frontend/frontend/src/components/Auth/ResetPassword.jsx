import React, { useState } from 'react';
import { resetPassword } from '../../api';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ token: '', new_password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await resetPassword(formData);
            setMessage(response.message);
        } catch (err) {
            setError(err.error || 'Failed to reset password');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Reset Password</h1>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                name="token"
                placeholder="Reset Token"
                value={formData.token}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="new_password"
                placeholder="New Password"
                value={formData.new_password}
                onChange={handleChange}
                required
            />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ResetPassword;