import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';

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
        <form onSubmit={handleRegister} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="mb-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="mb-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="mb-4">
                <input
                    type="number"
                    name="department_id"
                    placeholder="Department ID"
                    value={formData.department_id}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="mb-6">
                <input
                    type="number"
                    name="role_id"
                    placeholder="Role ID"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300">
                Register
            </button>
        </form>
    );
};

export default Register;