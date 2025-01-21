import React, { createContext, useContext, useState } from 'react';

// Create a User Context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: 'John Doe',
    profilePicture: '/path/to/profile.jpg' // Replace with actual user data
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user data
export const useUser = () => useContext(UserContext);