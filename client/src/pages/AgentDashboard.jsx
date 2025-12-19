import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AgentDashboard = () => {
    const userName = localStorage.getItem('userName') || 'Agent';
    const [availableJobs, setAvailableJobs] = useState([]);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await axios.get('http://localhost:5001/api/listings/agent-jobs', config);
            setAvailableJobs(res.data);
        } catch (err) {
            console.error('Error fetching jobs:', err);
        }
    };

    const acceptDelivery = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            await axios.put(`http://localhost:5001/api/listings/accept/${id}`, {}, config);
            alert('Delivery Accepted! Item is now In Transit.');
            fetchJobs();
        } catch (err) {
            console.error(err.response?.data);
            alert('Error accepting delivery');
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span>🚚</span> Delivery Agent Portal
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="font-medium">Welcome, {userName}</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                            👮‍♂️
                        </div>
                        <Link to="/" className="text-sm bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 transition">Logout</Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Available Jobs</div>
                        <div className="text-3xl font-bold text-gray-800">{availableJobs.filter(job => job.status === 'Sold').length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Active Deliveries</div>
                        <div className="text-3xl font-bold text-blue-500">{availableJobs.filter(job => job.status === 'In Transit').length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Completed</div>
                        <div className="text-3xl font-bold text-green-500">{availableJobs.filter(job => job.status === 'Delivered').length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Total Earnings</div>
                        <div className="text-3xl font-bold text-blue-600">₹{availableJobs.filter(job => job.status === 'Delivered').length * 48}</div>
                    </div>
                </div>

                {/* Job Marketplace */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Marketplace</h2>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Delivery Jobs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {availableJobs.filter(job => job.status === 'Sold').length > 0 ? (
                            availableJobs.filter(job => job.status === 'Sold').map(job => (
                                <div key={job._id || job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-2xl">📦</div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">New Job</span>
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Earn ₹48</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{job.crop} - {job.quantity}</h3>
                                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                                        <p className="flex items-center gap-2">
                                            <span>📍</span>
                                            <span>From: <span className="font-semibold">{job.destination}</span></span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span>🏁</span>
                                            <span>To: <span className="font-semibold">{job.deliveryAddress || 'Not Provided'}</span></span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span>👤</span>
                                            <span>Buyer: <span className="font-semibold">{job.buyer?.name}</span></span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => acceptDelivery(job._id || job.id)}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                                    >
                                        Accept Delivery
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No new delivery jobs available.</p>
                                <p className="text-gray-400">Check back later for new listings.</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Active Deliveries */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Active Deliveries</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableJobs.filter(job => job.status === 'In Transit').length > 0 ? (
                        availableJobs.filter(job => job.status === 'In Transit').map(job => (
                            <div key={job._id || job.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{job.crop}</h3>
                                        <p className="text-sm text-gray-500">Qty: {job.quantity}</p>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold animate-pulse">In Transit</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="text-gray-400 text-xs">Pickup From</p>
                                        <p className="font-semibold">{job.destination}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">Deliver To</p>
                                        <p className="font-semibold">{job.buyer?.name}</p>
                                        <p className="text-xs text-gray-500">{job.deliveryAddress || 'Not Provided'}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded text-center text-sm text-gray-600">
                                    Delivery Pending
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-400 italic">
                            No active deliveries in progress.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AgentDashboard;
