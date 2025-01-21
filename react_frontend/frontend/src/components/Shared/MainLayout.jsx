import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HomePage from '../HomePage/HomePage';
import UserProfile from '../UserProfile/UserProfile';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import ResetPassword from '../Auth/ResetPassword';
import ResetPasswordRequest from '../Auth/ResetPasswordRequest';
import ProcurementDashboard from '../Procurement/ProcurementDashboard';
import WeighbridgeDashboard from '../Weighbridge/WeighbridgeDashboard';
import QualityControlDashboard from '../Quality/QualityControlDashboard';
import WarehouseDashboard from '../Warehouse/WarehouseDashboard';
import FinanceDashboard from '../Finance/FinanceDashboard';
import PaymentDetail from '../Finance/PaymentDetail';
import PaymentList from '../Finance/PaymentList';
import AppLayout from '../../AppLayout';

const MainLayout = () => {
    const noNavbarPaths = ['/login', '/reset-password', '/reset-password-request', '/register'];
    const location = useLocation();

    return (
        <>
            {!noNavbarPaths.includes(location.pathname) && <Navbar />}
            <AppLayout />
            <div className="min-h-screen">
                <Routes>
                    <Route path="/*" element={<HomePage />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
                    <Route path="/proc-dashboard/*" element={<ProcurementDashboard />} />
                    <Route path="/weighbridge/*" element={<WeighbridgeDashboard />} />
                    <Route path="/quality/dashboard" element={<QualityControlDashboard />} />
                    <Route path="/warehouse/*" element={<WarehouseDashboard />} />
                    <Route path="/finance/*" element={<FinanceDashboard />} />
                    <Route path="/payment/:id" element={<PaymentDetail />} />
                    <Route path="/payments" element={<PaymentList />} />
                </Routes>
            </div>
            <AppLayout />
            {!noNavbarPaths.includes(location.pathname) && <Footer />}
        </>
    );
};

export default MainLayout;