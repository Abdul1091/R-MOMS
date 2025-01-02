import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChangePassword from './components/Auth/ChangePassword';
import ResetPassword from './components/Auth/ResetPassword';
import ResetPasswordRequest from './components/Auth/ResetPasswordRequest';
// import Dashboard from './components/Dashboard/Dashboard';
// import HumanResources from './components/Dashboard/HumanResources';
// import Finance from './components/Dashboard/Finance';
// Add other necessary imports

const App = () => {
    return (
        
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/reset-password" element={ <ResetPassword />} />
                <Route path="/reset-password-request" element={ <ResetPasswordRequest />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* <Route path="/dashboard/hr" element={<HumanResources />} /> */}
                {/* <Route path="/dashboard/finance" element={<Finance />} /> */}
                {/* Add routes for other dashboard components */}
            </Routes>
        </Router>
    );
};

export default App;