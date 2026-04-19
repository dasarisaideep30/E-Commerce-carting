import React, { useState, useEffect } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import axios from "../../axiosConfig";
import { useSelector } from "react-redux";

export default function CartProduct({ _id, name, images, quantity, price, onRemove, onQuantityChange }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantityVal, setQuantityVal] = useState(quantity);
    const [isRemoving, setIsRemoving] = useState(false);
    const userEmail = useSelector((state) => state.user.email);

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images]);

    const handleIncrement = () => {
        const newQuantity = quantityVal + 1;
        setQuantityVal(newQuantity);
        updateQuantityVal(newQuantity);
    };

    const handleDecrement = () => {
        if (quantityVal <= 1) return;
        const newQuantity = quantityVal - 1;
        setQuantityVal(newQuantity);
        updateQuantityVal(newQuantity);
    };

    const handleRemove = async () => {
        if (!userEmail) return;
        setIsRemoving(true);
        try {
            await axios.delete(`/api/v2/product/cartproduct/${userEmail}/${_id}`);
            onRemove(_id);
        } catch (err) {
            console.error('Error removing product:', err);
            setIsRemoving(false);
        }
    };

    const updateQuantityVal = async (newQuantity) => {
        if (!userEmail) return;
        try {
            await axios.put('/api/v2/product/cartproduct/quantity', {
                email: userEmail,
                productId: _id,
                quantity: newQuantity,
            });
            onQuantityChange(_id, newQuantity);
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    const currentImage = images?.[currentIndex] || "";

    return (
        <div className={`bg-neutral-800/50 border border-white/5 rounded-3xl p-4 flex items-center gap-6 group hover:bg-neutral-800 transition-all ${isRemoving ? 'opacity-50 scale-95' : ''}`}>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 flex-shrink-0">
                <img
                    src={`http://localhost:8000${currentImage}`}
                    alt={name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                />
            </div>
            
            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white truncate pr-4">{name}</h3>
                    <span className="text-indigo-400 font-bold">${(price * quantityVal).toFixed(2)}</span>
                </div>
                <p className="text-sm text-neutral-500 mb-4">${price.toFixed(2)} per unit</p>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 bg-neutral-900 rounded-xl p-1 border border-white/5">
                        <button 
                            onClick={handleDecrement}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
                            disabled={quantityVal <= 1}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="text-white font-medium w-6 text-center">{quantityVal}</span>
                        <button 
                            onClick={handleIncrement}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    
                    <button 
                      onClick={handleRemove}
                      disabled={isRemoving}
                      className="p-2 text-neutral-600 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

CartProduct.propTypes = {
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
    onQuantityChange: PropTypes.func.isRequired
};