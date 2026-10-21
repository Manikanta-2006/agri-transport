import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const Login = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errorMsg) setErrorMsg('');
    };

    const getRoleTheme = () => {
        switch (role) {
            case 'farmer':
                return {
                    title: '🌾 Farmer Portal',
                    badgeClass: 'text-green-700 bg-green-50 border-green-200',
                    btnHover: 'hover:bg-green-600',
                    ringClass: 'focus:ring-green-500'
                };
            case 'agent':
                return {
                    title: '🚚 Agent Portal',
                    badgeClass: 'text-blue-700 bg-blue-50 border-blue-200',
                    btnHover: 'hover:bg-blue-600',
                    ringClass: 'focus:ring-blue-500'
                };
            case 'buyer':
                return {
                    title: '🥬 Buyer Portal',
                    badgeClass: 'text-orange-700 bg-orange-50 border-orange-200',
                    btnHover: 'hover:bg-orange-600',
                    ringClass: 'focus:ring-orange-500'
                };
            default:
                return {
                    title: 'Portal Login',
                    badgeClass: 'text-slate-700 bg-slate-100 border-slate-200',
                    btnHover: 'hover:bg-green-600',
                    ringClass: 'focus:ring-green-500'
                };
        }
    };

    const theme = getRoleTheme();

    const onSubmit = async e => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const trimmedEmail = email.trim().toLowerCase();
            const payload = { email: trimmedEmail, password };
            if (role) {
                payload.role = role.toLowerCase();
            }

            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, JSON.stringify(payload), config);

            const token = res.data.token;
            const user = res.data.user;
            const targetRole = user?.role || role;

            localStorage.setItem('token', token);
            localStorage.setItem('userName', user?.name || 'User');
            if (targetRole) {
                localStorage.setItem('userRole', targetRole);
            }

            alert('Login Successful');

            if (targetRole === 'farmer') {
                navigate('/farmer-dashboard');
            } else if (targetRole === 'agent') {
                navigate('/agent-dashboard');
            } else if (targetRole === 'buyer') {
                navigate('/buyer-dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            const msg = !err.response
                ? 'Unable to connect to the backend server. Please make sure the server is running on port 5001.'
                : (err.response.data?.msg || 'Login failed. Please check your credentials.');
            setErrorMsg(msg);
            alert(msg);
        } finally {
            setIsLoading(false);
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
                            Welcome Back
                        </h1>
                        <div className="mt-2">
                            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${theme.badgeClass}`}>
                                {theme.title}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm mt-3">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                            {errorMsg}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                className={`w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ringClass} focus:border-transparent transition`}
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                className={`w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ringClass} focus:border-transparent transition`}
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-slate-900 text-white py-4 rounded-xl font-bold ${theme.btnHover} transition-colors duration-300 shadow-lg disabled:opacity-60 cursor-pointer`}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 text-center space-y-3">
                        <p className="text-slate-600 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to={`/signup${role ? `?role=${role}` : ''}`}
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                        <div className="flex justify-center gap-4 text-sm">
                            <Link
                                to="/role-selection"
                                className="text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                Switch Role
                            </Link>
                            <span className="text-slate-300">|</span>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <span>←</span>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
