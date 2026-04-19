import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from '../../axiosConfig';
import { Edit3, Trash2, Package, MoreVertical } from "lucide-react";

function Myproduct({ _id, name, images, description, price }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images]);

    const currentImage = images?.[currentIndex] || "";
    const imageUrl = currentImage ? `http://localhost:8000${currentImage}` : "https://via.placeholder.com/300";

    const handleEdit = () => {
        navigate(`/create-product/${_id}`);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        
        setIsDeleting(true);
        try {
            const response = await axios.delete(`/api/v2/product/delete-product/${_id}`);
            if (response.status === 200) {
                alert("Product deleted successfully!");
                window.location.reload();
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="group bg-neutral-800/50 border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:bg-neutral-800 hover:border-white/10 hover:shadow-2xl">
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                        onClick={handleEdit}
                        className="p-2.5 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2.5 bg-red-500/10 backdrop-blur-md text-red-500 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/10 disabled:opacity-50"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10 flex items-center space-x-1.5">
                        <Package size={12} />
                        <span>Inventory</span>
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white truncate max-w-[180px]">{name}</h2>
                    <span className="text-indigo-400 font-bold text-lg">${price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-neutral-400 line-clamp-2 h-10 mb-6 leading-relaxed">
                    {description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleEdit}
                      className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <Edit3 size={16} />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-red-500/5 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors border border-red-500/10"
                    >
                      <Trash2 size={16} />
                      <span>{isDeleting ? "..." : "Delete"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

Myproduct.propTypes = {
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
};

export default Myproduct;