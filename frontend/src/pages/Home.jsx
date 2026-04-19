import React, { useEffect, useState } from "react";
import Product from "../components/auth/Product";
import Nav from "../components/auth/nav";
import axios from "../axiosConfig";
import { Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/v2/product/get-products")
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900">
      <Nav />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles size={16} />
            <span>Discover the Future of Shopping</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Elevate Your Style with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Premium Collections
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-neutral-400 mb-10">
            Explore our curated selection of high-quality products designed for the modern individual. Quality meets aesthetic in every piece.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-white">Featured Products</h2>
          <div className="h-px flex-1 bg-white/5 mx-6" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
            <p className="text-neutral-400">Curating your experience...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 px-6 rounded-3xl bg-red-500/5 border border-red-500/10">
            <p className="text-red-400 mb-4 text-lg">Unable to load products</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Product key={product._id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}