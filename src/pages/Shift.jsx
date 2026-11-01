import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Play, Square, Clock } from 'lucide-react';

export default function Shift() {
    const [currentShift, setCurrentShift] = useState(null);
    const [startingCash, setStartingCash] = useState(0);
    const userId = 1; // Tạm fix ID Admin

    useEffect(() => { checkShift(); }, []);

    const checkShift = async () => {
        try {
            const res = await axiosClient.get(`/shifts/current/${userId}`);
            setCurrentShift(res.data);
        } catch (error) { console.error(error); }
    };

    const handleOpenShift = async () => {
        try {
            await axiosClient.post('/shifts/open', { user_id: userId, starting_cash: startingCash });
            alert('Đã mở ca!');
            checkShift();
        } catch (error) { alert(error.response?.data?.error); }
    };

    const handleCloseShift = async () => {
        if(!window.confirm('Xác nhận đóng ca và chốt doanh thu?')) return;
        try {
            const res = await axiosClient.post('/shifts/close', { shift_id: currentShift.shift_id });
            alert(`Đã đóng ca. Tổng doanh thu: ${res.data.totalRevenue.toLocaleString()}đ`);
            checkShift();
        } catch (error) { alert('Lỗi đóng ca'); }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Clock className="text-orange-500" /> Quản lý Ca Làm Việc
                </h1>

                {!currentShift ? (
                    <div className="text-center py-10">
                        <p className="text-slate-500 mb-4">Hiện tại chưa có ca làm việc nào đang mở.</p>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-slate-700 mb-1">Tiền mặt đầu ca</label>
                            <input type="number" value={startingCash} onChange={e => setStartingCash(e.target.value)} className="w-full max-w-xs mx-auto p-2 border rounded-xl text-center focus:ring-2 focus:ring-orange-500 outline-none" />
                        </div>
                        <button onClick={handleOpenShift} className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-green-600 transition">
                            <Play size={20} /> Bắt Đầu Mở Ca
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="bg-orange-50 text-orange-700 p-4 rounded-xl mb-6 border border-orange-200">
                            <p className="font-bold text-lg">Ca đang mở</p>
                            <p className="text-sm">Giờ mở: {new Date(currentShift.start_time).toLocaleString('vi-VN')}</p>
                            <p className="text-sm">Tiền mặt đầu ca: {Number(currentShift.starting_cash).toLocaleString()}đ</p>
                        </div>
                        <button onClick={handleCloseShift} className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-red-600 transition">
                            <Square size={20} /> Kết Thúc & Đóng Ca
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}