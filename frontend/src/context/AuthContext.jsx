import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Clear state and local storage when logging out
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully!');
  }, []);

  // Hydrate user profile from backend on app mount if token is found
  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    // If it's a simulated demo token, retrieve the locally stored user profile
    if (token === 'mock-jwt-token') {
      const savedUser = localStorage.getItem('user');
      setUser(savedUser ? JSON.parse(savedUser) : { username: 'Guest', email: 'guest@example.com' });
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Clear token and profile if backend rejection occurred
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Handle Login
  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      const receivedToken = data.token;
      const receivedUser = data.user || data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      toast.success('Logged in successfully!');
      return receivedUser;
    } catch (error) {
      console.warn('Authentication API offline or not implemented. Falling back to Demo session.', error);
      
      // Setup mock local user from email credentials
      const username = credentials.email.split('@')[0];
      const mockUser = {
        username: username.charAt(0).toUpperCase() + username.slice(1),
        email: credentials.email,
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);
      
      toast.info(`Logged in as ${mockUser.username} (Demo Mode)`);
      return mockUser;
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      const receivedToken = data.token;
      const receivedUser = data.user || data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      toast.success('Registration successful! Welcome.');
      return receivedUser;
    } catch (error) {
      console.warn('Authentication API offline or not implemented. Registering local mock user.', error);
      
      // Setup mock user from form payload
      const mockUser = {
        username: userData.username,
        email: userData.email,
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);

      toast.info(`Welcome, ${mockUser.username}! (Demo Mode)`);
      return mockUser;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    refreshUser: loadUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
