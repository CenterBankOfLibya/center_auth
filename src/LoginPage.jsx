import React, { useState } from 'react';
import fetchData from './Api/FetchApi';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        emp_number: username,
        password: password,
        guard_name: 'user_management',
      };
      const data = await fetchData('auth/login', 'POST', JSON.stringify(body));
      // Store token and user info in localStorage
      if (data && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.data));
        
        setLoginSuccess(true);
        setTimeout(() => {
             window.location.href = '/#dashboard';
        }, 2000);
      }

    } catch (error) {
      // Error toast handled in fetchData
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <span className="text-3xl font-bold text-blue-600">CAS Portal</span>
          </div>

          <div className="mb-8 relative">
             <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Authenticating</h2>
          <p className="text-gray-500 mb-8">Loading accessible systems...</p>

          <div className="w-64 h-1.5 bg-blue-100 rounded-full overflow-hidden mx-auto mb-2">
            <div className="h-full bg-blue-600 animate-progress"></div>
          </div>
          <p className="text-xs text-gray-400">Please wait...</p>
        </div>
        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
               {/* Shield Icon */}
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
               </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">CAS Portal</h2>
            <p className="mt-1 text-sm text-gray-500">Central Authentication System</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Demo: juan.perez or juana.smith</p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Demo password: password123</p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Signing in...' : (
                    <>
                    Sign In
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                    </>
                )}
              </button>
            </div>
             {
                error && (
                    <div className="text-red-600 text-sm mt-2 text-center">
                    {error}
                    </div>
                )
            }
          </form>

          {/* Demo Credentials Box */}
          <div className="mt-8 pt-6 border-t border-gray-200">
             <p className="text-xs text-center text-gray-500 mb-4">This is a  portal. Use the credentials you have:</p>
         
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
