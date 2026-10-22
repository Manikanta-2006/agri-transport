import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
    Truck,
    Package,
    Navigation,
    CheckCircle2,
    Clock,
    DollarSign,
    MapPin,
    User,
    LogOut,
    Search,
    RefreshCw,
    AlertCircle,
    ArrowRight,
    ShieldCheck,
    Compass
} from 'lucide-react';

const AgentDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Agent';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const [availableJobs, setAvailableJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [acceptingId, setAcceptingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('available'); // 'available' | 'transit' | 'completed' | 'all'

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await axios.get(`${API_BASE_URL}/api/listings/agent-jobs`, config);
            setAvailableJobs(res.data);
        } catch (err) {
            console.error('Error fetching jobs:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const acceptDelivery = async (id) => {
        setAcceptingId(id);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            await axios.put(`${API_BASE_URL}/api/listings/accept/${id}`, {}, config);
            alert('Delivery Accepted! Item is now In Transit.');
            await fetchJobs();
            setActiveTab('transit');
        } catch (err) {
            console.error(err.response?.data);
            alert('Error accepting delivery. Please try again.');
        } finally {
            setAcceptingId(null);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Filter jobs by search and status
    const filteredJobs = availableJobs.filter(job => {
        const matchesSearch =
            (job.crop && job.crop.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (job.destination && job.destination.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (job.deliveryAddress && job.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (job.buyer?.name && job.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (activeTab === 'available') return job.status === 'Sold';
        if (activeTab === 'transit') return job.status === 'In Transit';
        if (activeTab === 'completed') return job.status === 'Delivered';
        return true; // 'all'
    });

    const readyJobsCount = availableJobs.filter(j => j.status === 'Sold').length;
    const inTransitCount = availableJobs.filter(j => j.status === 'In Transit').length;
    const completedCount = availableJobs.filter(j => j.status === 'Delivered').length;
    const totalEarnings = completedCount * 48;

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white flex flex-col">
            {/* Top Navigation */}
            <header className="bg-slate-900 text-white shadow-xl border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-white tracking-tight">Agri Transport</span>
                            <span className="text-[10px] uppercase font-bold text-blue-400 block -mt-1 tracking-wider">Logistics Dispatch Center</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                                🚚
                            </div>
                            <div className="hidden sm:block text-left">
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span>{userName}</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                                </div>
                                <div className="text-[10px] text-slate-400">Certified Fleet Pilot</div>
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

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
                {/* Greeting Hero Bar */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-8 mb-8 border border-slate-800 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
                                <Compass className="w-3.5 h-3.5 animate-spin" /> Route Optimization Online
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                Logistics Operations Dashboard
                            </h1>
                            <p className="text-slate-300 text-sm mt-1 max-w-xl">
                                Accept verified farmer harvests, streamline mandi pickup routes, and deliver direct to buyers with guaranteed instant payout settlement.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchJobs}
                                disabled={isLoading}
                                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 border border-white/10 cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh Feeds
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metrics Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ready for Pickup</span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Package className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{readyJobsCount}</div>
                        <div className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                            Awaiting agent assignment
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Transit</span>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Truck className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-amber-600 mb-1">{inTransitCount}</div>
                        <div className="text-xs text-slate-500 font-medium">Active shipments on road</div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Trips</span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-emerald-600 mb-1">{completedCount}</div>
                        <div className="text-xs text-slate-500 font-medium">Verified by destination buyer</div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agent Earnings</span>
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-indigo-600 mb-1">₹{totalEarnings}</div>
                        <div className="text-xs text-slate-500 font-medium">₹48 fixed fee / completion</div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                        <button
                            onClick={() => setActiveTab('available')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                                activeTab === 'available'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>Available Deliveries</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                activeTab === 'available' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700 font-bold'
                            }`}>
                                {readyJobsCount}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('transit')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                                activeTab === 'transit'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>In Transit</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                activeTab === 'transit' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700 font-bold'
                            }`}>
                                {inTransitCount}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                                activeTab === 'completed'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>Delivered</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                activeTab === 'completed' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700 font-bold'
                            }`}>
                                {completedCount}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                                activeTab === 'all'
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            All Shipments
                        </button>
                    </div>

                    {/* Search Field */}
                    <div className="relative min-w-[260px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search crop, mandi, buyer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                    </div>
                </div>

                {/* Jobs Grid */}
                {isLoading ? (
                    <div className="bg-white rounded-2xl p-16 text-center border border-slate-200/80 shadow-sm">
                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-700">Connecting to mandi dispatch relay...</p>
                        <p className="text-xs text-slate-400 mt-1">Fetching newest shipment listings</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-slate-300 shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                            📦
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1">
                            {activeTab === 'available' ? 'No New Delivery Jobs Waiting' :
                             activeTab === 'transit' ? 'No Active Shipments On Road' :
                             activeTab === 'completed' ? 'No Deliveries Completed Yet' : 'No Shipments Found'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                            {searchTerm
                                ? 'Try clearing your search query to see other assignments.'
                                : 'When buyers place orders from farmers, dispatch orders appear here for pickup.'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
                            >
                                Clear Search Filter
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map(job => {
                            const isSold = job.status === 'Sold';
                            const isInTransit = job.status === 'In Transit';
                            const isDelivered = job.status === 'Delivered';

                            return (
                                <div
                                    key={job._id || job.id}
                                    className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                                        isInTransit
                                            ? 'border-amber-300 ring-2 ring-amber-100'
                                            : isDelivered
                                            ? 'border-emerald-200'
                                            : 'border-slate-200/80 hover:border-blue-300'
                                    }`}
                                >
                                    <div>
                                        {/* Header Badges */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                                                    {job.crop?.toLowerCase().includes('tomato') ? '🍅' :
                                                     job.crop?.toLowerCase().includes('potato') ? '🥔' :
                                                     job.crop?.toLowerCase().includes('onion') ? '🧅' :
                                                     job.crop?.toLowerCase().includes('carrot') ? '🥕' :
                                                     job.crop?.toLowerCase().includes('wheat') ? '🌾' :
                                                     job.crop?.toLowerCase().includes('rice') ? '🍚' : '🥦'}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                                                        {job.crop}
                                                    </h3>
                                                    <span className="text-xs font-semibold text-slate-500">
                                                        Batch: {job.quantity}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            {isSold && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                                                    Ready Pickup
                                                </span>
                                            )}
                                            {isInTransit && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    <Truck className="w-3.5 h-3.5 animate-bounce" />
                                                    On Road
                                                </span>
                                            )}
                                            {isDelivered && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Delivered
                                                </span>
                                            )}
                                        </div>

                                        {/* Payout Tag */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-center justify-between">
                                            <span className="text-xs text-blue-900 font-semibold flex items-center gap-1.5">
                                                <DollarSign className="w-4 h-4 text-blue-600" />
                                                Courier Payout:
                                            </span>
                                            <span className="text-sm font-black text-blue-700">₹48.00 INR</span>
                                        </div>

                                        {/* Route Visualization */}
                                        <div className="space-y-3 mb-6 bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-xs">
                                            {/* Pickup Mandi */}
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                                    <MapPin className="w-3 h-3" />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Origin Hub / Mandi</span>
                                                    <span className="font-bold text-slate-800 break-words">{job.destination || 'Registered Mandi'}</span>
                                                </div>
                                            </div>

                                            <div className="border-l-2 border-dashed border-slate-300 ml-2.5 h-4"></div>

                                            {/* Destination */}
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Navigation className="w-3 h-3" />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Buyer Destination</span>
                                                    <span className="font-bold text-slate-800 break-words">{job.deliveryAddress || 'Address on file'}</span>
                                                </div>
                                            </div>

                                            {/* Buyer Info */}
                                            {job.buyer?.name && (
                                                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-500">
                                                    <span className="text-[11px] flex items-center gap-1">
                                                        <User className="w-3 h-3" /> Buyer:
                                                    </span>
                                                    <span className="font-bold text-slate-700">{job.buyer.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div>
                                        {isSold && (
                                            <button
                                                onClick={() => acceptDelivery(job._id || job.id)}
                                                disabled={acceptingId === (job._id || job.id)}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
                                            >
                                                {acceptingId === (job._id || job.id) ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                        Accepting Job...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Truck className="w-4 h-4" />
                                                        Accept & Start Transit
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {isInTransit && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                                                <p className="text-xs font-bold text-amber-800 flex items-center justify-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                                                    Trip Active: In Transit
                                                </p>
                                                <p className="text-[10px] text-amber-600 mt-0.5">
                                                    Awaiting buyer arrival confirmation to release funds
                                                </p>
                                            </div>
                                        )}

                                        {isDelivered && (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                                                <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                    Trip Completed & Settled
                                                </p>
                                                <p className="text-[10px] text-emerald-600 mt-0.5">
                                                    +₹48.00 credited to wallet
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AgentDashboard;

