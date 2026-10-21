// Centralized API configuration for Agri Transport
// In Vite dev (port 5173), defaults to localhost:5001
// In production unified deployment, defaults to '' (same origin /api/...)
export const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (typeof window !== 'undefined' && window.location.port === '5173'
        ? 'http://localhost:5001'
        : '');
