import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { Loader2, AlertCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import Nav from '../components/auth/nav';
import { Link } from "react-router-dom";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const userEmail = useSelector((state) => state.user.email);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/v2/product/product/${id}`);
                setProduct(response.data.product);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const addtocart = async () => {
        if (!userEmail) {
            alert("Please login to add items to cart");
            return;
        }
        try {
            const response = await axios.post("/api/v2/product/cart", {
                userId: userEmail,
                productId: id,
                quantity: quantity,
            });
            alert("Added to cart successfully!");
            console.log("Added to cart:", response.data);
        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Failed to add to cart");
        }
    };

    if (loading)
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-neutral-900">
                <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
                <p className="text-neutral-400 animate-pulse">Loading product magic...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-neutral-900 text-red-400 p-6 text-center">
                <AlertCircle size={64} className="mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                <p className="text-neutral-400 mb-6">{error.message}</p>
                <Link to="/" className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                    Back to Home
                </Link>
            </div>
        );

    if (!product) return null;

    return (
        <div className="min-h-screen bg-neutral-900 pb-20">
            <Nav />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <Link to="/" className="inline-flex items-center space-x-2 text-neutral-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                    <span>Back to products</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-3xl overflow-hidden bg-neutral-800 border border-white/5">
                            {product.images?.length ? (
                                <img
                                    src={`http://localhost:8000${product.images[0]}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                    No Image Available
                                </div>
                            )}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-neutral-800 border border-white/5 cursor-pointer hover:border-indigo-500 transition-colors">
                                        <img src={`http://localhost:8000${img}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="lg:sticky lg:top-32">
                        <div className="inline-block px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
                            {product.category}
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-center space-x-6 mb-10">
                            <div className="text-4xl font-bold text-white">
                                ${product.price}
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="flex items-center space-x-4 bg-neutral-800 border border-white/5 rounded-2xl p-2">
                                <button onClick={handleDecrement} className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                    <IoIosRemove size={24} />
                                </button>
                                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                                <button onClick={handleIncrement} className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                    <IoIosAdd size={24} />
                                </button>
                            </div>
                        </div>

                        {product.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-10">
                                {product.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <button 
                            className="w-full lg:w-auto px-12 py-5 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-indigo-600/20 active:scale-95"
                            onClick={addtocart}
                        >
                            <ShoppingCart size={24} />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;