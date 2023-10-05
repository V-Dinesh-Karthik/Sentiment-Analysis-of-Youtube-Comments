// AuthContext.tsx
import React, { createContext, useState, ReactNode } from "react";

// Define the type for authentication data
type AuthData = {
  user: {
    id: number;
    username: string;
    email: string;
    token: string;
  } | null;
  isAuthenticated: boolean;
};

// Define the type for the context
type AuthContextType = {
  auth: AuthData;
  setAuth: React.Dispatch<React.SetStateAction<AuthData>>;
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthData>({
    user: null,
    isAuthenticated: false,
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
