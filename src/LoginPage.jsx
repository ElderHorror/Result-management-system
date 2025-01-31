import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student'); // Default role is student

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password, matricNumber, role });
    if (!role) {
      alert('Please select a role (Admin or Student)');
      return;
    }
    console.log(`Logging in as ${role}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">Login</h2>

        {/* Role Selection Slider */}
        <div 
          className="relative flex items-center w-full mt-6 mb-4  p-2"
          onMouseMove={(e) => {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const posX = e.clientX - left;
            setRole(posX < width / 2 ? 'admin' : 'student');
          }}
        >
          <div className={`w-1/2 py-2 text-center font-medium transition-colors ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
            Admin
          </div>
          <div className={`w-1/2 py-2 text-center font-medium transition-colors ${role === 'student' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
            Student
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-4">
          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-600">Email:</label>
            <input
              type="email"
              id="email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Matric Number Input for Students */}
          {role === 'student' && (
            <div className="flex flex-col">
              <label htmlFor="matric" className="text-sm font-medium text-gray-600">Matric Number:</label>
              <input
                type="text"
                id="matric"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                required={role === 'student'}
              />
            </div>
          )}

          {/* Password Input */}
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-600">Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-7 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </p>

        {/* Register Link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}