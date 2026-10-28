import axios from 'axios';

const axiosClient = axios.create({
    // Sử dụng biến môi trường nếu có (khi deploy), nếu không thì dùng localhost (khi code ở máy)
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn Token vào mỗi request nếu đã đăng nhập
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;