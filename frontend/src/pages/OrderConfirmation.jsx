import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import Nav from "../components/auth/nav";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MapPin, ShoppingBag, CreditCard, CheckCircle, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userEmailFromRedux = useSelector((state) => state.user.email);
    const { addressId } = location.state || {};
    const email = location.state?.email || userEmailFromRedux;

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    useEffect(() => {
        if (!addressId || !email) {
            navigate("/select-address");
            return;
        }

        const fetchData = async () => {
            try {
                const [addressResponse, cartResponse] = await Promise.all([
                    axios.get(`/api/v2/user/addresses?email=${email}`),
                    axios.get(`/api/v2/product/cartproducts?email=${email}`),
                ]);

                const address = addressResponse.data.addresses.find(
                    (addr) => addr._id === addressId
                );
                setSelectedAddress(address || {});

                const processedCartItems = cartResponse.data.cart.map((item) => ({
                    _id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                    images: item.productId.images,
                    quantity: item.quantity,
                }));

                setCartItems(processedCartItems);

                const total = processedCartItems.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
                setTotalPrice(total);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [addressId, email, navigate]);

    const handlePlaceOrder = async (paymentType = "cod", paypalOrderData = null) => {
        try {
            const orderItems = cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.images?.[0] || "",
            }));

            const payload = {
                email,
                shippingAddress: selectedAddress,
                orderItems,
                paymentMethod: paymentType,
                paypalOrderData,
            };

            const response = await axios.post("/api/v2/orders/place-order", payload);
            setOrderDetails(response.data.orders);
        } catch (error) {
            console.error("Error placing order:", error);
            setError("Failed to place order. Try again.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
            <p className="text-neutral-400">Preparing your order summary...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-900 pb-20">
            <Nav />
            <div className="max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-12 flex items-center space-x-4">
                    <CheckCircle className="text-indigo-500" size={40} />
                    <span>Review & Confirm</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping */}
                        <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                                <MapPin className="text-indigo-500" size={24} />
                                <span>Shipping Destination</span>
                            </h3>
                            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5">
                                <p className="text-white text-lg font-medium">{selectedAddress?.address1}</p>
                                {selectedAddress?.address2 && <p className="text-neutral-400">{selectedAddress.address2}</p>}
                                <p className="text-neutral-400 mt-1">{selectedAddress?.city}, {selectedAddress?.zipCode}</p>
                                <p className="text-neutral-500 text-sm mt-3 uppercase tracking-wider font-bold">{selectedAddress?.country}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                                <ShoppingBag className="text-indigo-500" size={24} />
                                <span>Order Items</span>
                            </h3>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex items-center space-x-4 p-4 bg-neutral-900/50 rounded-2xl border border-white/5">
                                        <div className="w-20 h-20 bg-neutral-800 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={`http://localhost:8000${item.images?.[0]}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium">{item.name}</h4>
                                            <p className="text-neutral-400 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-neutral-500 text-xs">${item.price} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                                <CreditCard className="text-indigo-500" size={24} />
                                <span>Payment Strategy</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setPaymentMethod("cod")}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3 ${paymentMethod === 'cod' ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-neutral-400 hover:border-white/10'}`}
                                >
                                    <ShoppingBag size={32} />
                                    <span className="font-bold">Cash on Delivery</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod("paypal")}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3 ${paymentMethod === 'paypal' ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-neutral-400 hover:border-white/10'}`}
                                >
                                    <CreditCard size={32} />
                                    <span className="font-bold">PayPal / Online</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl sticky top-32">
                            <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Order Summary</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-neutral-400">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between">
                                    <span className="text-white font-bold text-lg">Grand Total</span>
                                    <span className="text-indigo-400 font-bold text-xl">${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {paymentMethod === "cod" ? (
                                <button
                                    onClick={() => handlePlaceOrder("cod")}
                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center space-x-2"
                                >
                                    <CheckCircle2 size={24} />
                                    <span>Place Order Now</span>
                                </button>
                            ) : (
                                <PayPalScriptProvider options={{ "client-id": "AYMI_d7yjDOJz1X7myS5Rfm-ynuBdZHtPhtOxfpPTWH2ggh4VneSrGWKF3YQzn43azyq6RzwGChtf5MI" }}>
                                    <PayPalButtons
                                        style={{ layout: "vertical", shape: "pill" }}
                                        createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: totalPrice.toFixed(2) } }] })}
                                        onApprove={async (data, actions) => {
                                            const order = await actions.order.capture();
                                            handlePlaceOrder("paypal", order);
                                        }}
                                    />
                                </PayPalScriptProvider>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Modals / Errors */}
                {orderDetails && (
                    <div className="fixed inset-0 bg-neutral-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-neutral-800 border border-white/10 p-12 rounded-[2rem] max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500" />
                             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 animate-bounce">
                                <CheckCircle size={48} />
                             </div>
                             <h2 className="text-3xl font-bold text-white mb-4">Success!</h2>
                             <p className="text-neutral-400 mb-10 leading-relaxed">Your order has been placed and is now being processed by our master craftsmen.</p>
                             <button
                                onClick={() => navigate("/myorders")}
                                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-neutral-200 transition-all"
                             >
                                View My Orders
                             </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-center space-x-3">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderConfirmation;