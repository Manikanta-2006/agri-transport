import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BuyerDashboard = () => {
    const userName = localStorage.getItem('userName') || 'Buyer';
    const [produce, setProduce] = useState([]);
    const [myOrders, setMyOrders] = useState([]);

    // Cart State
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Details, 3: Payment

    // Checkout Form State
    const [checkoutData, setCheckoutData] = useState({
        phone: '',
        email: '',
        pincode: '',
        city: '',
        address: ''
    });

    const fetchProduce = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5001/api/listings/available', config);
            setProduce(res.data);
        } catch (err) {
            console.error('Error fetching produce:', err);
        }
    };

    const fetchMyOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5001/api/listings/my-orders', config);
            setMyOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    useEffect(() => {
        fetchProduce();
        fetchMyOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Pincode Lookup Logic
    useEffect(() => {
        if (checkoutData.pincode.length === 6) {
            const fetchCity = async () => {
                try {
                    const res = await axios.get(`https://api.postalpincode.in/pincode/${checkoutData.pincode}`);
                    if (res.data && res.data[0].Status === 'Success') {
                        const city = res.data[0].PostOffice[0].District; // Using District as City
                        setCheckoutData(prev => ({ ...prev, city }));
                    }
                } catch (err) {
                    console.error('Error fetching city:', err);
                }
            };
            fetchCity();
        }
    }, [checkoutData.pincode]);

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem._id === (item._id || item.id));
        if (existingItem) {
            alert('Item already in cart!');
            return;
        }
        // Initialize with quantity 1 (or prompt user? For now default to 1 unit if logic allows, but here we deal with bulk. 
        // Let's assume user buys whole lot or we add a quantity selector in cart. 
        // Simplification: User adds item, defines qty in cart.)
        // Actually, let's just add it with empty quantity and let user edit in cart or default to max?
        // Let's set default optional quantity to 1 if meaningful, else max?
        // Let's set it to empty string like before.
        setCart([...cart, { ...item, purchaseQty: '' }]);
        setIsCartOpen(true);
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => (item._id || item.id) !== itemId));
    };

    const updateCartQty = (itemId, qty) => {
        setCart(cart.map(item => {
            if ((item._id || item.id) === itemId) {
                return { ...item, purchaseQty: qty };
            }
            return item;
        }));
    };

    const handleCheckoutInput = (e) => {
        setCheckoutData({ ...checkoutData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((acc, item) => {
            const qty = parseFloat(item.purchaseQty) || 0;
            const price = parseFloat(item.price) || 0;
            return acc + (qty * price);
        }, 0);
        return subtotal + 48;
    };

    const submitOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            };

            const itemsToBuy = cart.map(item => ({
                _id: item._id || item.id,
                quantity: item.purchaseQty
            }));

            // Basic Validation
            if (itemsToBuy.some(i => !i.quantity || parseFloat(i.quantity) <= 0)) {
                alert('Please enter valid quantities for all items.');
                return;
            }

            const body = JSON.stringify({ items: itemsToBuy, deliveryDetails: checkoutData });
            const res = await axios.post('http://localhost:5001/api/listings/purchase-cart', body, config);

            if (res.data.success) {
                alert('Order Placed Successfully! Payment Verified.');
                setCart([]);
                setCheckoutStep(1);
                setIsCartOpen(false);
                setCheckoutData({ phone: '', email: '', pincode: '', city: '', address: '' });
                fetchProduce();
                fetchMyOrders();
            } else {
                alert('Something went wrong with the order.');
            }

        } catch (err) {
            console.error(err.response?.data);
            alert('Error processing order: ' + (err.response?.data?.msg || err.message));
        }
    };

    const confirmReceipt = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`http://localhost:5001/api/listings/confirm/${id}`, {}, config);
            alert('Order Confirmed!');
            fetchMyOrders();
        } catch (err) {
            console.error(err);
            alert('Error confirm receipt');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            {/* Header */}
            <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span>🛒</span> Buyer Marketplace
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
                        >
                            🛒 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>
                        </button>
                        <span className="font-medium hidden md:inline">Welcome, {userName}</span>
                        <Link to="/" className="text-sm bg-orange-700 px-3 py-1 rounded hover:bg-orange-800 transition">Logout</Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Fresh Arrivals</div>
                        <div className="text-3xl font-bold text-gray-800">{produce.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">My Orders</div>
                        <div className="text-3xl font-bold text-orange-500">{myOrders.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Delivered</div>
                        <div className="text-3xl font-bold text-green-500">{myOrders.filter(o => o.status === 'Delivered').length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Estimated Value</div>
                        <div className="text-3xl font-bold text-gray-800">₹{myOrders.reduce((acc, order) => acc + ((parseFloat(order.price) || 0) * (parseFloat(order.quantity) || 0)), 0)}</div>
                    </div>
                </div>

                {/* Marketplace */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Fresh Produce Market</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {produce.length > 0 ? (
                        produce.map(item => (
                            <div key={item._id || item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-green-100 p-3 rounded-full text-2xl group-hover:scale-110 transition">
                                        {item.crop.toLowerCase().includes('tomato') ? '🍅' :
                                            item.crop.toLowerCase().includes('potato') ? '🥔' :
                                                item.crop.toLowerCase().includes('onion') ? '🧅' :
                                                    item.crop.toLowerCase().includes('carrot') ? '🥕' : '🥦'}
                                    </div>
                                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Organic</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.crop}</h3>
                                <p className="text-gray-500 text-sm mb-4">By {item.farmer?.name || 'Local Farmer'}</p>

                                <div className="flex justify-between items-center mb-4 text-sm">
                                    <div className="text-gray-600">
                                        <span className="block text-xs text-gray-400">Available</span>
                                        <span className="font-semibold">{item.quantity}</span>
                                    </div>
                                    <div className="text-right text-gray-600">
                                        <span className="block text-xs text-gray-400">Location</span>
                                        <span className="font-semibold truncate w-20 text-right">{item.destination}</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <span className="text-xl font-bold text-green-600">₹{item.price} <span className="text-sm text-gray-500 font-normal">/unit</span></span>
                                </div>

                                <button
                                    onClick={() => addToCart(item)}
                                    className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
                                >
                                    <span>🛒</span> Add to Cart
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No fresh produce available right now.</p>
                        </div>
                    )}
                </div>

                {/* My Orders Section */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Item</th>
                                <th className="p-4 font-semibold text-gray-600">Quantity</th>
                                <th className="p-4 font-semibold text-gray-600">Farmer</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {myOrders.length > 0 ? (
                                myOrders.map(order => (
                                    <tr key={order._id || order.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-800">{order.crop}</td>
                                        <td className="p-4 text-gray-600">{order.quantity}</td>
                                        <td className="p-4 text-gray-600">{order.farmer?.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                {order.status === 'In Transit' ? '🚚 In Transit' :
                                                    order.status === 'Sold' ? 'Pending' : order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {order.status === 'In Transit' ? (
                                                <button
                                                    onClick={() => confirmReceipt(order._id || order.id)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-700 transition shadow-sm"
                                                >
                                                    Order Received
                                                </button>
                                            ) : order.status === 'Delivered' ? (
                                                <span className="text-green-600 text-sm">Completed</span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Processing...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                                        You haven't placed any orders yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Cart Modal */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-end z-50">
                    <div className="bg-white h-full w-full max-w-md shadow-2xl p-6 flex flex-col animate-slideInRight">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Your Cart ({cart.length})</h2>
                            <button onClick={() => { setIsCartOpen(false); setCheckoutStep(1); }} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
                                <span className="text-4xl mb-4">🛒</span>
                                <p>Your cart is empty.</p>
                                <button onClick={() => setIsCartOpen(false)} className="mt-4 text-orange-600 font-bold hover:underline">Start Shopping</button>
                            </div>
                        ) : (
                            <>
                                {/* Step 1: Cart Items */}
                                {checkoutStep === 1 && (
                                    <div className="flex-grow overflow-y-auto">
                                        {cart.map((item, index) => (
                                            <div key={index} className="flex gap-4 mb-6 border-b pb-4">
                                                <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center text-2xl">
                                                    {item.crop.toLowerCase().includes('tomato') ? '🍅' : 'Produce'}
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-bold text-gray-800">{item.crop}</h3>
                                                    <div className="text-xs text-gray-500 mb-1">Available: {item.quantity}</div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <input
                                                            type="number"
                                                            placeholder="Qty"
                                                            value={item.purchaseQty}
                                                            onChange={(e) => updateCartQty(item._id || item.id, e.target.value)}
                                                            className="w-20 border rounded px-2 py-1 text-sm"
                                                            min="1"
                                                        />
                                                        <span className="text-sm text-gray-500">{item.quantity.replace(/[0-9.]/g, '').trim()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-between">
                                                    <span className="font-bold text-orange-600">₹{item.price}</span>
                                                    <button onClick={() => removeFromCart(item._id || item.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Step 2: Details Form */}
                                {checkoutStep === 2 && (
                                    <div className="flex-grow overflow-y-auto">
                                        <h3 className="font-bold text-lg mb-4 text-gray-800">Delivery Details</h3>
                                        <form className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                                                <input name="phone" value={checkoutData.phone} onChange={handleCheckoutInput} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="10-digit mobile number" required />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                                                <input name="email" value={checkoutData.email} onChange={handleCheckoutInput} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="john@example.com" required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Pincode</label>
                                                    <input name="pincode" value={checkoutData.pincode} onChange={handleCheckoutInput} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. 500001" maxLength="6" required />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">City</label>
                                                    <input name="city" value={checkoutData.city} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500" placeholder="Auto-detected" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Full Address</label>
                                                <textarea name="address" value={checkoutData.address} onChange={handleCheckoutInput} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" rows="3" placeholder="H.No, Street, Landmark..." required></textarea>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Step 3: Payment */}
                                {checkoutStep === 3 && (
                                    <div className="flex-grow flex flex-col items-center justify-center">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAY_TOTAL_INR_${calculateTotal()}`} alt="QR" className="mb-4 mix-blend-multiply" />
                                        <p className="text-gray-500 text-sm mb-6">Scan to Pay securely via UPI</p>
                                        <div className="w-full bg-gray-50 p-4 rounded-lg mb-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600">Total Items</span>
                                                <span className="font-bold">{cart.length}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600">Delivery Charge</span>
                                                <span className="font-bold">₹48</span>
                                            </div>
                                            <div className="flex justify-between text-lg">
                                                <span className="font-bold text-gray-800">Total Amount</span>
                                                <span className="font-bold text-green-600">₹{calculateTotal()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Footer Buttons */}
                                <div className="mt-6 border-t pt-4">
                                    {checkoutStep === 1 && (
                                        <>
                                            <div className="mb-4 space-y-2">
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Item Total</span>
                                                    <span>₹{calculateTotal() - 48}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Delivery Charge</span>
                                                    <span>₹48</span>
                                                </div>
                                                <div className="flex justify-between items-center border-t pt-2 mt-2">
                                                    <span className="font-bold text-gray-800">Total</span>
                                                    <span className="text-2xl font-bold text-orange-600">₹{calculateTotal()}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setCheckoutStep(2)}
                                                disabled={cart.length === 0}
                                                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50"
                                            >
                                                Proceed to Details
                                            </button>
                                        </>
                                    )}

                                    {checkoutStep === 2 && (
                                        <div className="flex gap-3">
                                            <button onClick={() => setCheckoutStep(1)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Back</button>
                                            <button
                                                onClick={() => {
                                                    if (!checkoutData.phone || !checkoutData.pincode || !checkoutData.address) {
                                                        alert('Please fill all details');
                                                        return;
                                                    }
                                                    setCheckoutStep(3);
                                                }}
                                                className="flex-[2] bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition"
                                            >
                                                Proceed to Pay
                                            </button>
                                        </div>
                                    )}

                                    {checkoutStep === 3 && (
                                        <div className="flex gap-3">
                                            <button onClick={() => setCheckoutStep(2)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Back</button>
                                            <button onClick={submitOrder} className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">Confirm Payment</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerDashboard;
