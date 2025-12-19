import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FarmerDashboard = () => {
    const userName = localStorage.getItem('userName') || 'Farmer';

    const [listings, setListings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        crop: '',
        quantity: '',
        destination: '',
        price: ''
    });

    const { crop, quantity, destination, price } = formData;

    const fetchListings = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await axios.get('http://localhost:5001/api/listings', config);
            setListings(res.data);
        } catch (err) {
            console.error('Error fetching listings:', err);
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
            await axios.post('http://localhost:5001/api/listings', body, config);
            setShowModal(false);
            setFormData({ crop: '', quantity: '', destination: '', price: '' });
            fetchListings(); // Refresh listings
            alert('Listing Added Successfully');
        } catch (err) {
            console.error(err.response?.data);
            alert('Error adding listing');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-green-600 text-white shadow-lg">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span>🚜</span> Farmer Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="font-medium">Welcome, {userName}</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                            👨‍🌾
                        </div>
                        <Link to="/" className="text-sm bg-green-700 px-3 py-1 rounded hover:bg-green-800 transition">Logout</Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Total Listings</div>
                        <div className="text-3xl font-bold text-gray-800">{listings.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Pending Requests</div>
                        <div className="text-3xl font-bold text-orange-500">{listings.filter(item => item.status === 'Sold').length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">In Transit</div>
                        <div className="text-3xl font-bold text-blue-500">{listings.filter(item => item.status === 'In Transit').length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Total Earnings</div>
                        <div className="text-3xl font-bold text-green-600">₹{listings.filter(item => item.status === 'Delivered').reduce((acc, item) => acc + ((parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0)), 0)}</div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Produce Listings</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-md"
                    >
                        <span>+</span> Add New Listing
                    </button>
                </div>

                {/* Listings Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Crop</th>
                                <th className="p-4 font-semibold text-gray-600">Quantity</th>
                                <th className="p-4 font-semibold text-gray-600">Date Listed</th>
                                <th className="p-4 font-semibold text-gray-600">Location</th>
                                <th className="p-4 font-semibold text-gray-600">Price/Unit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {listings.filter(item => item.status === 'Pending').length > 0 ? (
                                listings.filter(item => item.status === 'Pending').map(item => (
                                    <tr key={item._id || item.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-800">{item.crop}</td>
                                        <td className="p-4 text-gray-600">{item.quantity}</td>
                                        <td className="p-4 text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                                        <td className="p-4 text-gray-600">{item.destination}</td>
                                        <td className="p-4 text-green-600 font-bold">₹{item.price}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                                        No active listings. Add stock to start selling!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Orders & Deliveries Section */}
                <div className="mt-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders & Deliveries</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-orange-50 border-b border-orange-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-700">Item</th>
                                    <th className="p-4 font-semibold text-gray-700">Quantity</th>
                                    <th className="p-4 font-semibold text-gray-700">Ordered By</th>
                                    <th className="p-4 font-semibold text-gray-700">Status</th>
                                    <th className="p-4 font-semibold text-gray-700">Delivery</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {listings.filter(item => item.status !== 'Pending').length > 0 ? (
                                    listings.filter(item => item.status !== 'Pending').map(item => (
                                        <tr key={item._id || item.id} className="hover:bg-orange-50/30 transition">
                                            <td className="p-4 font-medium text-gray-800">{item.crop}</td>
                                            <td className="p-4 text-gray-600">{item.quantity}</td>
                                            <td className="p-4 text-gray-600 flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">👤</span>
                                                {item.buyer?.name || 'Unknown'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Sold' ? 'bg-orange-100 text-orange-700' :
                                                    item.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                    {item.status === 'Sold' ? 'Pending' :
                                                        item.status === 'In Transit' ? 'In Transport' :
                                                            item.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {item.status === 'Delivered' ? (
                                                    <span className="text-green-600 font-bold flex items-center gap-1">
                                                        ✅ Delivered
                                                    </span>
                                                ) : item.status === 'In Transit' ? (
                                                    <span className="text-blue-600 font-medium">
                                                        🚚 On the way
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic">
                                                        Waiting for Agent...
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                                            No orders received yet. Your listings are pending.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity / Notifications */}
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {listings.length > 0 ? (
                            listings.slice(0, 3).map(item => (
                                <div key={item._id || item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-start gap-4">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600">�</div>
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            You listed <span className="font-bold">{item.quantity}</span> of <span className="font-bold">{item.crop}</span>.
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Location: {item.destination} &bull; {new Date(item.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No recent activity. Add a listing to get started!</p>
                        )}
                    </div>
                </div>

            </main>

            {/* Add Listing Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Listing</h2>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Crop Name</label>
                                <input
                                    type="text"
                                    name="crop"
                                    value={crop}
                                    onChange={onChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g., Tomatoes"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Quantity</label>
                                <input
                                    type="text"
                                    name="quantity"
                                    value={quantity}
                                    onChange={onChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g., 500 kg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Location</label>
                                <input
                                    type="text"
                                    name="destination"
                                    value={destination}
                                    onChange={onChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Price Per Unit (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={price}
                                    onChange={onChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g., 10"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md"
                            >
                                Publish Listing
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmerDashboard;
