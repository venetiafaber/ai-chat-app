import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import api from '../services/api';

// defines AuthContext type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// creates the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// creates the provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // when app starts check if use is logged in
  useEffect(() => {
    const loadUser = () => {
      // checks localStorage for saved user
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');

      if(savedUser && savedToken) {
        try {
          // user was logged in before, why setUser again? would User have the value? is this for when the page is refershed?
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.log('Failed to parse saved user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }

      // done loading
      setIsLoading(false);
    };

    loadUser();
  }, []);


  // creates login function
  const login = async (email: string, password: string) => {
    try {
      // calls the backend API
      const { data } = await api.post('/users/login', {
        email,
        password
      });

      // saves user and token
      const userData: User = {
        _id: data.data._id,
        username: data.data.username,
        email: data.data.email,
        avatar: data.data.avatar,
        createdAt: data.data.createdAt || new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.data.token);

      // updates state
      setUser(userData);
      
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  // register function
  const register = async (username: string, email: string, password: string) => {
    try {
      const { data } = await api.post('/users/register', {
        username,
        email,
        password
      });

      // stores user data
      const userData: User = {
        _id: data.data._id,
        username: data.data.username,
        email: data.data.email,
        avatar: data.data.avatar,
        createdAt: data.data.createdAt || new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.data.token);

      setUser(userData);

    } catch (error: any) {
      throw new Error(error.message || 'Registeration failed');
    }
  };

  // logout function
  const logout = () => {
    // clears localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // clears state
    setUser(null);
  };

  // creates the value object
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return(
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};


// cretes custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if(context === undefined) {
    throw new Error('useAuth must be used withing an AuthProvider');
  }

  return context;
};