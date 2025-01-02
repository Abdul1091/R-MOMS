import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        department_id: '',
        role_id: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting registration with:', formData);
            const data = await registerUser(formData);
            console.log('Registration success:', data);
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleRegister}>
            <h1 className="text-3xl font-bold underline">Register</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="department_id"
                placeholder="Department ID"
                value={formData.department_id}
                onChange={handleChange}
            />
            <input
                type="number"
                name="role_id"
                placeholder="Role ID"
                value={formData.role_id}
                onChange={handleChange}
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;