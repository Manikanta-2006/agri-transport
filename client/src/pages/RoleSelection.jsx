import React from 'react';
import { Link } from 'react-router-dom';

const RoleSelection = () => {
    return (
        <div className="min-h-screen bg-[#F3F8F2] relative overflow-hidden font-sans text-slate-800">
            {/* Organic Shapes Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <div className="container mx-auto px-6 py-12 relative z-10 flex flex-col items-center justify-center min-h-screen">

                {/* Header Section */}
                <div className="text-center mb-16 max-w-3xl">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-green-100 text-green-800 text-sm font-bold tracking-wide mb-6 border border-green-200 uppercase">
                        Agri Ecosystem
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                        Cultivating <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Connections</span>
                    </h1>
                    <p className="text-xl text-slate-600 font-light leading-relaxed">
                        Join the next generation of agricultural logistics. Whether you grow, buy, or deliver, we have a place for you.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">

                    {/* Farmer */}
                    <div className="group relative bg-white rounded-[2rem] p-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-900/5 border border-slate-100">
                        <div className="absolute inset-0 bg-green-50 rounded-[2rem] transform scale-[0.98] group-hover:scale-100 transition-all duration-300 -z-10"></div>
                        <div className="h-full bg-white rounded-[1.5rem] p-8 flex flex-col items-center text-center border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

                            <div className="w-24 h-24 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-5xl">🌾</span>
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 mb-3">Farmer</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Share your produce with the world. Manage listings and track your earnings effortlessly.
                            </p>

                            <div className="mt-auto w-full space-y-3">
                                <Link to="/login?role=farmer" className="block w-full py-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-green-600 transition-colors duration-300">
                                    Login
                                </Link>
                                <Link to="/signup?role=farmer" className="block w-full py-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:border-green-600 hover:text-green-600 transition-colors duration-300">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Agent */}
                    <div className="group relative bg-white rounded-[2rem] p-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/5 border border-slate-100">
                        <div className="absolute inset-0 bg-blue-50 rounded-[2rem] transform scale-[0.98] group-hover:scale-100 transition-all duration-300 -z-10"></div>
                        <div className="h-full bg-white rounded-[1.5rem] p-8 flex flex-col items-center text-center border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>

                            <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-5xl">🚚</span>
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 mb-3">Agent</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Be the bridge. Accept delivery jobs and ensure safe transport from farm to table.
                            </p>

                            <div className="mt-auto w-full space-y-3">
                                <Link to="/login?role=agent" className="block w-full py-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-blue-600 transition-colors duration-300">
                                    Login
                                </Link>
                                <Link to="/signup?role=agent" className="block w-full py-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors duration-300">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Buyer */}
                    <div className="group relative bg-white rounded-[2rem] p-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-900/5 border border-slate-100">
                        <div className="absolute inset-0 bg-orange-50 rounded-[2rem] transform scale-[0.98] group-hover:scale-100 transition-all duration-300 -z-10"></div>
                        <div className="h-full bg-white rounded-[1.5rem] p-8 flex flex-col items-center text-center border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>

                            <div className="w-24 h-24 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-5xl">🥬</span>
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 mb-3">Buyer</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Quality first. Source fresh produce directly from farmers with transparent pricing.
                            </p>

                            <div className="mt-auto w-full space-y-3">
                                <Link to="/login?role=buyer" className="block w-full py-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-orange-600 transition-colors duration-300">
                                    Login
                                </Link>
                                <Link to="/signup?role=buyer" className="block w-full py-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:border-orange-600 hover:text-orange-600 transition-colors duration-300">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium">
                        <span className="text-lg">←</span>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
