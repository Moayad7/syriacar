// src/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface IAuthProviderProps {
  children: ReactNode;
}
const userToken = localStorage.getItem("token");
const initialValues: AuthContextType = {
  isAuthenticated: userToken ? true : false,
  login: function (token: string): void {
    throw new Error('Function not implemented.');
  },
  logout: function (): void {
    throw new Error('Function not implemented.');
  }
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  // const isAuth:boolean = localStorage.getItem("isAuth");
  const [isAuthenticated, setIsAuthenticated] = useState(initialValues.isAuthenticated);
  const navigate = useNavigate();
 const userToken = localStorage.getItem("token");
  const checkAuth = useCallback(() => {
   
    if (userToken) {
      setIsAuthenticated(true);

      // use getMe api. (if ok => "storage user info in user state" else token not valid => "clear localStorage then go to login page.")
    }

  }, []);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (token) {
    //   setIsAuthenticated(true);

    // } else {
    //   setIsAuthenticated(false);
    // }
    checkAuth();
    console.log(isAuthenticated)
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    // localStorage.setItem("isAuth", true);
    setIsAuthenticated(true);
    navigate('/'); // Redirect to home or desired page after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    // localStorage.setItem("isAuth", false);
    setIsAuthenticated(false);
    navigate('/'); // Redirect to home or desired page after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
