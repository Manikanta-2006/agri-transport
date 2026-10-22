import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Sprout,
    Truck,
    ShoppingBag,
    ShieldCheck,
    ArrowRight,
    TrendingUp,
    CheckCircle2,
    Star,
    Sparkles,
    MapPin,
    DollarSign,
    Users,
    Clock,
    RefreshCw,
    ChevronRight
} from 'lucide-react';

const Home = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;

    const [activeTab, setActiveTab] = useState('farmer');

    const dashboardPath = role === 'farmer'
        ? '/farmer-dashboard'
        : role === 'agent'
        ? '/agent-dashboard'
        : role === 'buyer'
        ? '/buyer-dashboard'
        : '/role-selection';

    const sampleProduce = [
        { crop: 'Organic Wheat', location: 'Punjab', price: '₹2,400/qtl', tag: 'Fresh Harvest' },
        { crop: 'Nashik Red Onions', location: 'Maharashtra', price: '₹1,850/qtl', tag: 'High Demand' },
        { crop: 'Himachal Apples', location: 'Shimla', price: '₹6,500/qtl', tag: 'Grade A' },
        { crop: 'Basmati Rice', location: 'Haryana', price: '₹4,200/qtl', tag: 'Export Quality' }
    ];

    const testimonials = [
        {
            name: 'Gurpreet Singh',
            role: 'Wheat & Mustard Farmer, Punjab',
            text: 'Earlier, middle brokers took up to 30% of our earnings. With Agri Transport, my produce was booked within 4 hours and payment was directly credited.',
            rating: 5,
            tag: 'Farmer'
        },
        {
            name: 'Rajesh Sharma',
            role: 'Commercial Fleet Owner, Delhi NCR',
            text: 'I no longer return with an empty truck. The agent dashboard notifies me of agricultural pickup requests right along my return route.',
            rating: 5,
            tag: 'Delivery Agent'
        },
        {
            name: 'Priya Narang',
            role: 'Wholesale Procurement Head, FreshBite',
            text: 'We procure 20 tonnes of fresh vegetables weekly. Transparent prices and status tracking from farm gate to city warehouse make this indispensable.',
            rating: 5,
            tag: 'Bulk Buyer'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F7FAF7] font-sans text-slate-800 antialiased selection:bg-green-500 selection:text-white">

            {/* Glassmorphic Navigation Bar */}
            <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4">
                <div className="max-w-7xl mx-auto rounded-2xl glass-panel shadow-lg shadow-black/5 px-6 py-3 flex justify-between items-center border border-white/60">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-green-600/30 group-hover:scale-105 transition-transform">
                            <Sprout className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                                Agri Transport
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                            </span>
                            <span className="text-[10px] font-bold text-green-700 tracking-wider uppercase block -mt-1">
                                Direct Logistics Network
                            </span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <a href="#how-it-works" className="hover:text-green-600 transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-green-600 transition-colors">Why Us</a>
                        <a href="#marketplace" className="hover:text-green-600 transition-colors">Produce Market</a>
                        <a href="#testimonials" className="hover:text-green-600 transition-colors">Stories</a>
                    </div>

                    <div className="flex items-center gap-3">
                        {token ? (
                            <div className="flex items-center gap-3">
                                <span className="text-slate-700 text-sm font-medium hidden sm:inline">
                                    Hi, <span className="font-bold text-green-700">{userName || 'Partner'}</span>
                                </span>
                                <Link
                                    to={dashboardPath}
                                    className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-green-600/30 hover:shadow-lg transition-all flex items-center gap-2 group"
                                >
                                    <span>Dashboard</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    to="/role-selection"
                                    className="text-slate-700 hover:text-slate-900 font-bold text-sm px-4 py-2 rounded-xl hover:bg-slate-100 transition"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/role-selection"
                                    className="bg-slate-900 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-green-600/25 transition-all duration-300 flex items-center gap-1.5"
                                >
                                    <span>Get Started</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
                {/* Background Video with Rich Atmospheric Overlay */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
                >
                    <source src="/vecteezy_a-red-semi-truck-drives-through-a-verdant-countryside-under_50466255.mp4" type="video/mp4" />
                </video>

                {/* Layered Gradient Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-black/40 backdrop-blur-[1.5px]"></div>

                {/* Ambient Glow Bubbles */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center">
                    
                    {/* Live Indicator Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs sm:text-sm font-bold tracking-wide uppercase mb-8 shadow-xl animate-fade-in-up">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>The Modern Agricultural Highway</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.05] mb-8 drop-shadow-2xl animate-fade-in-up">
                        Cultivating <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-lime-300">
                            Direct Connections
                        </span>
                    </h1>

                    <p className="text-lg sm:text-2xl text-slate-200 font-light max-w-3xl leading-relaxed mb-10 drop-shadow-md">
                        Connecting verified <span className="text-white font-medium">Farmers</span>, reliable <span className="text-white font-medium">Delivery Agents</span>, and wholesale <span className="text-white font-medium">Buyers</span> in one transparent digital marketplace.
                    </p>

                    {/* Dual Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link
                            to={token ? dashboardPath : '/role-selection'}
                            className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-slate-950 font-black px-9 py-4 rounded-2xl text-lg shadow-2xl shadow-green-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <span>{token ? 'Enter Dashboard' : 'Join the Ecosystem'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span>Explore How It Works</span>
                        </a>
                    </div>

                    {/* Floating Trust Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-3xl text-left">
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">0% Middleman Cut</h4>
                                <p className="text-xs text-slate-300">100% farm-gate proceeds</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">&lt; 24h Transit Dispatch</h4>
                                <p className="text-xs text-slate-300">Optimal route matching</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Escrow Protection</h4>
                                <p className="text-xs text-slate-300">Payment on confirmation</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Live Stats Bar */}
            <section className="bg-white border-y border-slate-200/80 py-10 relative z-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-2xl shadow-inner">
                            <Users className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">500+</div>
                            <div className="text-sm font-medium text-slate-500">Verified Farmers</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-inner">
                            <Truck className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">1,250+</div>
                            <div className="text-sm font-medium text-slate-500">Tonnes Delivered</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl shadow-inner">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">₹4.2 Cr</div>
                            <div className="text-sm font-medium text-slate-500">Trade Volume</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-2xl shadow-inner">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">99.8%</div>
                            <div className="text-sm font-medium text-slate-500">On-Time Completion</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works / Role Selection Section */}
            <section id="how-it-works" className="py-28 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block py-1 px-4 rounded-full bg-green-100 text-green-800 text-xs font-bold tracking-widest uppercase mb-4">
                            Three Pillars of Agriculture
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            Designed for Everyone in the Chain
                        </h2>
                        <p className="text-lg text-slate-600">
                            Whether you harvest crops, drive logistical routes, or purchase fresh produce in bulk, Agri Transport gives you a tailored command center.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Farmer Card */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                            
                            <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                <Sprout className="w-8 h-8" />
                            </div>

                            <span className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">For Producers</span>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Farmer Portal</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Upload your seasonal harvest in seconds. Set your exact price per quintal and get matched with genuine commercial buyers.
                            </p>

                            <ul className="space-y-3 mb-8 text-sm text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Instant Produce Listing & Pricing</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Live Pickup Notifications</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Direct Bank Settlement</span>
                                </li>
                            </ul>

                            <div className="mt-auto space-y-2.5">
                                <Link
                                    to="/login?role=farmer"
                                    className="block w-full py-3.5 rounded-xl bg-slate-900 hover:bg-green-600 text-white font-bold text-center transition-colors shadow-md"
                                >
                                    Farmer Login
                                </Link>
                                <Link
                                    to="/signup?role=farmer"
                                    className="block w-full py-3 rounded-xl border border-slate-200 hover:border-green-600 text-slate-700 hover:text-green-600 font-bold text-center text-sm transition"
                                >
                                    Register as Farmer
                                </Link>
                            </div>
                        </div>

                        {/* Agent Card */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-600"></div>

                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                <Truck className="w-8 h-8" />
                            </div>

                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">For Logistics</span>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Delivery Agent</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Monetize vehicle capacity. Pick up available cargo jobs along your routes and confirm safe farm-to-table deliveries.
                            </p>

                            <ul className="space-y-3 mb-8 text-sm text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span>Real-time Available Job Board</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span>Single-tap Job Acceptance</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span>Optimized Transit Schedules</span>
                                </li>
                            </ul>

                            <div className="mt-auto space-y-2.5">
                                <Link
                                    to="/login?role=agent"
                                    className="block w-full py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-center transition-colors shadow-md"
                                >
                                    Agent Login
                                </Link>
                                <Link
                                    to="/signup?role=agent"
                                    className="block w-full py-3 rounded-xl border border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-bold text-center text-sm transition"
                                >
                                    Register as Agent
                                </Link>
                            </div>
                        </div>

                        {/* Buyer Card */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-900/10 hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-600"></div>

                            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-8 h-8" />
                            </div>

                            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">For Buyers</span>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Buyer Portal</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Source directly from verified farms. Add produce to your cart, check out with secure online payments, and track order fulfillment.
                            </p>

                            <ul className="space-y-3 mb-8 text-sm text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                                    <span>Live Marketplace Inventory</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                                    <span>Integrated Multi-crop Cart</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                                    <span>Delivery Confirmation Verification</span>
                                </li>
                            </ul>

                            <div className="mt-auto space-y-2.5">
                                <Link
                                    to="/login?role=buyer"
                                    className="block w-full py-3.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-center transition-colors shadow-md"
                                >
                                    Buyer Login
                                </Link>
                                <Link
                                    to="/signup?role=buyer"
                                    className="block w-full py-3 rounded-xl border border-slate-200 hover:border-orange-600 text-slate-700 hover:text-orange-600 font-bold text-center text-sm transition"
                                >
                                    Register as Buyer
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Produce Marketplace Ticker */}
            <section id="marketplace" className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <span className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                                Live Harvest Highlights
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black">Trending Farm Batches</h2>
                        </div>
                        <Link
                            to="/role-selection"
                            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-bold text-sm"
                        >
                            <span>Browse All Current Listings</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sampleProduce.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold">
                                            {item.tag}
                                        </span>
                                        <div className="text-xs text-slate-400 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{item.location}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{item.crop}</h3>
                                    <p className="text-slate-400 text-sm">Verified Farm Gate Stock</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-xl font-black text-green-400">{item.price}</span>
                                    <Link
                                        to="/role-selection"
                                        className="text-xs bg-white text-slate-900 font-bold px-3 py-1.5 rounded-lg hover:bg-green-400 transition"
                                    >
                                        Order
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-green-700 text-xs font-bold uppercase tracking-widest mb-2 block">
                            Real Stories
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                            Trusted by India's Agricultural Community
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-1 text-amber-500 mb-4">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                                        "{t.text}"
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-slate-200">
                                    <h4 className="font-bold text-slate-900 text-base">{t.name}</h4>
                                    <p className="text-xs text-slate-500">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* High Impact Call to Action Banner */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-slate-900 via-green-950 to-slate-900 p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-green-500/20">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="inline-block py-1 px-4 rounded-full bg-green-500/20 text-green-300 text-xs font-bold tracking-widest uppercase mb-4 border border-green-500/30">
                            Get Started in Under 60 Seconds
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                            Ready to modernize your agricultural commerce?
                        </h2>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed font-light">
                            Join hundreds of farmers, delivery agents, and buyers already transforming farm logistics with zero commission friction.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/role-selection"
                                className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-slate-950 font-black px-8 py-4 rounded-xl text-base shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                Select Your Role & Register
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-300"
                            >
                                Already Have an Account?
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-4 md:col-span-1">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-slate-950 font-bold">
                                <Sprout className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-white">Agri Transport</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Connecting farmers directly with buyers through smart, verified transport networks.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-green-400">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span>Platform Status: Fully Operational</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Role Portals</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/login?role=farmer" className="hover:text-green-400 transition">Farmer Portal</Link></li>
                            <li><Link to="/login?role=agent" className="hover:text-green-400 transition">Delivery Agent Portal</Link></li>
                            <li><Link to="/login?role=buyer" className="hover:text-green-400 transition">Produce Buyer Portal</Link></li>
                            <li><Link to="/role-selection" className="hover:text-green-400 transition">All Role Options</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#how-it-works" className="hover:text-green-400 transition">How It Works</a></li>
                            <li><a href="#marketplace" className="hover:text-green-400 transition">Produce Market</a></li>
                            <li><a href="#testimonials" className="hover:text-green-400 transition">User Testimonials</a></li>
                            <li><Link to="/signup" className="hover:text-green-400 transition">Create New Account</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Security & Compliance</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            All user listings, driver dispatch logs, and transaction details are encrypted and securely verified.
                        </p>
                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} Agri Transport. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
