import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2342] via-[#0F3057] to-[#145DA0] flex items-center justify-center p-6">

      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl border border-neutral-200 px-10 py-12 relative">

        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
            Brandora.id
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Digital Marketing Hub</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* EMAIL */}
          <div>
            <label className="block text-neutral-700 font-medium text-sm mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full bg-neutral-50 border border-neutral-300 
                  text-neutral-800 pl-10 pr-4 py-3 rounded-xl 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all placeholder-neutral-400
                "
                placeholder="nama@example.com"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-neutral-700 font-medium text-sm mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full bg-neutral-50 border border-neutral-300 
                  text-neutral-800 pl-10 pr-12 py-3 rounded-xl 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all placeholder-neutral-400
                "
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-5 w-5 text-neutral-400 hover:text-neutral-700 transition"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
              shadow-lg hover:bg-blue-700 active:scale-[0.97]
              transition-all tracking-wide
            "
          >
            Masuk ke Dashboard
          </button>
        </form>

        <p className="text-center text-neutral-500 text-xs mt-8">
          Gunakan email & password untuk masuk
        </p>

      </div>

    </div>
  );
};

export default Login;
