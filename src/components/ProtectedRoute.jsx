// import { Navigate, Outlet } from 'react-router-dom';
//
// // Component này nhận vào danh sách các quyền được phép truy cập
// export default function ProtectedRoute({ allowedRoles }) {
//     // Lấy token và role từ lúc đăng nhập
//     const token = localStorage.getItem('token');
//     const userRole = localStorage.getItem('role');
//
//     // 1. Nếu chưa đăng nhập -> Đá về trang Login
//     if (!token) {
//         return <Navigate to="/" replace />;
//     }
//
//     // 2. Nếu đã đăng nhập nhưng role không nằm trong danh sách cho phép -> Chặn
//     if (allowedRoles && !allowedRoles.includes(userRole)) {
//         // Tùy role mà đá về trang phù hợp
//         if (userRole === 'kitchen') return <Navigate to="/kitchen" replace />;
//         if (userRole === 'waiter' || userRole === 'cashier') return <Navigate to="/tables" replace />;
//         return <Navigate to="/dashboard" replace />;
//     }
//
//     // 3. Hợp lệ thì cho đi tiếp
//     return <Outlet />;
// }

import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // 1. Chưa đăng nhập -> Đá về trang Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Đã đăng nhập nhưng sai quyền -> Đá về trang mặc định của quyền đó
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if (userRole === 'kitchen') return <Navigate to="/kitchen" replace />;
        if (userRole === 'waiter' || userRole === 'cashier') return <Navigate to="/tables" replace />;
        return <Navigate to="/admin" replace />;
    }

    // 3. Hợp lệ -> Cho phép đi tiếp vào trang (dùng Outlet cho cấu trúc Route lồng nhau)
    return <Outlet />;
}