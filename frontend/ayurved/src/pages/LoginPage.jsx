// src/pages/LoginPage.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Doctor Login Data:", formData);
    navigate("/dashboard");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md backdrop-blur-md border border-green-200"
      >
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-green-700 mb-4"
        >
          Ayurvedic Diet Advisor
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-500 mb-8"
        >
          Doctor Login Portal
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="doctor@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 shadow-sm hover:shadow-md transition"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 shadow-sm hover:shadow-md transition"
            />
          </motion.div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#16a34a" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Login
          </motion.button>
        </form>

        {/* Optional Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-center text-gray-400 text-sm"
        >
          Forgot password? <span className="text-green-600 hover:underline cursor-pointer">Reset</span>
        </motion.div>
      </motion.div>

      {/* Tailwind custom animation */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: scale(1) translate(0,0); }
            33% { transform: scale(1.2) translate(20px, -10px); }
            66% { transform: scale(0.9) translate(-15px, 20px); }
          }
          .animate-blob {
            animation: blob 8s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}
      </style>
    </div>
  );
}
