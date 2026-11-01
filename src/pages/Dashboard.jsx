// import { useState } from 'react';
//
// export default function Dashboard() {
//     return (
//         <div>
//             <h1 className="mt-2 mb-4">Tổng quan hệ thống</h1>
//
//             <div className="row g-3 mb-4">
//                 <div className="col-md-3">
//                     <div className="card bg-primary text-white h-100">
//                         <div className="card-body">Tổng doanh thu</div>
//                     </div>
//                 </div>
//                 <div className="col-md-3">
//                     <div className="card bg-warning text-white h-100">
//                         <div className="card-body">Đơn hàng mới</div>
//                     </div>
//                 </div>
//                 <div className="col-md-3">
//                     <div className="card bg-success text-white h-100">
//                         <div className="card-body">Khách hàng</div>
//                     </div>
//                 </div>
//                 <div className="col-md-3">
//                     <div className="card bg-danger text-white h-100">
//                         <div className="card-body">Món đang nấu</div>
//                     </div>
//                 </div>
//             </div>
//
//             <div className="card mb-4">
//                 <div className="card-header">
//                     <i className="bi bi-table me-1"></i> Bảng dữ liệu
//                 </div>
//                 <div className="card-body">
//                     <table className="table table-striped">
//                         <thead>
//                         <tr>
//                             <th>Mã đơn</th>
//                             <th>Bàn</th>
//                             <th>Tổng tiền</th>
//                             <th>Trạng thái</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         <tr><td>#001</td><td>Bàn 01</td><td>150.000đ</td><td><span className="badge bg-success">Đã TT</span></td></tr>
//                         <tr><td>#002</td><td>Bàn 03</td><td>320.000đ</td><td><span className="badge bg-warning text-dark">Chờ TT</span></td></tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function Dashboard() {
    // State cho số liệu thống kê
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        cookingItems: 0,
        recentOrders: []
    });

    // State cho xuất báo cáo
    const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
    const [reportYear, setReportYear] = useState(new Date().getFullYear());
    const [isExporting, setIsExporting] = useState(false);

    // Gọi API lấy số liệu
    useEffect(() => {
        axiosClient.get('/admin/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("Lỗi lấy dashboard:", err));
    }, []);

    // Hàm xuất Excel
    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            const response = await axiosClient.get(
                `/admin/reports/monthly?month=${reportMonth}&year=${reportYear}`,
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `BaoCao_Thang_${reportMonth}_${reportYear}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Lỗi tải báo cáo: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsExporting(false);
        }
    };

    // Hàm format tiền
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Hàm hiển thị trạng thái
    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return <span className="badge bg-success">Đã TT</span>;
            case 'pending': return <span className="badge bg-warning text-dark">Chờ TT</span>;
            case 'preparing': return <span className="badge bg-info text-dark">Đang nấu</span>;
            case 'completed': return <span className="badge bg-primary">Hoàn thành</span>;
            case 'cancelled': return <span className="badge bg-danger">Đã hủy</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    return (
        <div>
            {/* HEADER: Tiêu đề + Nút xuất Excel */}
            <div className="d-flex justify-content-between align-items-center mt-2 mb-4 flex-wrap gap-2">
                <h1 className="mb-0">Tổng quan hệ thống</h1>

                <div className="d-flex align-items-center gap-2">
                    <select
                        className="form-select"
                        style={{ width: 'auto' }}
                        value={reportMonth}
                        onChange={e => setReportMonth(Number(e.target.value))}
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>Tháng {m}</option>
                        ))}
                    </select>
                    <select
                        className="form-select"
                        style={{ width: 'auto' }}
                        value={reportYear}
                        onChange={e => setReportYear(Number(e.target.value))}
                    >
                        {[2024, 2025, 2026, 2027].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <button
                        className="btn btn-success fw-bold d-flex align-items-center gap-2"
                        onClick={handleExportExcel}
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Đang xuất...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-file-earmark-excel"></i>
                                Xuất Excel
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 4 THẺ THỐNG KÊ */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small text-white-50 mb-1">Tổng doanh thu</div>
                                    <h4 className="mb-0 fw-bold">{formatMoney(stats.totalRevenue)}</h4>
                                </div>
                                <i className="bi bi-cash-coin fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small text-white-50 mb-1">Tổng đơn hàng</div>
                                    <h4 className="mb-0 fw-bold">{stats.totalOrders}</h4>
                                </div>
                                <i className="bi bi-receipt fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small text-white-50 mb-1">Khách hàng</div>
                                    <h4 className="mb-0 fw-bold">{stats.totalCustomers}</h4>
                                </div>
                                <i className="bi bi-people fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-danger text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small text-white-50 mb-1">Món đang nấu</div>
                                    <h4 className="mb-0 fw-bold">{stats.cookingItems}</h4>
                                </div>
                                <i className="bi bi-fire fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BẢNG 10 ĐƠN HÀNG GẦN NHẤT */}
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-table me-1"></i> 10 đơn hàng gần nhất</span>
                    <span className="badge bg-secondary">{stats.recentOrders.length} đơn</span>
                </div>
                <div className="card-body p-0">
                    {stats.recentOrders.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                            Chưa có đơn hàng nào
                        </div>
                    ) : (
                        <table className="table table-striped table-hover mb-0">
                            <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Bàn</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stats.recentOrders.map(order => (
                                <tr key={order.order_id}>
                                    <td className="fw-bold">#{order.order_id}</td>
                                    <td>{order.table_number}</td>
                                    <td className="fw-bold text-primary">{formatMoney(order.total_amount)}</td>
                                    <td>{getStatusBadge(order.order_status)}</td>
                                    <td className="text-muted small">
                                        {new Date(order.created_at).toLocaleString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* KHU VỰC BIỂU ĐỒ (Tương lai) */}
            <div className="card">
                <div className="card-body text-center py-5 text-muted">
                    <i className="bi bi-bar-chart-line fs-1 d-block mb-2 opacity-25"></i>
                    <p className="mb-0">Khu vực biểu đồ doanh thu</p>
                    <small>(Có thể tích hợp Recharts/Chart.js sau)</small>
                </div>
            </div>
        </div>
    );
}