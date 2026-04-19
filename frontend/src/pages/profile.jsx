import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../axiosConfig";
import AddressCard from "../components/auth/AddressCard";
import Nav from "../components/auth/nav";
import { User, Mail, Phone, MapPin, Plus, Loader2, LogOut, Camera } from "lucide-react";

export default function Profile() {
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    avatarUrl: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDetails, setTempDetails] = useState({});
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.user.email);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v2/user/profile?email=${userEmail}`);
        setPersonalDetails(response.data.user);
        setAddresses(response.data.addresses);
        setTempDetails(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.put("/api/v2/user/update-profile", {
        ...tempDetails,
        email: userEmail
      });
      setPersonalDetails(response.data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    navigate("/create-address");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading && !isEditing) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-12 rounded-[2.5rem] text-center shadow-2xl">
           <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-neutral-500">
              <User size={40} />
           </div>
           <h2 className="text-3xl font-bold text-white mb-4">Your profile is private</h2>
           <p className="text-neutral-400 mb-10 leading-relaxed">Sign in to view your orders, addresses, and personal collection.</p>
           <button 
              onClick={() => navigate("/login")}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
           >
              Login to E-Commerce
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 pb-20">
      <Nav />
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar / Brief Profile */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl text-center">
              <div className="relative inline-block mb-6">
                <img
                  src={
                    personalDetails?.avatarUrl
                      ? `http://localhost:8000/${personalDetails.avatarUrl}`
                      : `https://ui-avatars.com/api/?name=${personalDetails?.name || 'User'}&background=6366f1&color=fff&size=200`
                  }
                  alt="profile"
                  className="w-32 h-32 rounded-full border-4 border-indigo-500/20 mx-auto object-cover"
                />
              </div>
              
              {isEditing ? (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="text-xs text-neutral-500 font-medium">Full Name</label>
                    <input 
                      type="text" 
                      value={tempDetails.name} 
                      onChange={(e) => setTempDetails({...tempDetails, name: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 font-medium">Phone Number</label>
                    <input 
                      type="text" 
                      value={tempDetails.phoneNumber || ""} 
                      onChange={(e) => setTempDetails({...tempDetails, phoneNumber: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={handleUpdateProfile}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => { setIsEditing(false); setTempDetails(personalDetails); }}
                      className="flex-1 py-2 bg-white/5 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-1">{personalDetails?.name}</h2>
                  <p className="text-neutral-400 text-sm mb-6">{personalDetails?.email}</p>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 bg-white/5 text-white border border-white/10 rounded-xl mb-4 text-sm font-medium hover:bg-white/10 transition-all"
                  >
                    Edit Profile
                  </button>
                </>
              )}
              
              <button 
                onClick={handleLogout}
                className="w-full py-3 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors flex items-center justify-center space-x-2 text-sm font-medium mt-4"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-4">
              <h3 className="text-white font-bold mb-4">Account Information</h3>
              <div className="flex items-center space-x-3 text-neutral-400 text-sm">
                <Mail size={16} className="text-indigo-400" />
                <span className="truncate">{personalDetails?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-neutral-400 text-sm">
                <Phone size={16} className="text-indigo-400" />
                <span>{personalDetails?.phoneNumber || "No phone added"}</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <MapPin className="text-indigo-500" size={24} />
                    <span>Shipping Addresses</span>
                  </h2>
                  <p className="text-neutral-400 text-sm mt-1">Manage your delivery locations</p>
                </div>
                <button
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all text-sm font-medium"
                  onClick={handleAddAddress}
                >
                  <Plus size={18} />
                  <span>Add New</span>
                </button>
              </div>

              <div className="space-y-4">
                {addresses?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                    <MapPin size={40} className="text-neutral-700 mb-3" />
                    <p className="text-neutral-500 text-sm">No addresses found in your account.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses?.map((address, index) => (
                      <AddressCard key={index} {...address} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
