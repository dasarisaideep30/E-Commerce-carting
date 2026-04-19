import React, { useState, useEffect } from 'react';
import CartProduct from '../components/auth/CartProduct';
import Nav from '../components/auth/nav';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { ShoppingCart, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.user.email);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    axios.get(`/api/v2/product/cartproducts?email=${userEmail}`)
      .then((res) => {
        setProducts(res.data.cart.map(product => ({ 
          quantity: product['quantity'], 
          ...product['productId'] 
        })));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setLoading(false);
      });
  }, [userEmail]);

  const totalAmount = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleRemove = (productId) => {
    setProducts(prev => prev.filter(p => p._id !== productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setProducts(prev => prev.map(p => p._id === productId ? { ...p, quantity: newQuantity } : p));
  };

  const handlePlaceOrder = () => {
    navigate('/select-address');
  };

  return (
    <div className='min-h-screen bg-neutral-900'>
      <Nav />
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='flex items-center space-x-4 mb-12 text-white'>
          <div className='w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20'>
            <ShoppingCart size={24} />
          </div>
          <h1 className='text-4xl font-bold tracking-tight'>Your Shopping Cart</h1>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-32'>
            <Loader2 className='animate-spin text-indigo-500 mb-4' size={48} />
            <p className='text-neutral-400 animate-pulse'>Fetching your treasures...</p>
          </div>
        ) : !userEmail ? (
           <div className='bg-neutral-800/30 rounded-3xl border border-white/5 p-16 text-center max-w-2xl mx-auto'>
              <ShoppingBag size={64} className='text-neutral-600 mx-auto mb-6' />
              <h2 className='text-2xl font-bold text-white mb-2'>Sign in to see your cart</h2>
              <p className='text-neutral-400 mb-8'>Your items are waiting for you. Get back in to complete your purchase.</p>
              <Link to="/login" className='px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20'>
                Login to Account
              </Link>
           </div>
        ) : products.length === 0 ? (
          <div className='bg-neutral-800/30 rounded-3xl border border-white/5 p-16 text-center max-w-2xl mx-auto'>
            <ShoppingBag size={64} className='text-neutral-600 mx-auto mb-6' />
            <h2 className='text-2xl font-bold text-white mb-2'>Your cart is empty</h2>
            <p className='text-neutral-400 mb-8'>Looks like you haven't added anything yet. Discover our latest collections!</p>
            <Link to="/" className='px-10 py-4 border border-indigo-500/50 text-indigo-400 font-bold rounded-2xl hover:bg-indigo-500/10 transition-colors'>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
            <div className='lg:col-span-2 space-y-4'>
              {products.map(product => (
                <CartProduct 
                  key={product._id} 
                  {...product} 
                  onRemove={handleRemove} 
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>

            <div className='lg:col-span-1'>
              <div className='bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl sticky top-32 shadow-2xl'>
                <h2 className='text-xl font-bold text-white mb-6'>Order Summary</h2>
                <div className='space-y-4 mb-8'>
                  <div className='flex justify-between text-neutral-400'>
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-neutral-400'>
                    <span>Shipping</span>
                    <span className='text-emerald-400 font-medium'>Free</span>
                  </div>
                  <div className='h-px bg-white/5 my-2' />
                  <div className='flex justify-between text-white text-xl font-bold'>
                    <span>Total</span>
                    <span className='text-indigo-400'>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className='w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-indigo-600/20 active:scale-95 group'
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={20} className='group-hover:translate-x-1 transition-transform' />
                </button>
                
                <p className='text-center text-xs text-neutral-500 mt-6 mt-4'>
                  Taxes and shipping calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;