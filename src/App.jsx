// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import AdminLayout from './components/AdminLayout';
// import ProtectedRoute from './components/ProtectedRoute';
//
// import Dashboard from './pages/Dashboard';
// import Tables from './pages/Tables';
// import Menu from './pages/Menu';
// import Kitchen from './pages/Kitchen';
// import CustomerOrder from './pages/CustomerOrder';
// import Billing from './pages/Billing';
// import Staff from './pages/Staff';
// import Voucher from './pages/Voucher';
// import Shift from './pages/Shift';
// import Inventory from './pages/Inventory';
// import PurchaseOrders from './pages/PurchaseOrders';
// import Orders from './pages/Orders';
//
// function App() {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 {/* ========================================== */}
//                 {/* 1. KHU VỰC KHÁCH HÀNG (KHÔNG CẦN ĐĂNG NHẬP) */}
//                 {/* ========================================== */}
//                 <Route path="/" element={<CustomerOrder />} />
//                 <Route path="/order" element={<CustomerOrder />} />
//                 <Route path="/order/table/:tableId" element={<CustomerOrder />} />
//
//                 {/* ========================================== */}
//                 {/* 2. KHU VỰC ĐĂNG NHẬP (DÀNH CHO NHÂN VIÊN) */}
//                 {/* ========================================== */}
//                 <Route path="/login" element={<Login />} />
//
//                 {/* ========================================== */}
//                 {/* 3. KHU VỰC QUẢN TRỊ (CẦN ĐĂNG NHẬP VÀ PHÂN QUYỀN) */}
//                 {/* ========================================== */}
//                 <Route element={<AdminLayout />}>
//
//                     {/* Chỉ Admin/Manager mới được vào */}
//                     <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
//                         <Route path="/admin" element={<Dashboard />} />
//                         <Route path="/admin/menu" element={<Menu />} />
//                         <Route path="/admin/staff" element={<Staff />} />
//                         <Route path="/admin/vouchers" element={<Voucher />} />
//                         <Route path="/admin/inventory" element={<Inventory />} />
//                         <Route path="/admin/purchase-orders" element={<PurchaseOrders />} />
//                     </Route>
//
//                     {/* Admin, Phục vụ, Thu ngân */}
//                     <Route element={<ProtectedRoute allowedRoles={['admin', 'waiter', 'cashier']} />}>
//                         <Route path="/tables" element={<Tables />} />
//                         <Route path="/billing" element={<Billing />} />
//                         <Route path="/billing/table/:tableId" element={<Billing />} />
//                         <Route path="/orders" element={<Orders />} />
//                     </Route>
//
//                     {/* Admin và Thu ngân (Quản lý ca làm) */}
//                     <Route element={<ProtectedRoute allowedRoles={['admin', 'cashier']} />}>
//                         <Route path="/shifts" element={<Shift />} />
//                     </Route>
//
//                     {/* Admin và Bếp */}
//                     <Route element={<ProtectedRoute allowedRoles={['admin', 'kitchen']} />}>
//                         <Route path="/kitchen" element={<Kitchen />} />
//                     </Route>
//
//                 </Route>
//
//                 {/* Gõ sai link thì tự động đá về trang chủ khách hàng */}
//                 <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>
//         </BrowserRouter>
//     );
// }
//
// export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home'; // <-- Trang chủ Landing Page
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
import Orders from './pages/Orders';
import Reservations from './pages/Reservations'; // <-- Trang Quản lý Đặt Bàn Trước

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ========================================== */}
                {/* 1. KHU VỰC KHÁCH HÀNG (KHÔNG CẦN ĐĂNG NHẬP) */}
                {/* ========================================== */}
                {/* Trang chủ nhà hàng: Giới thiệu & Đặt bàn trước */}
                <Route path="/" element={<Home />} />

                {/* Trang gọi món dành riêng cho khách ngồi tại bàn */}
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
                        <Route path="/admin/inventory" element={<Inventory />} />
                        <Route path="/admin/purchase-orders" element={<PurchaseOrders />} />
                    </Route>

                    {/* Admin, Phục vụ, Thu ngân */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'waiter', 'cashier']} />}>
                        <Route path="/tables" element={<Tables />} />
                        <Route path="/billing" element={<Billing />} />
                        <Route path="/billing/table/:tableId" element={<Billing />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/reservations" element={<Reservations />} />
                    </Route>

                    {/* Admin và Thu ngân (Quản lý ca làm) */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'cashier']} />}>
                        <Route path="/shifts" element={<Shift />} />
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

