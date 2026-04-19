import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Upload, Loader2, Sparkles } from "lucide-react";
import axios from "../../axiosConfig";
import ValidationFormObject from "../../validation";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const validateFields = () => {
    const nameError = ValidationFormObject.validateName(name);
    const emailError = ValidationFormObject.validateEmail(email);
    const passwordError = ValidationFormObject.validatePass(password);

    const newErrors = {};
    if (nameError !== true) newErrors.name = nameError;
    if (emailError !== true) newErrors.email = emailError;
    if (passwordError !== true) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    setLoading(true);
    const newForm = new FormData();
    if (avatar) newForm.append("file", avatar);
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);

    try {
      const res = await axios.post("/api/v2/user/create-user", newForm, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setErrors({ server: "Failed to create account. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-xl shadow-indigo-600/20">
            <UserPlus className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-neutral-400 mt-2">Join E-Commerce and start your experience</p>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-neutral-900 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-neutral-900 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-neutral-900 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-neutral-400 mb-3">Profile Avatar</label>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={URL.createObjectURL(avatar)} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-neutral-500" size={24} />
                  )}
                </div>
                <label className="flex-1">
                  <div className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2 px-4 text-center text-sm text-white transition-all flex items-center justify-center space-x-2">
                    <Upload size={16} />
                    <span>{avatar ? "Change Photo" : "Upload Photo"}</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileSubmit} />
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2 mt-4 shadow-lg shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <div className="flex items-center space-x-2"><Sparkles size={20}/> <span>Create Account</span></div>}
            </button>
            
            {errors.server && <p className="text-red-400 text-sm text-center mt-2">{errors.server}</p>}
          </form>

          <p className="text-center text-neutral-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;