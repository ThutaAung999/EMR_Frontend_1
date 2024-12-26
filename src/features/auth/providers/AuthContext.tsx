import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface Auth {
  token: string | null;
  isAuthenticated: boolean;
  userImage: string | null;
  name: string | null;
  role: string | null;
}

export interface AuthContextType {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize auth state from localStorage
  const [auth, setAuth] = useState<Auth>({
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    userImage: localStorage.getItem("userImage"),
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
  });

  useEffect(() => {
    // Persist auth state to localStorage
    const { token, userImage, name, role } = auth;

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    userImage
      ? localStorage.setItem("userImage", userImage)
      : localStorage.removeItem("userImage");

    name ? localStorage.setItem("name", name) : localStorage.removeItem("name");
    role ? localStorage.setItem("role", role) : localStorage.removeItem("role");
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
