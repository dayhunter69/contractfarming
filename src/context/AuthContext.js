import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });
  const navigate = useNavigate();

  const login = async (username, password) => {
    const payload = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8800/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Successful Login');
        console.log(data.user);

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('userRole', data.user.role.toString());

        setIsAuthenticated(true);

        toast.success('Successfully logged in', {
          style: { background: '#10B981', color: 'white' },
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);

        return true;
      } else {
        const error = await response.json();
        console.error('Error:', error);
        toast.error('Invalid username or password', {
          style: { background: '#EF4444', color: 'white' },
        });
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during login', {
        style: { background: '#EF4444', color: 'white' },
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
