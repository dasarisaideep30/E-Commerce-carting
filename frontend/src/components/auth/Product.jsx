import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Product = ({ _id, name, images, description, price }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  const currentImage = images?.[currentIndex] || "";
  const imageUrl = currentImage ? `http://localhost:8000${currentImage}` : "https://via.placeholder.com/300";

  return (
    <div className="group bg-neutral-800/50 border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-neutral-800 hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <Link 
            to={`/product/${_id}`}
            className="p-3 bg-white text-neutral-900 rounded-full hover:bg-indigo-500 hover:text-white transition-colors"
          >
            <Eye size={20} />
          </Link>
          <button className="p-3 bg-white text-neutral-900 rounded-full hover:bg-indigo-500 hover:text-white transition-colors">
            <ShoppingCart size={20} />
          </button>
        </div>
        {images?.length > 1 && (
           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
             {images.map((_, i) => (
               <div 
                 key={i} 
                 className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? "bg-white w-3" : "bg-white/40"}`}
               />
             ))}
           </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-white truncate flex-1 min-w-0 pr-2">
            {name}
          </h2>
          <span className="text-indigo-400 font-bold">${price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-neutral-400 line-clamp-2 mb-4 h-10">
          {description}
        </p>
        <Link 
          to={`/product/${_id}`}
          className="block w-full text-center py-2.5 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors border border-white/5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

Product.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default Product;
