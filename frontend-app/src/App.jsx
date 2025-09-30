import React, { useState } from 'react';

// --- Utility Components & Mocks (LLM API constants removed as feature is deleted) ---

// Mock Icons (using inline SVGs)
const Mail = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const Lock = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
// Used for Profile Icon
const User = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
// New Home Icon
const Home = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

// Reusable Input Field Component
const AuthInput = ({ type, name, placeholder, icon: Icon, value, onChange, disabled = false }) => (
  <div className="relative mb-4">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm text-sm 
        ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300'}`}
    />
  </div>
);

// --- Form Components ---

const LoginForm = ({ switchToRegister, onLoginSuccess, setMessage }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null); // Clear message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      onLoginSuccess({ message: 'Successfully logged in.', type: 'success' });
    } catch (err) {
      setMessage(err.message || 'Login failed', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthInput
        type="email"
        name="email"
        placeholder="Email Address (e.g., test@user.com)"
        icon={Mail}
        value={formData.email}
        onChange={handleChange}
      />
      <AuthInput
        type="password"
        name="password"
        placeholder="Password (e.g., password123)"
        icon={Lock}
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit" className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg">
        Sign In
      </button>
      <div className="text-center pt-2 text-sm text-gray-600">
        Don't have an account? {' '}
        <span className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition" onClick={switchToRegister}>
          Register here
        </span>
      </div>
    </form>
  );
};


const RegisterForm = ({ switchToLogin, onRegisterSuccess, setMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null); // Clear message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Error: Passwords do not match.', 'error');
      return;
    }

    const username = (formData.name && formData.name.trim()) || (formData.email ? formData.email.split('@')[0] : 'user');

    try {
      const res = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      onRegisterSuccess({ message: 'Successfully signed up. Please sign in.', type: 'success' });
    } catch (err) {
      setMessage(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthInput
        type="text"
        name="name"
        placeholder="Full Name"
        icon={User}
        value={formData.name}
        onChange={handleChange}
      />
      <AuthInput
        type="email"
        name="email"
        placeholder="Email Address"
        icon={Mail}
        value={formData.email}
        onChange={handleChange}
      />
      
      {/* Password Inputs (Suggest button removed) */}
      <AuthInput
          type="password"
          name="password"
          placeholder="Password (min 8 characters)"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
      />
      
      <AuthInput
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        icon={Lock}
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      
      <button type="submit" className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-green-600 hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg">
        Create Account
      </button>
      <div className="text-center pt-2 text-sm text-gray-600">
        Already have an account? {' '}
        <span className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition" onClick={switchToLogin}>
          Sign in
        </span>
      </div>
    </form>
  );
};

// --- Main Application Component ---

const App = () => {
  // State to manage the current view ('login' or 'register')
  const [view, setView] = useState('login');
  // State to manage feedback messages (e.g., success/error)
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const handleSetMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    // Auto clear message after 5 seconds unless it's an error
    if (type !== 'error') {
        setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleLoginSuccess = ({ message, type }) => {
    handleSetMessage(message, type);
    // In a real application, you would handle token/session here and redirect
  };

  const handleRegisterSuccess = ({ message, type }) => {
    handleSetMessage(message, type);
    // After successful registration, switch to login view
    setView('login');
  };

  // Determine message bar style based on type
  const messageClasses = messageType === 'success'
    ? 'bg-green-100 border-green-400 text-green-700'
    : 'bg-red-100 border-red-400 text-red-700';

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 font-sans">

      {/* Ribbon Header: Full-width, slightly angled background for a ribbon effect */}
      <header className="w-full bg-white shadow-xl relative overflow-hidden mb-8 md:mb-12">
        {/* The 'ribbon' shape using a skew transform */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 transform -skew-y-1 origin-top-left z-0" style={{ height: 'calc(100% + 1rem)' }}></div>
        
        {/* Header Content */}
        <div className="relative z-10 max-w-7xl mx-auto flex justify-between items-center px-4 py-4 sm:px-6 lg:px-8 text-white">
            
            {/* Bragboard Title (Top Left) */}
            <h1 className="text-2xl font-extrabold tracking-wider cursor-pointer transition hover:scale-[1.02]">
                Bragboard
            </h1>
            
            {/* Navigation Icons (Top Right) */}
            <div className="flex space-x-4">
                <button title="Home" className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition duration-150 transform hover:scale-110">
                    <Home className="w-6 h-6" />
                </button>
                <button title="Profile" className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition duration-150 transform hover:scale-110">
                    <User className="w-6 h-6" />
                </button>
            </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center w-full p-4">
        <div className="w-full max-w-lg bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-100">
          
          {/* Header */}
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
            {view === 'login' ? 'Welcome Back!' : 'Join Us Today'}
          </h1>
          <p className="text-center text-gray-500 mb-8">
            {view === 'login' ? 'Sign in to access your account.' : 'Create your free account in seconds.'}
          </p>

          {/* Message Alert */}
          {message && (
            <div className={`p-4 mb-6 border-l-4 rounded-xl ${messageClasses} transition duration-300 ease-in-out`}>
              <p className="font-medium">{message}</p>
            </div>
          )}

          {/* Dynamic Form Rendering */}
          {view === 'login' ? (
            <LoginForm
              switchToRegister={() => { setView('register'); handleSetMessage(null); }}
              onLoginSuccess={handleLoginSuccess}
              setMessage={handleSetMessage}
            />
          ) : (
            <RegisterForm
              switchToLogin={() => { setView('login'); handleSetMessage(null); }}
              onRegisterSuccess={handleRegisterSuccess}
              setMessage={handleSetMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
