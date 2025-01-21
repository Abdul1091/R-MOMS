import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import MainLayout from './components/Shared/MainLayout'

const App = () => {
    return (
        <UserProvider>
            <Router>
                <MainLayout />
            </Router>
        </UserProvider>
    );
};

export default App;