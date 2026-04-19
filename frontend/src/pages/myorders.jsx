import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import Nav from '../components/auth/nav';
import { useSelector } from 'react-redux';
import { Package, Truck, XCircle, ShoppingBag, Clock, Loader2 } from 'lucide-react';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userEmail = useSelector((state) => state.user.email);

    const fetchOrders = async () => {
        if (!userEmail) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/v2/orders/myorders', {
                params: { email: userEmail },
            });
            setOrders(response.data.orders);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await axios.patch(`/api/v2/orders/cancel-order/${orderId}`);
            alert("Order cancelled successfully");
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error cancelling order');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [userEmail]);

    if (loading) return (
        <div className='min-h-screen bg-neutral-900 flex flex-col items-center justify-center'>
            <Loader2 className='animate-spin text-indigo-500 mb-4' size={48} />
            <p className='text-neutral-400'>Loading your order history...</p>
        </div>
    );

    return (
        <div className='min-h-screen bg-neutral-900 pb-20'>
            <Nav />
            <div className='max-w-5xl mx-auto px-4 py-12'>
                <div className='flex items-center justify-between mb-12'>
                    <div>
                        <h1 className='text-4xl font-bold text-white mb-2'>My Orders</h1>
                        <p className='text-neutral-400'>Track and manage your recent purchases</p>
                    </div>
                </div>

                {orders.length > 0 ? (
                    <div className='space-y-6'>
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className='bg-neutral-800/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:border-white/10 transition-all group'
                            >
                                <div className='p-6 border-b border-white/5 bg-white/5 flex flex-wrap items-center justify-between gap-4'>
                                    <div className='flex items-center space-x-4'>
                                        <div className='p-3 bg-indigo-500/10 rounded-2xl text-indigo-400'>
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <p className='text-xs text-neutral-500 uppercase font-bold tracking-widest'>Order Reference</p>
                                            <p className='text-white font-medium'>#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-xs text-neutral-500 uppercase font-bold tracking-widest'>Amount Paid</p>
                                        <p className='text-2xl font-bold text-white'>${order.totalAmount}</p>
                                    </div>
                                </div>

                                <div className='p-8 grid grid-cols-1 lg:grid-cols-2 gap-12'>
                                    <div>
                                        <div className='flex items-center space-x-2 text-white font-bold mb-4'>
                                            <Truck size={18} className='text-indigo-400' />
                                            <span>Delivery Details</span>
                                        </div>
                                        <div className='bg-neutral-900/50 p-6 rounded-2xl border border-white/5 space-y-1'>
                                            <p className='text-white'>{order.shippingAddress.address}</p>
                                            {order.shippingAddress.address2 && <p className='text-neutral-400'>{order.shippingAddress.address2}</p>}
                                            <p className='text-neutral-400'>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                                            <p className='text-neutral-500 text-sm mt-2'>{order.shippingAddress.country}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='flex items-center space-x-2 text-white font-bold mb-4'>
                                            <ShoppingBag size={18} className='text-indigo-400' />
                                            <span>Purchased Items</span>
                                        </div>
                                        <div className='space-y-3'>
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} className='flex items-center justify-between p-4 bg-neutral-900/30 rounded-xl border border-white/5'>
                                                    <div className='flex items-center space-x-3'>
                                                        <div className='w-10 h-10 bg-neutral-800 rounded-lg overflow-hidden'>
                                                            <img src={`http://localhost:8000${item.image}`} alt={item.name} className='w-full h-full object-cover' />
                                                        </div>
                                                        <span className='text-white text-sm font-medium'>{item.name}</span>
                                                    </div>
                                                    <span className='text-neutral-400 text-sm'>x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className='p-6 bg-white/5 border-t border-white/5 flex items-center justify-between'>
                                    <div className='flex items-center space-x-2'>
                                        <Clock size={16} className='text-neutral-500' />
                                        <span className={`text-sm font-bold uppercase tracking-wider ${order.status === 'Cancelled' ? 'text-red-400' : 'text-green-400'}`}>
                                            {order.status || 'Processing'}
                                        </span>
                                    </div>
                                    {order.status !== 'Cancelled' && (
                                        <button
                                            onClick={() => cancelOrder(order._id)}
                                            className='px-6 py-2 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition-all text-sm font-medium flex items-center space-x-2'
                                        >
                                            <XCircle size={16} />
                                            <span>Cancel Order</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-32 bg-neutral-800/30 rounded-[3rem] border border-white/5'>
                        <ShoppingBag size={64} className='text-neutral-700 mb-6' />
                        <h2 className='text-2xl font-bold text-white mb-2'>No orders yet</h2>
                        <p className='text-neutral-500 mb-8'>Your future treasures are waiting in the shop.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;