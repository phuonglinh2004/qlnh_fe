import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, Receipt, Users, LogOut, Coffee } from 'lucide-react';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const menuItems = [
        { path: '/dashboard', name: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
        { path: '/tables', name: 'Sơ đồ bàn', icon: <Coffee size={20} /> },
        { path: '/menu', name: 'Thực đơn', icon: <Utensils size={20} /> },
        { path: '/orders', name: 'Đơn hàng', icon: <Receipt size={20} /> },
        { path: '/staff', name: 'Nhân viên', icon: <Users size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* SIDEBAR - Đã đổi sang màu trắng nhẹ nhàng */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20">
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-slate-100">
                    <h1 className="text-xl font-black text-orange-600 tracking-wider">RESTO MANAGER</h1>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                    isActive
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                }`}
                            >
                                {/* Icon cũng đổi màu theo trạng thái active */}
                                <div className={isActive ? 'text-orange-500' : 'text-slate-400'}>
                                    {item.icon}
                                </div>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Nút Đăng xuất */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-200 font-medium"
                    >
                        <LogOut size={20} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* HEADER */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
                    <h2 className="text-lg font-bold text-slate-800">Hệ thống quản lý nhà hàng</h2>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-700">Quản lý</p>
                            <p className="text-xs text-slate-500">Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold border border-orange-200 shadow-sm cursor-pointer hover:bg-orange-200 transition-colors">
                            QL
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT - Nơi chứa Sơ đồ bàn */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}