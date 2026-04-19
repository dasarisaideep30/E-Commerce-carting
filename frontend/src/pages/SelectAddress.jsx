import React, { useState, useEffect } from 'react';
import Nav from '../components/auth/nav';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../axiosConfig';
import { MapPin, ArrowLeft, CheckCircle2, Loader2, Plus } from 'lucide-react';

const SelectAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userEmail = useSelector((state) => state.user.email);

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`/api/v2/user/addresses?email=${userEmail}`);
                setAddresses(response.data.addresses || []);
            } catch (err) {
                console.error('Error fetching addresses:', err);
                setError(err.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [userEmail]);

    const handleSelectAddress = (addressId) => {
        navigate('/order-confirmation', { state: { addressId } });
    };

    return (
        <div className='min-h-screen bg-neutral-900 pb-20'>
            <Nav />
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <div className='flex items-center justify-between mb-12'>
                    <div>
                        <h1 className='text-4xl font-bold text-white mb-2'>Select Address</h1>
                        <p className='text-neutral-400'>Where should we send your order?</p>
                    </div>
                    <Link to="/cart" className='text-neutral-400 hover:text-white flex items-center space-x-2 transition-colors'>
                        <ArrowLeft size={18} />
                        <span>Back to Cart</span>
                    </Link>
                </div>

                {loading ? (
                    <div className='flex flex-col items-center justify-center py-32'>
                        <Loader2 className='animate-spin text-indigo-500 mb-4' size={48} />
                        <p className='text-neutral-400'>Loading your addresses...</p>
                    </div>
                ) : !userEmail ? (
                    <div className='bg-neutral-800/30 rounded-3xl border border-white/5 p-16 text-center'>
                        <h2 className='text-2xl font-bold text-white mb-4'>Please Login</h2>
                        <Link to="/login" className='px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold'>Sign In</Link>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {addresses.map((address) => (
                                <div
                                    key={address._id}
                                    onClick={() => handleSelectAddress(address._id)}
                                    className='group bg-neutral-800/50 border border-white/5 p-6 rounded-3xl hover:bg-neutral-800 hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden'
                                >
                                    <div className='flex items-start justify-between mb-4'>
                                        <div className='p-2 bg-indigo-500/10 rounded-xl text-indigo-400'>
                                            <MapPin size={20} />
                                        </div>
                                        <span className='px-2 py-1 bg-white/5 text-neutral-500 text-[10px] uppercase font-bold tracking-wider rounded-md'>
                                            {address.addressType || 'Other'}
                                        </span>
                                    </div>
                                    <div className='space-y-1 mb-6'>
                                        <p className='text-white font-medium truncate'>{address.address1}</p>
                                        {address.address2 && <p className='text-neutral-400 text-sm truncate'>{address.address2}</p>}
                                        <p className='text-neutral-400 text-sm'>{address.city}, {address.zipCode}</p>
                                        <p className='text-neutral-500 text-xs mt-2'>{address.country}</p>
                                    </div>
                                    <button className='w-full py-3 bg-white/5 text-white font-bold rounded-xl group-hover:bg-indigo-600 transition-all flex items-center justify-center space-x-2'>
                                        <span>Ship Here</span>
                                        <CheckCircle2 size={18} className='opacity-0 group-hover:opacity-100 transition-opacity' />
                                    </button>
                                </div>
                            ))}
                            
                            <Link 
                                to="/create-address"
                                className='bg-neutral-800/30 border-2 border-dashed border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center text-neutral-500 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-neutral-800/50 transition-all'
                            >
                                <div className='w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4'>
                                    <Plus size={24} />
                                </div>
                                <span className='font-bold'>Add New Address</span>
                            </Link>
                        </div>
                    </div>
                )}

                {error && (
                    <div className='mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center'>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectAddress;