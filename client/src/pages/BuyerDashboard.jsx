import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
    ShoppingBag,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    MapPin,
    Truck,
    CheckCircle2,
    Clock,
    ArrowRight,
    Search,
    LogOut,
    RefreshCw,
    ShieldCheck,
    CreditCard,
    X,
    ChevronRight,
    DollarSign,
    Package,
    Sparkles,
    User,
    Phone,
    Mail,
    Send
} from 'lucide-react';

const BuyerDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Buyer';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const [produce, setProduce] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const [activeSection, setActiveSection] = useState('marketplace'); // 'marketplace' | 'orders'
    const [searchTerm, setSearchTerm] = useState('');

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
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get(`${API_BASE_URL}/api/listings/available`, config);
            setProduce(res.data);
        } catch (err) {
            console.error('Error fetching produce:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get(`${API_BASE_URL}/api/listings/my-orders`, config);
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
                        const city = res.data[0].PostOffice[0].District;
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
        const existingItem = cart.find(cartItem => (cartItem._id || cartItem.id) === (item._id || item.id));
        if (existingItem) {
            setIsCartOpen(true);
            return;
        }
        // Add to cart with default purchaseQty = 1
        setCart([...cart, { ...item, purchaseQty: '1' }]);
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

    const calculateSubtotal = () => {
        return cart.reduce((acc, item) => {
            const qty = parseFloat(item.purchaseQty) || 0;
            const price = parseFloat(item.price) || 0;
            return acc + (qty * price);
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal > 0 ? subtotal + 48 : 0;
    };

    const submitOrder = async () => {
        setIsSubmittingOrder(true);
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

            if (itemsToBuy.some(i => !i.quantity || parseFloat(i.quantity) <= 0)) {
                alert('Please enter valid quantities for all items.');
                setIsSubmittingOrder(false);
                return;
            }

            const body = JSON.stringify({ items: itemsToBuy, deliveryDetails: checkoutData });
            const res = await axios.post(`${API_BASE_URL}/api/listings/purchase-cart`, body, config);

            if (res.data.success) {
                alert('Order Placed Successfully! Payment Verified.');
                setCart([]);
                setCheckoutStep(1);
                setIsCartOpen(false);
                setCheckoutData({ phone: '', email: '', pincode: '', city: '', address: '' });
                fetchProduce();
                fetchMyOrders();
                setActiveSection('orders');
            } else {
                alert('Something went wrong with the order.');
            }
        } catch (err) {
            console.error(err.response?.data);
            alert('Error processing order: ' + (err.response?.data?.msg || err.message));
        } finally {
            setIsSubmittingOrder(false);
        }
    };

    const confirmReceipt = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`${API_BASE_URL}/api/listings/confirm/${id}`, {}, config);
            alert('Order Confirmed! Produce received successfully.');
            fetchMyOrders();
        } catch (err) {
            console.error(err);
            alert('Error confirming receipt.');
        }
    };

    // Filter available produce
    const filteredProduce = produce.filter(item => {
        return (
            (item.crop && item.crop.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.destination && item.destination.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.farmer?.name && item.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const deliveredOrdersCount = myOrders.filter(o => o.status === 'Delivered').length;
    const inTransitOrdersCount = myOrders.filter(o => o.status === 'In Transit').length;
    const totalOrderValue = myOrders.reduce((acc, order) => {
        return acc + ((parseFloat(order.price) || 0) * (parseFloat(order.quantity) || 0));
    }, 0);

    const getCropEmoji = (name = '') => {
        const lower = name.toLowerCase();
        if (lower.includes('tomato')) return '🍅';
        if (lower.includes('potato')) return '🥔';
        if (lower.includes('onion')) return '🧅';
        if (lower.includes('carrot')) return '🥕';
        if (lower.includes('wheat')) return '🌾';
        if (lower.includes('rice') || lower.includes('paddy')) return '🍚';
        if (lower.includes('chili') || lower.includes('chilli')) return '🌶️';
        if (lower.includes('corn') || lower.includes('maize')) return '🌽';
        if (lower.includes('apple')) return '🍎';
        if (lower.includes('banana')) return '🍌';
        if (lower.includes('mango')) return '🥭';
        return '🥦';
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased selection:bg-amber-500 selection:text-white flex flex-col relative">
            {/* Top Navigation */}
            <header className="bg-slate-900 text-white shadow-xl border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-white tracking-tight">Agri Transport</span>
                            <span className="text-[10px] uppercase font-bold text-amber-400 block -mt-1 tracking-wider">Direct Mandi Buyer Hub</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition flex items-center gap-2 border border-white/10 cursor-pointer"
                            title="Open Cart"
                        >
                            <ShoppingCart className="w-5 h-5 text-amber-400" />
                            <span className="text-xs font-bold text-white hidden sm:inline">Cart</span>
                            {cart.length > 0 && (
                                <span className="bg-orange-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full animate-bounce">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        {/* Buyer Profile Pill */}
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                                🛒
                            </div>
                            <div className="hidden sm:block text-left">
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span>{userName}</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                                </div>
                                <div className="text-[10px] text-slate-400">Verified Mandi Buyer</div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="text-xs font-bold bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-slate-300 px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
                {/* Greeting Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-orange-950 text-white p-8 mb-8 border border-slate-800 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
                                <Sparkles className="w-3.5 h-3.5" /> 100% Direct From Registered Farmers
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                Fresh Wholesale Produce Marketplace
                            </h1>
                            <p className="text-slate-300 text-sm mt-1 max-w-xl">
                                Purchase premium farm batches directly at regulated mandi prices. Fast dispatch with verified logistics agents directly to your address.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { fetchProduce(); fetchMyOrders(); }}
                                disabled={isLoading}
                                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 border border-white/10 cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh Market
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metrics Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fresh Arrivals</span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Package className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{produce.length}</div>
                        <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            Available in current cycle
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Orders</span>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-amber-600 mb-1">{myOrders.length}</div>
                        <div className="text-xs text-slate-500 font-medium">Lifetime order history</div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivered & Closed</span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-blue-600 mb-1">{deliveredOrdersCount}</div>
                        <div className="text-xs text-slate-500 font-medium">
                            {inTransitOrdersCount > 0 ? `${inTransitOrdersCount} active in transit` : 'All deliveries up to date'}
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Value</span>
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-orange-600 mb-1">₹{totalOrderValue.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 font-medium">Total purchased volume</div>
                    </div>
                </div>

                {/* Section Toggle & Search Controls */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Section Switcher Tabs */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveSection('marketplace')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                                activeSection === 'marketplace'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <Package className="w-4 h-4" />
                            <span>Fresh Produce Market</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                activeSection === 'marketplace' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700 font-bold'
                            }`}>
                                {produce.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveSection('orders')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                                activeSection === 'orders'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <Truck className="w-4 h-4" />
                            <span>My Orders & Tracking</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                activeSection === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700 font-bold'
                            }`}>
                                {myOrders.length}
                            </span>
                        </button>
                    </div>

                    {/* Search Field */}
                    {activeSection === 'marketplace' && (
                        <div className="relative min-w-[260px]">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search crop, mandi, farmer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                            />
                        </div>
                    )}
                </div>

                {/* VIEW 1: Produce Marketplace */}
                {activeSection === 'marketplace' && (
                    <>
                        {isLoading ? (
                            <div className="bg-white rounded-2xl p-16 text-center border border-slate-200/80 shadow-sm">
                                <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-3" />
                                <p className="text-sm font-semibold text-slate-700">Connecting to mandi harvest records...</p>
                                <p className="text-xs text-slate-400 mt-1">Retrieving farm listings in your region</p>
                            </div>
                        ) : filteredProduce.length === 0 ? (
                            <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-slate-300 shadow-sm">
                                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                                    🥦
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mb-1">
                                    {searchTerm ? 'No Produce Matches Your Search' : 'No Fresh Harvest Available Yet'}
                                </h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                                    {searchTerm
                                        ? 'Try searching with another crop name or mandi location.'
                                        : 'Registered farmers will list their fresh crops shortly. Check back soon.'}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl hover:bg-amber-100 transition"
                                    >
                                        Reset Filter
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProduce.map(item => {
                                    const inCart = cart.some(c => (c._id || c.id) === (item._id || item.id));

                                    return (
                                        <div
                                            key={item._id || item.id}
                                            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between group hover:border-amber-300"
                                        >
                                            <div>
                                                {/* Top Badges */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-100 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                                                        {getCropEmoji(item.crop)}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                                                            Farm Fresh
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-slate-400">
                                                            Mandi Verified
                                                        </span>
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-black text-slate-900 mb-1">
                                                    {item.crop}
                                                </h3>
                                                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                                    Farmer: <span className="font-semibold text-slate-700">{item.farmer?.name || 'Local Producer'}</span>
                                                </p>

                                                {/* Specs Grid */}
                                                <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Stock Available</span>
                                                        <span className="font-bold text-slate-800">{item.quantity}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Origin Mandi</span>
                                                        <span className="font-bold text-slate-800 truncate block" title={item.destination}>
                                                            {item.destination || 'Mandi Center'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="mb-5 flex items-baseline justify-between">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-black text-emerald-600">₹{item.price}</span>
                                                        <span className="text-xs text-slate-400 font-medium">/ unit</span>
                                                    </div>
                                                    <span className="text-[11px] text-slate-400">Direct mandi pricing</span>
                                                </div>
                                            </div>

                                            {/* Add to Cart CTA */}
                                            <button
                                                onClick={() => addToCart(item)}
                                                className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                                                    inCart
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-amber-500/20 hover:shadow-md'
                                                }`}
                                            >
                                                {inCart ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                        In Cart (View Drawer)
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="w-4 h-4" />
                                                        Add to Cart
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* VIEW 2: My Orders Section */}
                {activeSection === 'orders' && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Your Purchase History</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Track your dispatched shipments and confirm receipt upon arrival</p>
                            </div>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                                Total: {myOrders.length} Orders
                            </span>
                        </div>

                        {myOrders.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                                    📦
                                </div>
                                <h4 className="text-base font-bold text-slate-800 mb-1">No Orders Placed Yet</h4>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                                    Browse the fresh produce marketplace and place your first wholesale order.
                                </p>
                                <button
                                    onClick={() => setActiveSection('marketplace')}
                                    className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl transition cursor-pointer"
                                >
                                    Browse Available Produce
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {myOrders.map(order => {
                                    const isDelivered = order.status === 'Delivered';
                                    const isInTransit = order.status === 'In Transit';
                                    const isPending = order.status === 'Sold' || order.status === 'Pending';

                                    return (
                                        <div key={order._id || order.id} className="p-6 hover:bg-slate-50/50 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            {/* Item Info */}
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shrink-0">
                                                    {getCropEmoji(order.crop)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-base font-black text-slate-900">{order.crop}</h4>
                                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                            Qty: {order.quantity}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                                        <span>Farmer: <strong className="text-slate-700">{order.farmer?.name || 'Local Farm'}</strong></span>
                                                        <span>•</span>
                                                        <span>Origin: <strong className="text-slate-700">{order.destination}</strong></span>
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 mt-1">
                                                        Destination: {order.deliveryAddress || 'Address on file'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Order Progress Status */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8">
                                                {/* Price */}
                                                <div className="text-left sm:text-right">
                                                    <span className="text-xs text-slate-400 block font-medium">Batch Total</span>
                                                    <span className="text-base font-black text-slate-900">
                                                        ₹{((parseFloat(order.price) || 0) * (parseFloat(order.quantity) || 1)).toLocaleString()}
                                                    </span>
                                                </div>

                                                {/* Status Badge */}
                                                <div>
                                                    {isDelivered && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                            Delivered & Verified
                                                        </span>
                                                    )}
                                                    {isInTransit && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
                                                            <Truck className="w-4 h-4 text-blue-600" />
                                                            In Transit with Agent
                                                        </span>
                                                    )}
                                                    {isPending && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <Clock className="w-4 h-4 text-amber-600" />
                                                            Awaiting Agent Pickup
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Confirm Receipt Action */}
                                                <div className="min-w-[140px] text-right">
                                                    {isInTransit ? (
                                                        <button
                                                            onClick={() => confirmReceipt(order._id || order.id)}
                                                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Confirm Receipt
                                                        </button>
                                                    ) : isDelivered ? (
                                                        <span className="text-xs font-semibold text-emerald-600 flex items-center sm:justify-end gap-1">
                                                            <ShieldCheck className="w-4 h-4" />
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Dispatched soon
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Slide-Out Modern Cart & Checkout Drawer */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        onClick={() => { setIsCartOpen(false); setCheckoutStep(1); }}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                    ></div>

                    <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slideInRight">
                            {/* Drawer Header */}
                            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black tracking-tight text-white">Your Cart</h2>
                                        <span className="text-[11px] text-amber-400 font-bold">
                                            {cart.length} item{cart.length === 1 ? '' : 's'} selected
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setIsCartOpen(false); setCheckoutStep(1); }}
                                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Stepper Header (Only when cart has items) */}
                            {cart.length > 0 && (
                                <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-bold text-slate-500">
                                    <span className={checkoutStep === 1 ? 'text-amber-600 font-black flex items-center gap-1' : 'flex items-center gap-1'}>
                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">1</span> Cart
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                    <span className={checkoutStep === 2 ? 'text-amber-600 font-black flex items-center gap-1' : 'flex items-center gap-1'}>
                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">2</span> Shipping
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                    <span className={checkoutStep === 3 ? 'text-amber-600 font-black flex items-center gap-1' : 'flex items-center gap-1'}>
                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">3</span> Pay
                                    </span>
                                </div>
                            )}

                            {/* Drawer Body */}
                            {cart.length === 0 ? (
                                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mb-4">
                                        🛒
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h3>
                                    <p className="text-xs text-slate-500 max-w-xs mb-6">
                                        Explore the fresh produce market and add wholesale lots directly to your cart.
                                    </p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl transition cursor-pointer"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                                    {/* STEP 1: Cart Items */}
                                    {checkoutStep === 1 && (
                                        <div className="space-y-4">
                                            {cart.map((item) => {
                                                const qty = parseFloat(item.purchaseQty) || 0;
                                                const price = parseFloat(item.price) || 0;
                                                const itemTotal = qty * price;

                                                return (
                                                    <div
                                                        key={item._id || item.id}
                                                        className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-start gap-3 relative"
                                                    >
                                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                                                            {getCropEmoji(item.crop)}
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <h4 className="font-bold text-slate-900 text-sm truncate">{item.crop}</h4>
                                                                <button
                                                                    onClick={() => removeFromCart(item._id || item.id)}
                                                                    className="text-slate-400 hover:text-red-500 transition p-1 cursor-pointer"
                                                                    title="Remove item"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 mb-2">
                                                                Available: {item.quantity} • Mandi: {item.destination}
                                                            </div>

                                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[11px] text-slate-500 font-semibold">Qty:</span>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        value={item.purchaseQty}
                                                                        onChange={(e) => updateCartQty(item._id || item.id, e.target.value)}
                                                                        className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                        placeholder="1"
                                                                    />
                                                                    <span className="text-[11px] text-slate-400 font-medium">units</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-xs font-black text-slate-900">₹{itemTotal.toFixed(0)}</span>
                                                                    <span className="text-[10px] text-slate-400 block -mt-1">₹{item.price}/u</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* STEP 2: Delivery Details Form */}
                                    {checkoutStep === 2 && (
                                        <div className="space-y-4 text-xs">
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                                                <span>Enter delivery location for the dispatch agent.</span>
                                            </div>

                                            <div>
                                                <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                                                <div className="relative">
                                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={checkoutData.phone}
                                                        onChange={handleCheckoutInput}
                                                        placeholder="10-digit mobile number"
                                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={checkoutData.email}
                                                        onChange={handleCheckoutInput}
                                                        placeholder="buyer@example.com"
                                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block font-bold text-slate-700 mb-1">Postal Pincode</label>
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={checkoutData.pincode}
                                                        onChange={handleCheckoutInput}
                                                        placeholder="e.g. 500001"
                                                        maxLength="6"
                                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-mono"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-bold text-slate-700 mb-1">District / City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={checkoutData.city}
                                                        readOnly
                                                        placeholder="Auto-detected"
                                                        className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block font-bold text-slate-700 mb-1">Delivery Address</label>
                                                <textarea
                                                    name="address"
                                                    value={checkoutData.address}
                                                    onChange={handleCheckoutInput}
                                                    placeholder="Plot/Flat number, Street name, Landmark, Town..."
                                                    rows="3"
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3: Payment & UPI Checkout */}
                                    {checkoutStep === 3 && (
                                        <div className="space-y-4 text-center">
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block">
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI_PAY_AGRI_TRANSPORT_${calculateTotal()}`}
                                                    alt="UPI QR Code"
                                                    className="mx-auto rounded-lg shadow-sm"
                                                />
                                            </div>

                                            <div>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                                                    <ShieldCheck className="w-3.5 h-3.5" /> Direct UPI Escrow Verified
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    Scan with Google Pay, PhonePe, or Paytm to initiate order fulfillment.
                                                </p>
                                            </div>

                                            {/* Shipping Preview */}
                                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-left text-xs text-slate-600">
                                                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> Delivery To:
                                                </div>
                                                <p className="text-[11px] text-slate-500 truncate">{checkoutData.address}, {checkoutData.city} - {checkoutData.pincode}</p>
                                                <p className="text-[11px] text-slate-500">Phone: {checkoutData.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Drawer Footer with Price Breakdown and Step Navigation */}
                            {cart.length > 0 && (
                                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                                    {/* Price Breakdown */}
                                    <div className="space-y-1.5 text-xs text-slate-600">
                                        <div className="flex justify-between">
                                            <span>Produce Subtotal</span>
                                            <span className="font-semibold text-slate-800">₹{calculateSubtotal().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Mandi Dispatch Courier Fee</span>
                                            <span className="font-semibold text-slate-800">₹48.00</span>
                                        </div>
                                        <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                                            <span className="font-bold text-slate-900 text-sm">Total Payable</span>
                                            <span className="font-black text-xl text-amber-600">₹{calculateTotal().toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Step Buttons */}
                                    {checkoutStep === 1 && (
                                        <button
                                            onClick={() => setCheckoutStep(2)}
                                            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-xs"
                                        >
                                            <span>Continue to Shipping Details</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}

                                    {checkoutStep === 2 && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setCheckoutStep(1)}
                                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl transition text-xs cursor-pointer"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!checkoutData.phone || !checkoutData.pincode || !checkoutData.address) {
                                                        alert('Please fill out all delivery fields.');
                                                        return;
                                                    }
                                                    setCheckoutStep(3);
                                                }}
                                                className="flex-[2] bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <span>Proceed to Payment</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {checkoutStep === 3 && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setCheckoutStep(2)}
                                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl transition text-xs cursor-pointer"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={submitOrder}
                                                disabled={isSubmittingOrder}
                                                className="flex-[2] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                {isSubmittingOrder ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                        Verifying Payment...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Confirm & Place Order
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerDashboard;

