import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";
import api from "../services/api";

// defines AuthContext TYPES
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// defines AuthContextProviderProps TYPES
interface AuthContextProviderProps {
  children: ReactNode;
}

// creates auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// creates a user context provider
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/users/login', {
        email,
        password
      });
    
      const data = response.data;
    
      const userData: User = {
        _id: data.data._id,
        username: data.data.username,
        email: data.data.email,
        avatar: data.data.avatar,
        createdAt: data.data.createdAt
      };
    
      // user saved in state
      setUser(userData);
    
      // saves user in local storage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.data.token);

    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (username:string, email:string, password:string) => {
    try {
      const response = await api.post('/users/register', {
        username,
        email,
        password,
      });

      const data = response.data;

      const userData: User = {
        _id: data.data._id,
        username: data.data.username,
        email: data.data.email,
        avatar: data.data.avatar,
        createdAt: data.data.createdAt,
      }

      setUser(userData);

      // saves user to local storage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.data.token);

    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registeration Failed');
    }
  };

  const logout = () => {
    // clears local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // clears user state
    setUser(null);
  }


  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    logout,
  };

  return ( 
    <AuthContext.Provider value={contextValue}> 
      { children }
    </AuthContext.Provider>
  );
  
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
