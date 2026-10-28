import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Lấy quyền của người dùng hiện tại (admin, kitchen, waiter...)
    const userRole = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Cấu hình màu sắc
    const navyColor = '#1e3a8a';
    const activeColor = '#2563eb';

    // Cấu hình Menu (Có phân quyền)
    const allMenuItems = [
        { path: '/dashboard', name: 'Tổng quan', icon: 'bi-speedometer2', roles: ['admin'] },
        { path: '/tables', name: 'Sơ đồ bàn', icon: 'bi-grid', roles: ['admin', 'waiter', 'cashier'] },
        { path: '/menu', name: 'Thực đơn', icon: 'bi-egg-fried', roles: ['admin'] },
        { path: '/kitchen', name: 'Màn hình bếp', icon: 'bi-fire', roles: ['admin', 'kitchen'] },
    ];

    // Lọc menu: Chỉ hiển thị những menu mà Role hiện tại được phép xem
    const visibleMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* TOP NAVBAR */}
            <nav className="navbar navbar-expand navbar-dark px-3 shadow-sm z-3" style={{ backgroundColor: navyColor }}>
                <button className="btn btn-link text-white me-2 p-0" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Ẩn/Hiện Menu">
                    <i className="bi bi-list fs-3"></i>
                </button>

                <Link className="navbar-brand fw-bold ms-2 tracking-wide" to="/">
                    <i className="bi bi-shop me-2"></i>RESTO MANAGER
                </Link>

                <div className="ms-auto d-flex align-items-center gap-3">
                    <span className="text-white opacity-75 d-none d-md-block">
                        Xin chào, <strong className="text-warning text-uppercase">{userRole}</strong>
                    </span>
                    <button className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2" onClick={handleLogout}>
                        <span className="d-none d-md-block">Đăng xuất</span>
                        <i className="bi bi-box-arrow-right fs-5"></i>
                    </button>
                </div>
            </nav>

            <div className="d-flex flex-grow-1 position-relative">
                {/* SIDEBAR */}
                <div
                    className="text-white flex-shrink-0 transition-all duration-300 shadow"
                    style={{
                        width: isSidebarOpen ? '260px' : '0px',
                        backgroundColor: navyColor,
                        overflow: 'hidden',
                        minHeight: 'calc(100vh - 56px)'
                    }}
                >
                    <ul className="nav flex-column mt-3 w-100" style={{ minWidth: '260px' }}>
                        {visibleMenuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li className="nav-item" key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`nav-link text-white py-3 px-4 d-flex align-items-center transition-all`}
                                        style={{
                                            backgroundColor: isActive ? activeColor : 'transparent',
                                            borderLeft: isActive ? '4px solid #fbbf24' : '4px solid transparent',
                                            opacity: isActive ? 1 : 0.8
                                        }}
                                        onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                                        onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        <i className={`bi ${item.icon} me-3 fs-5`}></i>
                                        <span className="fw-medium">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* NỘI DUNG CHÍNH */}
                <div className="flex-grow-1 p-4 bg-light overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}