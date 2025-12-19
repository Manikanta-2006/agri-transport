import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#F3F8F2] font-sans text-slate-800">

            {/* Navigation Bar - Absolute positioning to sit on top of video */}
            <nav className="absolute top-0 left-0 w-full z-20 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-4xl">🌾</span>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-md">Agri Transport</h1>
                    </div>
                    <Link
                        to="/role-selection"
                        className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-green-800 transition-all duration-300 shadow-lg text-lg"
                    >
                        Login
                    </Link>
                </div>
            </nav>

            {/* Full Screen Hero Section with Video Background */}
            <div className="relative h-screen w-full overflow-hidden">
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover scale-105"
                >
                    <source src="/vecteezy_a-red-semi-truck-drives-through-a-verdant-countryside-under_50466255.mp4" type="video/mp4" />
                </video>

                {/* Darker Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white pt-20">
                    <span className="inline-block py-2 px-6 rounded-full bg-white/10 backdrop-blur-md text-white text-base font-bold tracking-widest mb-8 border border-white/20 uppercase animate-fade-in-down">
                        The Future of Farming Logistics
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-none drop-shadow-2xl">
                        Cultivating <br />
                        <span className="text-green-400">Connections</span>
                    </h1>
                    <p className="text-2xl md:text-3xl mb-12 max-w-4xl font-light leading-relaxed drop-shadow-lg text-gray-100">
                        Join the seamless ecosystem for farmers, buyers, and delivery agents.
                    </p>

                    {/* Only Get Started Button */}
                    <div className="flex gap-4">
                        <Link
                            to="/role-selection"
                            className="bg-green-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-green-500 hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-900/50"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </div>
            </div>

            {/* Organic Shapes Background for Content */}
            <div className="relative overflow-hidden py-32 bg-white">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-green-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-display">How It Works</h2>
                        <p className="text-slate-500 text-xl max-w-2xl mx-auto">Connecting every step of the agricultural journey in one unified platform.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
                        {/* Farmer Card */}
                        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300 hover:-translate-y-3 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                            <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center text-6xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                🌾
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">Farmer</h3>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                List your harvest effortlessly. Set your prices, find buyers instantly, and maximize your profits.
                            </p>
                        </div>

                        {/* Agent Card */}
                        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-3 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-6xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                🚚
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">Agent</h3>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                Turn your vehicle into an asset. Accept delivery jobs nearby and ensure farm-to-table freshness.
                            </p>
                        </div>

                        {/* Buyer Card */}
                        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-300 hover:-translate-y-3 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                            <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center text-6xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                🥬
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">Buyer</h3>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                Freshness first. Source directly from farmers with full price transparency and tracking.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="text-4xl">🌾</span>
                        <h2 className="text-2xl font-bold text-slate-900">Agri Transport</h2>
                    </div>
                    <p className="text-slate-500">© 2024 Agri Transport. Cultivating connections for a better future.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
