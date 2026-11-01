import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { LogIn, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axiosClient.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);

            const userRole = res.data.role;
            if (userRole === 'admin') navigate('/admin');
            else if (userRole === 'kitchen') navigate('/kitchen');
            else navigate('/tables');

        } catch (error) {
            alert(error.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px', position: 'relative' }}>

            {/* Nút quay lại */}
            <Link to="/" style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#475569', backgroundColor: '#ffffff', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <ArrowLeft size={18} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Về trang đặt món</span>
            </Link>

            {/* Khung Đăng Nhập */}
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '64px', height: '64px', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>ĐĂNG NHẬP</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px' }}>Hệ thống quản lý nhà hàng</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Tài khoản</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập..."
                            style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu..."
                            style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '10px', opacity: isLoading ? 0.7 : 1 }}
                    >
                        {isLoading ? 'Đang kiểm tra...' : <><LogIn size={20} /> Đăng Nhập</>}
                    </button>
                </form>
            </div>
        </div>
    );
}