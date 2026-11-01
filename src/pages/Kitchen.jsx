// import { useEffect, useState } from 'react';
// import axiosClient from '../api/axiosClient';
// import { io } from 'socket.io-client';
// import { Clock, CheckCircle2, ChefHat, BellRing } from 'lucide-react';
//
// export default function Kitchen() {
//     const [orders, setOrders] = useState([]);
//     const [socket, setSocket] = useState(null);
//
//     // Hàm lấy dữ liệu đơn hàng
//     const fetchOrders = async () => {
//         try {
//             const res = await axiosClient.get('/kitchen/orders');
//             setOrders(res.data);
//         } catch (error) {
//             console.error(error);
//         }
//     };
//
//     useEffect(() => {
//         fetchOrders();
//
//         // Kết nối Socket
//         const newSocket = io('http://localhost:5000');
//         setSocket(newSocket);
//
//         newSocket.on('new_order', () => {
//             // Phát âm thanh báo chuông
//             const audio = new Audio('https://actions.google.com/sounds/v1/alarms/door_bell.ogg');
//             audio.play().catch(e => console.log('Trình duyệt chặn autoplay', e));
//             fetchOrders(); // Load lại danh sách
//         });
//
//         // Tự động cập nhật lại danh sách mỗi 30s (để nhảy màu thời gian)
//         const interval = setInterval(fetchOrders, 30000);
//
//         return () => {
//             newSocket.close();
//             clearInterval(interval);
//         };
//     }, []);
//
//     const handleUpdateStatus = async (orderItemId, newStatus) => {
//         try {
//             await axiosClient.put(`/kitchen/items/${orderItemId}`, { status: newStatus });
//             setOrders(orders.map(o => o.order_item_id === orderItemId ? { ...o, item_status: newStatus } : o));
//         } catch (error) {
//             alert('Lỗi cập nhật');
//         }
//     };
//
//     // Phân loại món
//     const pendingItems = orders.filter(o => o.item_status === 'pending');
//     const cookingItems = orders.filter(o => o.item_status === 'cooking');
//
//     // Hàm tính toán thời gian chờ và trả về màu sắc tương ứng
//     const getTimeStatus = (createdAt) => {
//         const now = new Date();
//         const created = new Date(createdAt);
//         const diffInMinutes = Math.floor((now - created) / 60000);
//
//         if (diffInMinutes < 10) {
//             // Dưới 10 phút: Màu xanh lá (An toàn)
//             return { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', btn: 'bg-green-600 hover:bg-green-700', timeText: `${diffInMinutes} phút trước` };
//         } else if (diffInMinutes >= 10 && diffInMinutes < 20) {
//             // Từ 10-20 phút: Màu vàng (Cảnh báo)
//             return { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', btn: 'bg-yellow-500 hover:bg-yellow-600', timeText: `${diffInMinutes} phút trước` };
//         } else {
//             // Trên 20 phút: Màu đỏ (Trễ)
//             return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', btn: 'bg-red-600 hover:bg-red-700', timeText: `${diffInMinutes} phút trước` };
//         }
//     };
//
//     // Component hiển thị thẻ món ăn
//     const OrderCard = ({ item }) => {
//         const status = getTimeStatus(item.created_at);
//
//         return (
//             <div className={`p-4 rounded-xl shadow-sm border-l-4 mb-4 ${status.bg} ${status.border}`}>
//                 <div className="flex justify-between items-start border-b border-black/10 pb-2 mb-3">
//                     <div>
//                         <h4 className={`font-black text-lg ${status.text}`}>{item.table_number}</h4>
//                         <p className="text-xs font-semibold text-slate-600">Đơn #{item.order_id}</p>
//                     </div>
//                     <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 bg-white/50 rounded-lg ${status.text}`}>
//                         <Clock size={14} /> {status.timeText}
//                     </div>
//                 </div>
//
//                 <div className="mb-4">
//                     <p className="text-2xl font-black text-slate-800">
//                         <span className={`text-3xl mr-2 ${status.text}`}>{item.quantity}x</span>
//                         {item.item_name}
//                     </p>
//                     {item.note && <p className="text-sm text-red-600 font-bold mt-2 bg-white/50 p-2 rounded">Ghi chú: {item.note}</p>}
//                 </div>
//
//                 <div>
//                     {item.item_status === 'pending' ? (
//                         <button onClick={() => handleUpdateStatus(item.order_item_id, 'cooking')}
//                                 className={`w-full text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 ${status.btn}`}>
//                             <ChefHat size={20} /> Bắt đầu nấu
//                         </button>
//                     ) : (
//                         <button onClick={() => handleUpdateStatus(item.order_item_id, 'served')}
//                                 className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition-colors flex justify-center items-center gap-2">
//                             <CheckCircle2 size={20} /> Hoàn thành
//                         </button>
//                     )}
//                 </div>
//             </div>
//         );
//     };
//
//     return (
//         <div className="h-full flex flex-col bg-slate-50 p-6 rounded-2xl shadow-inner min-h-screen">
//             {/* Header KDS */}
//             <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
//                 <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
//                     <ChefHat size={36} className="text-orange-500" /> MÀN HÌNH BẾP (KDS)
//                 </h1>
//                 <div className="flex gap-4">
//                     <span className="bg-slate-100 px-4 py-2 rounded-lg font-bold text-slate-700">Chờ nấu: <strong className="text-orange-500">{pendingItems.length}</strong></span>
//                     <span className="bg-slate-100 px-4 py-2 rounded-lg font-bold text-slate-700">Đang nấu: <strong className="text-blue-600">{cookingItems.length}</strong></span>
//                 </div>
//             </div>
//
//             {/* Cột hiển thị */}
//             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
//                 {/* Cột Chờ Nấu */}
//                 <div className="bg-white rounded-2xl p-4 flex flex-col border border-slate-200 shadow-sm">
//                     <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-700 border-b pb-3">
//                         <BellRing size={24} className="text-orange-500" /> ĐƠN MỚI CHỜ NẤU
//                     </h2>
//                     <div className="flex-1 overflow-y-auto pr-2">
//                         {pendingItems.map(item => <OrderCard key={item.order_item_id} item={item} />)}
//                         {pendingItems.length === 0 && <p className="text-slate-400 text-center mt-10 font-medium">Không có đơn nào chờ</p>}
//                     </div>
//                 </div>
//
//                 {/* Cột Đang Nấu */}
//                 <div className="bg-white rounded-2xl p-4 flex flex-col border border-slate-200 shadow-sm">
//                     <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600 border-b pb-3">
//                         <ChefHat size={24} /> ĐANG CHẾ BIẾN
//                     </h2>
//                     <div className="flex-1 overflow-y-auto pr-2">
//                         {cookingItems.map(item => <OrderCard key={item.order_item_id} item={item} />)}
//                         {cookingItems.length === 0 && <p className="text-slate-400 text-center mt-10 font-medium">Bếp đang rảnh</p>}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { io } from 'socket.io-client';
import { Clock, CheckCircle2, ChefHat, BellRing, Flame } from 'lucide-react';

const socket = io('http://localhost:5000');

export default function Kitchen() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axiosClient.get('/kitchen/orders');
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();

        socket.on('new_order', () => {
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/door_bell.ogg');
            audio.play().catch(e => console.log('Trình duyệt chặn autoplay', e));
            fetchOrders();
        });

        const interval = setInterval(fetchOrders, 60000); // Cập nhật mỗi phút

        return () => {
            socket.off('new_order');
            clearInterval(interval);
        };
    }, []);

    const handleUpdateStatus = async (orderItemId, newStatus) => {
        try {
            await axiosClient.put(`/kitchen/items/${orderItemId}`, { status: newStatus });
            setOrders(orders.map(o => o.order_item_id === orderItemId ? { ...o, item_status: newStatus } : o));
        } catch (error) {
            alert('Lỗi cập nhật');
        }
    };

    const pendingItems = orders.filter(o => o.item_status === 'pending');
    const cookingItems = orders.filter(o => o.item_status === 'cooking');

    const getTimeStatus = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffInMinutes = Math.floor((now - created) / 60000);

        if (diffInMinutes < 10) {
            return { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', btn: 'bg-green-600 hover:bg-green-700', timeText: `${diffInMinutes} phút trước` };
        } else if (diffInMinutes >= 10 && diffInMinutes < 20) {
            return { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', btn: 'bg-yellow-500 hover:bg-yellow-600', timeText: `${diffInMinutes} phút trước` };
        } else {
            return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', btn: 'bg-red-600 hover:bg-red-700', timeText: `${diffInMinutes} phút trước` };
        }
    };

    const OrderCard = ({ item }) => {
        const status = getTimeStatus(item.created_at);

        return (
            <div className={`p-4 rounded-xl shadow-sm border-l-4 mb-4 ${status.bg} ${status.border}`}>
                <div className="flex justify-between items-start border-b border-black/10 pb-2 mb-3">
                    <div>
                        <h4 className={`font-black text-lg ${status.text}`}>{item.table_number}</h4>
                        <p className="text-xs font-semibold text-slate-600">Đơn #{item.order_id}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 bg-white/50 rounded-lg ${status.text}`}>
                        <Clock size={14} /> {status.timeText}
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-2xl font-black text-slate-800">
                        <span className={`text-3xl mr-2 ${status.text}`}>{item.quantity}x</span>
                        {item.item_name}
                    </p>
                    {item.note && <p className="text-sm text-red-600 font-bold mt-2 bg-white/50 p-2 rounded">Ghi chú: {item.note}</p>}
                </div>

                <div>
                    {item.item_status === 'pending' ? (
                        <button onClick={() => handleUpdateStatus(item.order_item_id, 'cooking')}
                                className={`w-full text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 ${status.btn}`}>
                            <ChefHat size={20} /> Bắt đầu nấu
                        </button>
                    ) : (
                        <button onClick={() => handleUpdateStatus(item.order_item_id, 'served')}
                                className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition-colors flex justify-center items-center gap-2">
                            <CheckCircle2 size={20} /> Hoàn thành & Báo Phục Vụ
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 p-6 rounded-2xl shadow-inner min-h-screen">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Flame size={36} className="text-orange-500" /> BẾP KDS
                </h1>
                <div className="flex gap-4">
                    <span className="bg-slate-100 px-4 py-2 rounded-lg font-bold text-slate-700">Chờ nấu: <strong className="text-orange-500">{pendingItems.length}</strong></span>
                    <span className="bg-slate-100 px-4 py-2 rounded-lg font-bold text-slate-700">Đang nấu: <strong className="text-blue-600">{cookingItems.length}</strong></span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                <div className="bg-white rounded-2xl p-4 flex flex-col border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-700 border-b pb-3">
                        <BellRing size={24} className="text-orange-500" /> ĐƠN MỚI CHỜ NẤU
                    </h2>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {pendingItems.map(item => <OrderCard key={item.order_item_id} item={item} />)}
                        {pendingItems.length === 0 && <p className="text-slate-400 text-center mt-10 font-medium">Không có đơn nào chờ</p>}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 flex flex-col border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600 border-b pb-3">
                        <ChefHat size={24} /> ĐANG CHẾ BIẾN
                    </h2>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {cookingItems.map(item => <OrderCard key={item.order_item_id} item={item} />)}
                        {cookingItems.length === 0 && <p className="text-slate-400 text-center mt-10 font-medium">Bếp đang rảnh</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}