import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
    Sprout,
    Plus,
    LogOut,
    Search,
    MapPin,
    Calendar,
    DollarSign,
    Package,
    TrendingUp,
    Clock,
    Truck,
    CheckCircle2,
    RefreshCw,
    X,
    Filter
} from 'lucide-react';

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Farmer';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [formData, setFormData] = useState({
        crop: '',
        quantity: '',
        destination: '',
        price: ''
    });

    const { crop, quantity, destination, price } = formData;

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await axios.get(`${API_BASE_URL}/api/listings`, config);
            setListings(res.data);
        } catch (err) {
            console.error('Error fetching listings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };
            const body = JSON.stringify({ crop, quantity, destination, price });
            await axios.post(`${API_BASE_URL}/api/listings`, body, config);
            setShowModal(false);
            setFormData({ crop: '', quantity: '', destination: '', price: '' });
            fetchListings();
            alert('Listing Added Successfully!');
        } catch (err) {
            console.error(err.response?.data);
            alert('Error adding listing. Please try again.');
        }
    };

    const filteredListings = listings.filter(item => {
        const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.destination && item.destination.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalEarnings = listings
        .filter(item => item.status === 'Delivered')
        .reduce((acc, item) => acc + ((parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0)), 0);

    const pendingCount = listings.filter(item => item.status === 'Pending').length;
    const inTransitCount = listings.filter(item => item.status === 'In Transit').length;
    const soldCount = listings.filter(item => item.status === 'Sold').length;

    return (
        <div className="min-h-screen bg-[#F7FAF7] font-sans text-slate-800 antialiased selection:bg-green-500 selection:text-white flex flex-col">
            {/* Top Navigation */}
            <header className="bg-slate-900 text-white shadow-xl border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                            <Sprout className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-white tracking-tight">Agri Transport</span>
                            <span className="text-[10px] uppercase font-bold text-green-400 block -mt-1 tracking-wider">Farmer Command Center</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm">
                                👨‍🌾
                            </div>
                            <div className="hidden sm:block text-left">
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span>{userName}</span>
                                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                                </div>
                                <div className="text-[10px] text-slate-400">Verified Producer</div>
                            </div>
                        </div>

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

            {/* Main Content Area */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
                {/* Greeting & Quick Action Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Produce Dashboard
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Manage your harvest stock, track dispatch routes, and monitor incoming buyer settlements.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchListings}
                            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-600/30 hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            <span>Add New Harvest</span>
                        </button>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/* Card 1: Total Listings */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Listings</span>
                            <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                                <Package className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{listings.length}</div>
                        <div className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                            <span>●</span> {pendingCount} active in market
                        </div>
                    </div>

                    {/* Card 2: Sold / Pending Pickup */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Awaiting Dispatch</span>
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-orange-600">{soldCount}</div>
                        <div className="text-xs text-slate-500 mt-2">Paid orders waiting for agent</div>
                    </div>

                    {/* Card 3: In Transit */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Transit</span>
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Truck className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-blue-600">{inTransitCount}</div>
                        <div className="text-xs text-slate-500 mt-2">Dispatched to buyer</div>
                    </div>

                    {/* Card 4: Total Revenue */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Settled Revenue</span>
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-emerald-600">₹{totalEarnings.toLocaleString()}</div>
                        <div className="text-xs text-emerald-700 font-semibold mt-2">Delivered & verified payouts</div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                        {['All', 'Pending', 'Sold', 'In Transit', 'Delivered'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    statusFilter === status
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                            >
                                {status === 'All' ? 'All Produce' : status}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Filter by crop or farm..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        />
                    </div>
                </div>

                {/* Listings Table View */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                    <th className="p-4 pl-6">Crop Name</th>
                                    <th className="p-4">Quantity Available</th>
                                    <th className="p-4">Farm Location</th>
                                    <th className="p-4">Price / Unit</th>
                                    <th className="p-4">Date Added</th>
                                    <th className="p-4 pr-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredListings.length > 0 ? (
                                    filteredListings.map(item => {
                                        const status = item.status || 'Pending';
                                        let badgeColor = 'bg-green-100 text-green-800 border-green-200';
                                        if (status === 'Sold') badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
                                        if (status === 'In Transit') badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
                                        if (status === 'Delivered') badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';

                                        return (
                                            <tr key={item._id || item.id} className="hover:bg-slate-50/60 transition">
                                                <td className="p-4 pl-6 font-bold text-slate-900 flex items-center gap-2.5">
                                                    <span className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center font-bold text-xs">
                                                        🌾
                                                    </span>
                                                    <span>{item.crop}</span>
                                                </td>
                                                <td className="p-4 font-semibold text-slate-700">{item.quantity}</td>
                                                <td className="p-4 text-slate-600 flex items-center gap-1.5 pt-5">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{item.destination}</span>
                                                </td>
                                                <td className="p-4 font-black text-green-700">₹{item.price}</td>
                                                <td className="p-4 text-slate-500 text-xs">
                                                    {new Date(item.date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="p-4 pr-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                        {status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center">
                                            <div className="max-w-sm mx-auto text-center space-y-3">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <h3 className="font-bold text-slate-800">No Listings Found</h3>
                                                <p className="text-xs text-slate-500">
                                                    {searchTerm || statusFilter !== 'All'
                                                        ? 'No produce matches your search filters. Try clearing your filters.'
                                                        : 'You haven’t published any harvest listings yet. Click "Add New Harvest" to start selling.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add Produce Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in-up">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 max-w-lg w-full relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <Sprout className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">List New Produce</h2>
                                <p className="text-xs text-slate-500">Share your harvest with verified commercial buyers</p>
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                                    Crop Name
                                </label>
                                <input
                                    type="text"
                                    name="crop"
                                    value={crop}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    placeholder="e.g. Organic Wheat, Red Onions, Alphonso Mangoes"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                                        Quantity
                                    </label>
                                    <input
                                        type="text"
                                        name="quantity"
                                        value={quantity}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                        placeholder="e.g. 500 kg, 20 Quintals"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                                        Price (₹ / Unit)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={price}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                        placeholder="e.g. 2400"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                                    Farm Pickup Location
                                </label>
                                <input
                                    type="text"
                                    name="destination"
                                    value={destination}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    placeholder="e.g. Khanna Mandi, Ludhiana, Punjab"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-bold shadow-md shadow-green-600/30 transition cursor-pointer"
                                >
                                    Publish Listing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmerDashboard;
