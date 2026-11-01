import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Tables from './pages/Tables';
import Menu from './pages/Menu';
import Kitchen from './pages/Kitchen';
import CustomerOrder from './pages/CustomerOrder';
import Billing from './pages/Billing';
import Staff from './pages/Staff';
import Voucher from './pages/Voucher';
import Shift from './pages/Shift';
import Inventory from './pages/Inventory';
import PurchaseOrders from './pages/PurchaseOrders';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ========================================== */}
                {/* 1. KHU VỰC KHÁCH HÀNG (KHÔNG CẦN ĐĂNG NHẬP) */}
                {/* ========================================== */}
                {/* Trang chủ mặc định (nếu không có số bàn) */}
                <Route path="/" element={<CustomerOrder />} />

                {/* Đường dẫn gọi món có kèm số bàn (Dùng cho quét QR sau này) */}
                <Route path="/order" element={<CustomerOrder />} />
                <Route path="/order/table/:tableId" element={<CustomerOrder />} />

                {/* ========================================== */}
                {/* 2. KHU VỰC ĐĂNG NHẬP (DÀNH CHO NHÂN VIÊN) */}
                {/* ========================================== */}
                <Route path="/login" element={<Login />} />

                {/* ========================================== */}
                {/* 3. KHU VỰC QUẢN TRỊ (CẦN ĐĂNG NHẬP VÀ PHÂN QUYỀN) */}
                {/* ========================================== */}
                <Route element={<AdminLayout />}>

                    {/* Chỉ Admin/Manager mới được vào */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/admin/menu" element={<Menu />} />
                        <Route path="/admin/staff" element={<Staff />} />
                        <Route path="/admin/vouchers" element={<Voucher />} />
                        <Route path="/shifts" element={<Shift />} />
                        <Route path="/admin/inventory" element={<Inventory />} />
                        <Route path="/admin/purchase-orders" element={<PurchaseOrders />} />
                    </Route>

                    {/* Admin, Phục vụ, Thu ngân */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'waiter', 'cashier']} />}>
                        <Route path="/tables" element={<Tables />} />
                        <Route path="/billing" element={<Billing />} />
                        <Route path="/billing/table/:tableId" element={<Billing />} />
                    </Route>

                    {/* Admin và Bếp */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'kitchen']} />}>
                        <Route path="/kitchen" element={<Kitchen />} />
                    </Route>

                </Route>

                {/* Gõ sai link thì tự động đá về trang chủ khách hàng */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;