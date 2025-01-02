import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../api';

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
        <form onSubmit={handleSubmit}>
            <h1>Change Password</h1>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="password"
                name="current_password"
                placeholder="Current Password"
                value={formData.current_password}
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
            <button type="submit">Change Password</button>
        </form>
    );
};

export default ChangePassword;