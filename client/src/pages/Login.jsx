import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
    Sprout,
    Truck,
    ShoppingBag,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const Login = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') || 'farmer';

    const [selectedRole, setSelectedRole] = useState(initialRole);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errorMsg) setErrorMsg('');
    };

    const handleRoleChange = (newRole) => {
        setSelectedRole(newRole);
        navigate(`/login?role=${newRole}`, { replace: true });
        if (errorMsg) setErrorMsg('');
    };

    const getRoleTheme = () => {
        switch (selectedRole) {
            case 'farmer':
                return {
                    name: 'Farmer',
                    title: 'Farmer Portal',
                    icon: <Sprout className="w-5 h-5 text-green-600" />,
                    badgeClass: 'text-green-700 bg-green-50 border-green-200',
                    activeTab: 'bg-green-600 text-white shadow-md shadow-green-600/30',
                    btnBg: 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30',
                    ringClass: 'focus:ring-green-500 focus:border-green-500',
                    accentColor: 'text-green-600'
                };
            case 'agent':
                return {
                    name: 'Agent',
                    title: 'Delivery Agent Portal',
                    icon: <Truck className="w-5 h-5 text-blue-600" />,
                    badgeClass: 'text-blue-700 bg-blue-50 border-blue-200',
                    activeTab: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
                    btnBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30',
                    ringClass: 'focus:ring-blue-500 focus:border-blue-500',
                    accentColor: 'text-blue-600'
                };
            case 'buyer':
                return {
                    name: 'Buyer',
                    title: 'Produce Buyer Portal',
                    icon: <ShoppingBag className="w-5 h-5 text-orange-600" />,
                    badgeClass: 'text-orange-700 bg-orange-50 border-orange-200',
                    activeTab: 'bg-orange-600 text-white shadow-md shadow-orange-600/30',
                    btnBg: 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30',
                    ringClass: 'focus:ring-orange-500 focus:border-orange-500',
                    accentColor: 'text-orange-600'
                };
            default:
                return {
                    name: 'General',
                    title: 'Agriculture Portal',
                    icon: <Sprout className="w-5 h-5 text-green-600" />,
                    badgeClass: 'text-slate-700 bg-slate-100 border-slate-200',
                    activeTab: 'bg-slate-900 text-white',
                    btnBg: 'bg-slate-900 hover:bg-green-600 text-white shadow-slate-900/30',
                    ringClass: 'focus:ring-green-500 focus:border-green-500',
                    accentColor: 'text-green-600'
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
            const payload = {
                email: trimmedEmail,
                password,
                role: selectedRole.toLowerCase()
            };

            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, JSON.stringify(payload), config);

            const token = res.data.token;
            const user = res.data.user;
            const targetRole = user?.role || selectedRole;

            localStorage.setItem('token', token);
            localStorage.setItem('userName', user?.name || 'User');
            if (targetRole) {
                localStorage.setItem('userRole', targetRole);
            }

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
                ? 'Unable to connect to the backend server. Please verify the server is running on port 5001.'
                : (err.response.data?.msg || 'Login failed. Please check your credentials.');
            setErrorMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F8F4] relative overflow-hidden flex items-center justify-center py-12 px-4 selection:bg-green-500 selection:text-white">
            {/* Ambient Background Glowing Shapes */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

            <div className="relative z-10 w-full max-w-md">
                {/* Back to Home Link */}
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Home</span>
                    </Link>

                    <Link
                        to="/role-selection"
                        className="text-xs font-semibold text-slate-500 hover:text-green-700 transition"
                    >
                        View All Roles →
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                    {/* Role Pill Switcher */}
                    <div className="bg-slate-100 p-1 rounded-2xl flex items-center justify-between gap-1 mb-8">
                        <button
                            type="button"
                            onClick={() => handleRoleChange('farmer')}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                selectedRole === 'farmer' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Sprout className="w-3.5 h-3.5" />
                            <span>Farmer</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleChange('agent')}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                selectedRole === 'agent' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Agent</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleChange('buyer')}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                selectedRole === 'buyer' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Buyer</span>
                        </button>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-black text-slate-900 mb-1">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Signing in to your <span className={`font-bold ${theme.accentColor}`}>{theme.title}</span>
                        </p>
                    </div>

                    {/* Error Box */}
                    {errorMsg && (
                        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 ${theme.ringClass} transition`}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    className={`w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 ${theme.ringClass} transition`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${theme.btnBg} py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer`}
                        >
                            {isLoading ? (
                                <span>Authenticating...</span>
                            ) : (
                                <>
                                    <span>Sign In to {theme.name} Portal</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
                        <p className="text-slate-600 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to={`/signup?role=${selectedRole}`}
                                className={`font-bold ${theme.accentColor} hover:underline`}
                            >
                                Register as {theme.name}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
