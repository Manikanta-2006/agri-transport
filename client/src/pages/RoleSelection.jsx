import React from 'react';
import { Link } from 'react-router-dom';
import {
    Sprout,
    Truck,
    ShoppingBag,
    ArrowRight,
    CheckCircle2,
    ArrowLeft,
    Sparkles,
    ShieldCheck,
    TrendingUp
} from 'lucide-react';

const RoleSelection = () => {
    return (
        <div className="min-h-screen bg-[#F4F8F4] relative overflow-hidden font-sans text-slate-800 antialiased selection:bg-green-500 selection:text-white flex flex-col justify-between py-12 px-6">
            {/* Ambient Background Glowing Shapes */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center my-auto">
                {/* Back to Home Link */}
                <div className="w-full flex justify-between items-center mb-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200/70 transition font-medium text-sm backdrop-blur-md"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold tracking-wide uppercase border border-green-200">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Unified Agriculture Portal</span>
                    </div>
                </div>

                {/* Header Section */}
                <div className="text-center mb-14 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                        Choose Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
                            Ecosystem Role
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed font-normal">
                        Select how you participate in the Agri Transport logistics network to access your tailored dashboard.
                    </p>
                </div>

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">

                    {/* 1. Farmer Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-2.5 transition-all duration-300 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-green-500 to-emerald-600"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300">
                                <Sprout className="w-8 h-8" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-green-100 text-green-800">
                                Producer
                            </span>
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 mb-2">Farmer</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            List your harvested produce, set your own fair prices per quintal, and receive direct buyer orders.
                        </p>

                        <div className="space-y-3 mb-8 text-sm text-slate-700">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                <span>Zero Commission Deductions</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                <span>Guaranteed Farm-Gate Pickup</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                <span>Fast Bank Account Payouts</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-3">
                            <Link
                                to="/login?role=farmer"
                                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-green-600 text-white font-bold flex items-center justify-center gap-2 transition-colors duration-300 shadow-md group-hover:shadow-green-600/30"
                            >
                                <span>Farmer Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/signup?role=farmer"
                                className="block w-full py-3 rounded-xl border border-slate-200 hover:border-green-600 text-slate-700 hover:text-green-600 font-bold text-center text-sm transition"
                            >
                                Register New Farmer
                            </Link>
                        </div>
                    </div>

                    {/* 2. Delivery Agent Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2.5 transition-all duration-300 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-blue-500 to-cyan-600"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                <Truck className="w-8 h-8" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                                Logistics
                            </span>
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 mb-2">Delivery Agent</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Turn your transport vehicle into consistent revenue. Pick nearby agricultural delivery tasks with route details.
                        </p>

                        <div className="space-y-3 mb-8 text-sm text-slate-700">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Real-time Available Job Feed</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Transparent Pay Per Kilometer</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>No Empty Return Trips</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-3">
                            <Link
                                to="/login?role=agent"
                                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold flex items-center justify-center gap-2 transition-colors duration-300 shadow-md group-hover:shadow-blue-600/30"
                            >
                                <span>Agent Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/signup?role=agent"
                                className="block w-full py-3 rounded-xl border border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-bold text-center text-sm transition"
                            >
                                Register New Agent
                            </Link>
                        </div>
                    </div>

                    {/* 3. Buyer Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:shadow-orange-900/10 hover:-translate-y-2.5 transition-all duration-300 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-orange-500 to-amber-600"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                                Consumer
                            </span>
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 mb-2">Produce Buyer</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Direct farm-to-door bulk procurement. Source fresh crops with transparent origin details and online tracking.
                        </p>

                        <div className="space-y-3 mb-8 text-sm text-slate-700">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                                <span>Direct Farm Freshness Guaranteed</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                                <span>Multi-item Shopping Cart</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                                <span>Verified Receipt Confirmation</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-3">
                            <Link
                                to="/login?role=buyer"
                                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-2 transition-colors duration-300 shadow-md group-hover:shadow-orange-600/30"
                            >
                                <span>Buyer Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/signup?role=buyer"
                                className="block w-full py-3 rounded-xl border border-slate-200 hover:border-orange-600 text-slate-700 hover:text-orange-600 font-bold text-center text-sm transition"
                            >
                                Register New Buyer
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            <footer className="text-center text-xs text-slate-500 pt-10">
                Agri Transport © {new Date().getFullYear()} — Empowering Fair Indian Agriculture
            </footer>
        </div>
    );
};

export default RoleSelection;
