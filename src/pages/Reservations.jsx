import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Calendar, Check, X, Clock, User, Phone, Users } from 'lucide-react';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            const res = await axiosClient.get('/admin/reservations');
            setReservations(res.data);
        } catch (error) {
            console.error("Lỗi tải danh sách đặt bàn:", error);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axiosClient.put(`/admin/reservations/${id}/status`, { status });
            alert(status === 'confirmed' ? 'Đã duyệt đơn đặt bàn!' : 'Đã hủy lịch đặt bàn!');
            loadReservations();
        } catch (error) {
            alert(error.response?.data?.error || 'Lỗi cập nhật');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12}/> Chờ duyệt</span>;
            case 'confirmed':
                return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Check size={12}/> Đã duyệt</span>;
            case 'cancelled':
                return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><X size={12}/> Đã hủy</span>;
            default:
                return status;
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="text-orange-500" /> Quản lý Đặt Bàn Trước
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Xem và xác nhận các yêu cầu đặt bàn từ khách hàng</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                    <tr>
                        <th className="p-4 font-semibold">Khách hàng</th>
                        <th className="p-4 font-semibold">Số ĐT</th>
                        <th className="p-4 font-semibold">Số khách</th>
                        <th className="p-4 font-semibold">Thời gian đến</th>
                        <th className="p-4 font-semibold">Ghi chú</th>
                        <th className="p-4 font-semibold">Trạng thái</th>
                        <th className="p-4 font-semibold text-center">Xử lý</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="p-8 text-center text-slate-400">
                                Hiện chưa có yêu cầu đặt bàn nào
                            </td>
                        </tr>
                    ) : (
                        reservations.map(r => (
                            <tr key={r.reservation_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                                    <User size={16} className="text-slate-400"/> {r.customer_name || 'Khách vãng lai'}
                                </td>
                                <td className="p-4 font-medium text-slate-600">
                                    <span className="flex items-center gap-1"><Phone size={14} className="text-slate-400"/> {r.customer_phone}</span>
                                </td>
                                <td className="p-4 font-bold text-slate-700">
                                    <span className="flex items-center gap-1"><Users size={14} className="text-slate-400"/> {r.guest_count} người</span>
                                </td>
                                <td className="p-4 text-slate-800 font-medium">
                                    {new Date(r.reservation_time).toLocaleString('vi-VN')}
                                </td>
                                <td className="p-4 text-sm text-slate-500 max-w-xs truncate">
                                    {r.note || '-'}
                                </td>
                                <td className="p-4">{getStatusBadge(r.status)}</td>
                                <td className="p-4 text-center">
                                    {r.status === 'pending' && (
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(r.reservation_id, 'confirmed')}
                                                className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition flex items-center gap-1 shadow-sm"
                                            >
                                                <Check size={14}/> Duyệt
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(r.reservation_id, 'cancelled')}
                                                className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition flex items-center gap-1"
                                            >
                                                <X size={14}/> Hủy
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}