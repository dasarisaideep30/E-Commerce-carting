import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "../components/auth/nav";
import { MapPin, Globe, Landmark, Tag, Save, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreateAddress = () => {
    const navigate = useNavigate();
    const userEmail = useSelector((state) => state.user.email);
    
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [addressType, setAddressType] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userEmail) {
            alert("Please login first");
            return;
        }

        setLoading(true);
        const addressData = {
            country,
            city,
            address1,
            address2,
            zipCode,
            addressType,
            email: userEmail
        };

        try {
            await axios.post("/api/v2/user/add-address", addressData);
            alert("Address added successfully!");
            navigate("/profile");
        } catch (err) {
            console.error("Error adding address:", err);
            alert("Failed to add address. Please check the data and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 pb-20">
            <Nav />
            <div className="max-w-xl mx-auto px-4 mt-8 sm:mt-16">
                 <Link to="/profile" className="inline-flex items-center space-x-2 text-neutral-500 hover:text-white mb-8 transition-colors group text-sm font-medium">
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    <span>Back to Profile</span>
                </Link>

                <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                        <h5 className="text-2xl font-bold flex items-center space-x-3">
                            <MapPin size={28} />
                            <span>New Delivery Address</span>
                        </h5>
                        <p className="opacity-80 mt-2 text-sm">Tell us where to send your orders.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2 flex items-center space-x-2">
                                    <Globe size={14} className="text-indigo-400" />
                                    <span>Country *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    placeholder="e.g. USA"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2 flex items-center space-x-2">
                                    <Landmark size={14} className="text-indigo-400" />
                                    <span>City *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    placeholder="e.g. New York"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Street Address *</label>
                            <input
                                type="text"
                                required
                                value={address1}
                                onChange={(e) => setAddress1(e.target.value)}
                                className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm mb-3"
                                placeholder="House number, street name"
                            />
                            <input
                                type="text"
                                value={address2}
                                onChange={(e) => setAddress2(e.target.value)}
                                className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                placeholder="Apartment, suite, unit (optional)"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2 text-sm">Zip/Postal Code *</label>
                                <input
                                    type="number"
                                    required
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    placeholder="00000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2 text-sm flex items-center space-x-2">
                                    <Tag size={14} className="text-indigo-400" />
                                    <span>Label *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={addressType}
                                    onChange={(e) => setAddressType(e.target.value)}
                                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    placeholder="e.g. Home, Work"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : (
                                <>
                                    <Save size={18} />
                                    <span>Save Address</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAddress;
