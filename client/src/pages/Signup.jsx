import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') || 'farmer';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: initialRole
    });

    const { name, email, password, confirmPassword, role } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ name, email, password, role });
            const res = await axios.post('http://localhost:5001/api/auth/register', body, config);
            console.log(res.data);
            alert('Registration Successful');
            navigate('/login');
        } catch (err) {
            console.error(err.response.data);
            alert('Registration Failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F8F2] relative overflow-hidden flex items-center justify-center py-12">
            {/* Background Shapes */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">
                            Create Account
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Join the agricultural revolution today
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">Select Role</label>
                            <select
                                name="role"
                                value={role}
                                onChange={onChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition"
                            >
                                <option value="farmer">🌾 Farmer</option>
                                <option value="agent">🚚 Delivery Agent</option>
                                <option value="buyer">🥬 Buyer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition-colors duration-300 shadow-lg mt-6"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 text-center space-y-3">
                        <p className="text-slate-600 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm"
                        >
                            <span>←</span>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
