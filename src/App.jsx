import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Tables from './pages/Tables';
import Menu from './pages/Menu';
import Kitchen from './pages/Kitchen';
import CustomerOrder from './pages/CustomerOrder';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Trang Đăng nhập (Không cần bảo vệ) */}
                <Route path="/" element={<Login />} />

                {/* 2. Trang dành cho Khách hàng quét mã QR (Nằm NGOÀI AdminLayout) */}
                <Route path="/order" element={<CustomerOrder />} />

                {/* 3. Các trang Quản trị (Nằm TRONG AdminLayout) */}
                <Route element={<AdminLayout />}>

                    {/* Chỉ Admin được vào Tổng quan và Thực đơn */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/menu" element={<Menu />} />
                    </Route>

                    {/* Admin, Phục vụ, Thu ngân được vào Sơ đồ bàn */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'waiter', 'cashier']} />}>
                        <Route path="/tables" element={<Tables />} />
                    </Route>

                    {/* Admin và Bếp được vào Màn hình bếp */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'kitchen']} />}>
                        <Route path="/kitchen" element={<Kitchen />} />
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;