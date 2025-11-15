import React, { useState } from 'react';
import loginImg from '/Art.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLoginAsync } from '../../Redux/Slice/authSlice';
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const resultAction = await dispatch(adminLoginAsync({ email, password }));
      if (adminLoginAsync.fulfilled.match(resultAction)) {
        localStorage.setItem("isLoggedIn", "true");
        navigate('/dashboard');
      } else {
        setFormError(resultAction.payload?.message || "Invalid email or Password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormError('Invalid email or Password');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left Image */}
      <div className="w-full   h-64 md:h-auto">
        <img
          src={loginImg}
          alt="login"
          className="w-full h-full object-cover rounded-b-3xl md:rounded-none md:rounded-l-3xl"
        />
      </div>

      {/* Right Form */}
      <div className="w-full flex flex-col justify-center items-center px-6 md:px-20 ">
        <h2 className="text-3xl font-semibold mb-2 text-center text-black">Welcome!</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Today is a new day. It's your day. You shape it.<br />
          Sign in to start managing your projects.
        </p>

        <form onSubmit={handleSubmit} className="w-full  max-w-sm space-y-4">
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {formError}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Example@email.com"
              className="mt-1 block w-full rounded-md border text-gray-700 border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password with Eye Button */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="mt-1 block w-full rounded-md text-gray-700 border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Sign in Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md flex justify-center"
          >
            Sign in
          </button>
        </form>

        <footer className="mt-10 text-xs text-gray-400 text-center">
          © 2025 ALL RIGHTS RESERVED
        </footer>
      </div>
    </div>
  );
};

export default Login;
