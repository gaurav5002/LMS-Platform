import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, BookOpen } from 'lucide-react';
import abcImage from '../assets/abc.webp';

const LearnHubLogo = () => (
  <div className="flex items-center gap-2 cursor-pointer select-none">
    <BookOpen className="w-7 h-7" style={{ color: "#A0C878" }} />
    <span className="text-2xl font-bold">
      <span style={{ color: "#A0C878" }}>Learn</span>
      <span style={{ color: "#2E4057" }}>Hub</span>
    </span>
  </div>
);



const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? 'Logging in:' : 'Signing up:', formData);
  };

  const handleGoogleAuth = () => {
    console.log('Google Sign In');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', role: 'student' });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white items-center justify-center px-4">
      {/* Header with logo and website name */}
      <header className="w-full max-w-5xl flex items-center p-4">
        <LearnHubLogo />
      </header>

      {/* Main content */}
      <div className="flex w-full max-w-5xl h-[90vh] rounded-xl shadow-lg overflow-hidden bg-white">
        {/* Left side waith image */}
        <div className="w-1/2 h-full hidden md:flex items-center justify-center bg-white-100">
          <img
            src={abcImage}
            alt="Login Visual"
            className="object-contain w-full h-full max-h-full"
          />
        </div>

        {/* Right side wala form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#A0C878' }}
            >
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-sm text-gray-600">
              {isLogin ? 'Login to your account' : 'Create your new account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300"
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Role selector for signup */}
            {!isLogin && (
              <div className="flex justify-between gap-4">
                {['student', 'teacher'].map((role) => (
                  <label key={role} className="w-1/2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`border-2 rounded-lg p-3 text-center ${
                        formData.role === role ? 'bg-green-50' : ''
                      }`}
                      style={{
                        borderColor: formData.role === role ? '#A0C878' : '#ccc',
                        backgroundColor:
                          formData.role === role ? '#A0C87820' : '#fff',
                      }}
                    >
                      {role === 'student' ? (
                        <GraduationCap className="mx-auto mb-1 text-gray-600" />
                      ) : (
                        <BookOpen className="mx-auto mb-1 text-gray-600" />
                      )}
                      <span className="text-sm font-medium capitalize">{role}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Forgot password */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm hover:underline"
                  style={{ color: '#A0C878' }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg text-lg font-semibold transition"
              style={{ backgroundColor: '#A0C878' }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            {/* Google Sign In */}
            {isLogin && (
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full border border-gray-300 py-3 mt-2 rounded-lg text-sm hover:bg-gray-100 flex items-center justify-center gap-2 bg-white"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </button>
            )}
          </form>

          {/* Toggle mode */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                className="font-medium hover:underline"
                onClick={toggleMode}
                style={{ color: '#A0C878' }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
