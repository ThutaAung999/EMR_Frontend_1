import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface AuthContextType {
  auth: {
    token: string | null;
    isAuthenticated: boolean;
     userImage: string | null;
  };
  setAuth: React.Dispatch<React.SetStateAction<{
    token: string | null;
    isAuthenticated: boolean;
    userImage: string | null;
  }>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    userImage: localStorage.getItem('userImage'),

  });

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('token', auth.token);
    } else {
      localStorage.removeItem('token');
    }

    if(auth.userImage){
      localStorage.setItem('userImage', auth.userImage);
    }else{
      localStorage.removeItem('userImage');
    }

  }, [auth.token, auth.userImage]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
