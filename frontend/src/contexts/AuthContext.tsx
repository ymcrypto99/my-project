import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLog } from './LogContext';

// Define user interface
export interface User {
  id: string;
  email: string;
  name: string;
}
// At the top of your AuthProvider component
let logInfo = console.info;
let logError = console.error;
try {
  const logContext = useLog();
  logInfo = logContext.logInfo || logContext.info || console.info;
  logError = logContext.logError || logContext.error || console.error;
} catch (e) {
  console.warn("LogContext not available, using console fallbacks");
}

// Define auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Use try-catch for LogContext in case it's not initialized
  let logInfo = console.info;
  let logError = console.error;
  try {
    const logContext = useLog();
    logInfo = logContext.logInfo || logContext.info || console.info;
    logError = logContext.logError || logContext.error || console.error;
  } catch (e) {
    console.warn("LogContext not available, using console fallbacks");
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  console.log("API URL:", apiUrl ); // Debug log

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      let storedToken;
      
      try {
        storedToken = localStorage.getItem('token');
        console.log("Stored token found:", !!storedToken); // Debug log
      } catch (e) {
        console.error("LocalStorage access error:", e);
        setIsLoading(false);
        return;
      }
      
      if (storedToken) {
        try {
          setIsLoading(true);
          setToken(storedToken);
          
          // Fetch user profile
          console.log("Fetching profile from:", `${apiUrl}/api/auth/profile`); // Debug log
          const response = await fetch(`${apiUrl}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          
          if (!response.ok) {
            console.warn("Profile fetch failed:", response.status); // Debug log
            throw new Error('Failed to authenticate with stored token');
          }
          
          const userData = await response.json();
          console.log("User data received:", userData); // Debug log
          setUser(userData);
          setIsAuthenticated(true);
          setError(null);
          logInfo('User authenticated with stored token');
        } catch (err) {
          console.error("Auth error:", err); // Debug log
          logError(err instanceof Error ? err : new Error(String(err)), 'Authentication failed with stored token');
          try {
            localStorage.removeItem('token');
          } catch (e) {
            console.error("LocalStorage removal error:", e);
          }
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError('Authentication failed. Please log in again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No stored token found"); // Debug log
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [apiUrl]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting login to:", `${apiUrl}/api/auth/login`); // Debug log
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const { token, user } = await response.json();
      console.log("Login successful, user:", user); // Debug log
      
      try {
        localStorage.setItem('token', token);
      } catch (e) {
        console.error("LocalStorage write error:", e);
      }
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      logInfo('User logged in successfully', { userId: user.id });
    } catch (err) {
      console.error("Login error:", err); // Debug log
      logError(err instanceof Error ? err : new Error(String(err)), 'Login failed');
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
  try {
    setIsLoading(true);
    console.log("Starting registration process for:", email);
    
    // Try different API path formats
    let response = null;
    let errorMessage = '';
    
    // First try with /api prefix
    try {
      console.log("Attempting registration with /api prefix");
      response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });
      
      if (response.ok) {
        console.log("Registration successful with /api prefix");
      } else {
        errorMessage = `Failed with /api prefix: ${response.status}`;
        console.warn(errorMessage);
      }
    } catch (err) {
      console.error("First registration attempt failed:", err);
    }
    
    // If first attempt failed, try without /api prefix
    if (!response || !response.ok) {
      try {
        console.log("Attempting registration without /api prefix");
        response = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, name })
        });
        
        if (response.ok) {
          console.log("Registration successful without /api prefix");
        } else {
          errorMessage += ` Also failed without /api prefix: ${response.status}`;
          console.warn(errorMessage);
        }
      } catch (err) {
        console.error("Second registration attempt failed:", err);
        throw new Error(`Registration failed: ${errorMessage}`);
      }
    }
    
    if (!response || !response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }
      throw new Error((errorData as any).message || `Registration failed: ${errorMessage}`);
    }
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse success response:", e);
      throw new Error("Registration succeeded but response parsing failed");
    }
    
    const { token, user } = data;
    
    try {
      localStorage.setItem('token', token);
    } catch (e) {
      console.error("Failed to save token to localStorage:", e);
    }
    
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    setError(null);
    console.info('User registered successfully', { userId: user.id });
    
    // Use safe logging
    try {
      if (typeof logInfo === 'function') {
        logInfo('User registered successfully', { userId: user.id });
      }
    } catch (e) {
      console.warn("Failed to log registration success:", e);
    }
  } catch (err) {
    console.error("Registration error:", err);
    setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    
    // Use safe logging
    try {
      if (typeof logError === 'function') {
        logError(err instanceof Error ? err : new Error(String(err)), 'Registration failed');
      }
    } catch (e) {
      console.warn("Failed to log registration error:", e);
    }
    
    throw err;
  } finally {
    setIsLoading(false);
  }
};

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      if (token) {
        console.log("Attempting logout to:", `${apiUrl}/api/auth/logout`); // Debug log
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      logInfo('User logged out');
    } catch (err) {
      console.error("Logout error:", err); // Debug log
      logError(err instanceof Error ? err : new Error(String(err)), 'Logout error');
    } finally {
      try {
        localStorage.removeItem('token');
      } catch (e) {
        console.error("LocalStorage removal error:", e);
      }
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setIsLoading(false);
      console.log("Logout complete"); // Debug log
    }
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      setIsLoading(true);
      console.log("Updating profile at:", `${apiUrl}/api/auth/profile`); // Debug log
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const updatedUser = await response.json();
      console.log("Profile updated, new data:", updatedUser); // Debug log
      setUser(updatedUser);
      setError(null);
      logInfo('User profile updated', { userId: user?.id });
    } catch (err) {
      console.error("Profile update error:", err); // Debug log
      logError(err instanceof Error ? err : new Error(String(err)), 'Profile update failed');
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      console.log("Changing password at:", `${apiUrl}/api/auth/change-password`); // Debug log
      const response = await fetch(`${apiUrl}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
      
      console.log("Password changed successfully"); // Debug log
      setError(null);
      logInfo('User password changed', { userId: user?.id });
    } catch (err) {
      console.error("Password change error:", err); // Debug log
      logError(err instanceof Error ? err : new Error(String(err)), 'Password change failed');
      setError(err instanceof Error ? err.message : 'Failed to change password.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    isLoading,
    user,
    token,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  console.log("Auth state:", { isAuthenticated, isLoading }); // Debug log

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
