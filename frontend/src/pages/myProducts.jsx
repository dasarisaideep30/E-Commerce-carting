import React, { useEffect, useState } from "react";
import Myproduct from "../components/auth/myProducts";
import Nav from "../components/auth/nav";
import axios from "../axiosConfig";
import { useSelector } from "react-redux";
import { Loader2, PackageOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userEmail = useSelector((state) => state.user.email);

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        axios.get(`/api/v2/product/my-products?email=${userEmail}`)
            .then((res) => {
                setProducts(res.data.products);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching my products:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [userEmail]);

    return (
        <div className="min-h-screen bg-neutral-900">
            <Nav />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">My inventory</h1>
                        <p className="text-neutral-400">Manage and track your published products</p>
                    </div>
                    <Link 
                      to="/create-product"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                      <Plus size={20} />
                      <span>Add New Product</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
                        <p className="text-neutral-400 animate-pulse">Loading your inventory...</p>
                    </div>
                ) : !userEmail ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-neutral-800/30 rounded-3xl border border-white/5">
                        <PackageOpen size={64} className="text-neutral-600 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
                        <p className="text-neutral-400 mb-8 max-w-sm text-center">You need to be logged in to view and manage your products.</p>
                        <Link to="/login" className="px-8 py-3 bg-white text-neutral-900 font-bold rounded-xl hover:bg-neutral-200 transition-colors">
                            Sign In Now
                        </Link>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-neutral-800/30 rounded-3xl border border-white/5 text-center">
                        <PackageOpen size={64} className="text-neutral-600 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">No products yet</h2>
                        <p className="text-neutral-400 mb-8 max-w-sm">Start your selling journey by creating your first product listing.</p>
                        <Link to="/create-product" className="px-8 py-3 border border-indigo-500/50 text-indigo-400 font-bold rounded-xl hover:bg-indigo-500/10 transition-colors">
                            Create First Listing
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Myproduct key={product._id} {...product} />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}