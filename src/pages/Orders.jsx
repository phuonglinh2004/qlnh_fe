import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Receipt, X, Clock, ChefHat, CheckCircle2 } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
        // Tự động load lại mỗi 10s để cập nhật trạng thái
        const interval = setInterval(loadOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadOrders = async () => {
        try {
            const res = await axiosClient.get('/orders/active');
            setOrders(res.data);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        }
    };

    const handleViewDetail = async (orderId) => {
        try {
            const res = await axiosClient.get(`/orders/detail/${orderId}`);
            setSelectedOrder(res.data);
        } catch (error) {
            alert('Lỗi lấy chi tiết đơn hàng');
        }
    };

    // Hàm hiển thị trạng thái đơn
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">Chờ nấu</span>;
            case 'preparing': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Đang nấu</span>;
            case 'completed': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Đã xong</span>;
            default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">{status}</span>;
        }
    };

    // Hàm hiển thị trạng thái món (trong popup chi tiết)
    const getItemStatus = (status) => {
        switch (status) {
            case 'pending': return <span className="text-yellow-600 font-bold flex items-center gap-1"><Clock size={14}/> Chờ nấu</span>;
            case 'cooking': return <span className="text-blue-600 font-bold flex items-center gap-1"><ChefHat size={14}/> Đang nấu</span>;
            case 'served': return <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Đã ra</span>;
            case 'cancelled': return <span className="text-red-600 font-bold flex items-center gap-1"><X size={14}/> Đã hủy</span>;
            default: return status;
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quản lý Đơn hàng</h1>
                    <p className="text-slate-500 text-sm mt-1">Theo dõi các đơn đang phục vụ tại nhà hàng</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                    <tr>
                        <th className="p-4 font-semibold">Mã Đơn</th>
                        <th className="p-4 font-semibold">Bàn</th>
                        <th className="p-4 font-semibold">Tổng tiền (tạm tính)</th>
                        <th className="p-4 font-semibold">Trạng thái</th>
                        <th className="p-4 font-semibold text-center">Chi tiết</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-slate-400">
                                Hiện không có đơn hàng nào đang phục vụ
                            </td>
                        </tr>
                    ) : (
                        orders.map(o => (
                            <tr key={o.order_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-800">#{o.order_id}</td>
                                <td className="p-4 font-medium">{o.table_number}</td>
                                <td className="p-4 text-orange-600 font-bold">{Number(o.total_amount).toLocaleString()}đ</td>
                                <td className="p-4">{getStatusBadge(o.order_status)}</td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleViewDetail(o.order_id)}
                                        className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 mx-auto"
                                    >
                                        <Receipt size={16}/> Xem
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* POPUP CHI TIẾT ĐƠN HÀNG */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">
                                Chi tiết Đơn #{selectedOrder.order.order_id}
                            </h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                            <span className="text-blue-800 font-bold text-lg">Bàn: {selectedOrder.order.table_id}</span>
                            <span className="text-blue-800 font-bold text-lg">Tổng: {Number(selectedOrder.order.total_amount).toLocaleString()}đ</span>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {selectedOrder.items.map(item => (
                                <div key={item.order_item_id} className="flex justify-between items-start border-b border-slate-100 pb-3">
                                    <div className="flex-1 pr-4">
                                        <p className="font-bold text-slate-800">{item.item_name}</p>
                                        <p className="text-sm text-slate-500 mt-0.5">Số lượng: <b>{item.quantity}</b> {item.note && `- Ghi chú: ${item.note}`}</p>
                                    </div>
                                    <div className="text-right whitespace-nowrap">
                                        <p className="font-bold text-slate-700 mb-1">{Number(item.item_price * item.quantity).toLocaleString()}đ</p>
                                        {getItemStatus(item.item_status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}