// import { useState, useEffect } from 'react';
// import axiosClient from '../api/axiosClient';
// import { Plus, Tag } from 'lucide-react';
//
// export default function Voucher() {
//     const [vouchers, setVouchers] = useState([]);
//     const [formData, setFormData] = useState({ code: '', discount_percent: 10, min_order_value: 0 });
//
//     useEffect(() => { loadVouchers(); }, []);
//
//     const loadVouchers = async () => {
//         const res = await axiosClient.get('/admin/vouchers');
//         setVouchers(res.data);
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axiosClient.post('/admin/vouchers', formData);
//             alert('Tạo voucher thành công!');
//             setFormData({ code: '', discount_percent: 10, min_order_value: 0 });
//             loadVouchers();
//         } catch (error) { alert('Lỗi!'); }
//     };
//
//     return (
//         <div style={{ padding: '24px' }}>
//             <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px' }}>Quản lý Voucher</h1>
//             <div style={{ display: 'flex', gap: '24px' }}>
//                 {/* Form thêm voucher */}
//                 <div style={{ flex: 1, background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
//                     <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Tag size={20} /> Tạo Voucher Mới</h3>
//                     <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                         <input type="text" placeholder="Mã code (VD: GIAM20)" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
//                         <input type="number" placeholder="Giảm giá (%)" required value={formData.discount_percent} onChange={e => setFormData({...formData, discount_percent: Number(e.target.value)})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
//                         <input type="number" placeholder="Giá trị đơn tối thiểu" value={formData.min_order_value} onChange={e => setFormData({...formData, min_order_value: Number(e.target.value)})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
//                         <button type="submit" style={{ background: '#ea580c', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Tạo Voucher</button>
//                     </form>
//                 </div>
//                 {/* Danh sách voucher */}
//                 <div style={{ flex: 2, background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
//                     <h3 style={{ marginBottom: '16px' }}>Danh sách Voucher</h3>
//                     <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
//                         <thead><tr style={{ borderBottom: '1px solid #e2e8f0' }}><th style={{ padding: '12px' }}>Mã</th><th style={{ padding: '12px' }}>Giảm giá</th><th style={{ padding: '12px' }}>Đơn tối thiểu</th></tr></thead>
//                         <tbody>
//                         {vouchers.map(v => (
//                             <tr key={v.voucher_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                                 <td style={{ padding: '12px', fontWeight: 700, color: '#ea580c' }}>{v.code}</td>
//                                 <td style={{ padding: '12px' }}>{v.discount_percent}%</td>
//                                 <td style={{ padding: '12px' }}>{v.min_order_value.toLocaleString()}đ</td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Tag, Megaphone, Plus, CheckCircle2 } from 'lucide-react';

export default function Voucher() {
    const [vouchers, setVouchers] = useState([]);
    const [marqueeText, setMarqueeText] = useState('');

    // State cho form voucher
    const [formData, setFormData] = useState({ code: '', discount_percent: '', min_order_value: 0 });

    useEffect(() => {
        fetchVouchers();
        axiosClient.get('/settings/marquee').then(res => setMarqueeText(res.data.text));
    }, []);

    const fetchVouchers = async () => {
        const res = await axiosClient.get('/admin/vouchers');
        setVouchers(res.data);
    };

    const handleCreateVoucher = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/admin/vouchers', formData);
            alert('Tạo Voucher thành công!');
            setFormData({ code: '', discount_percent: '', min_order_value: 0 });
            fetchVouchers();
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    };

    const handleUpdateMarquee = async () => {
        try {
            await axiosClient.put('/admin/settings/marquee', { text: marqueeText });
            alert('Đã cập nhật câu quảng cáo!');
        } catch (error) {
            alert('Lỗi cập nhật quảng cáo');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* PHẦN 1: QUẢNG CÁO CHẠY CHỮ */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Megaphone className="text-orange-500" /> Quảng cáo chạy chữ (Marquee)
                </h2>
                <div className="flex gap-3">
                    <input
                        type="text"
                        className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="VD: Nhập mã D10P giảm 10%..."
                        value={marqueeText}
                        onChange={e => setMarqueeText(e.target.value)}
                    />
                    <button onClick={handleUpdateMarquee} className="bg-orange-500 text-white px-6 rounded-xl font-bold hover:bg-orange-600">
                        Lưu Quảng Cáo
                    </button>
                </div>
            </div>

            {/* PHẦN 2: TẠO VOUCHER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Plus className="text-orange-500" /> Tạo Voucher Mới
                    </h2>
                    <form onSubmit={handleCreateVoucher} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Mã Code</label>
                            <input type="text" required className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none uppercase" placeholder="VD: D10P" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Giảm giá (%)</label>
                            <input type="number" required className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="VD: 10" value={formData.discount_percent} onChange={e => setFormData({...formData, discount_percent: e.target.value})} />
                        </div>
                        <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">
                            Tạo Voucher
                        </button>
                    </form>
                </div>

                {/* DANH SÁCH VOUCHER */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Tag className="text-orange-500" /> Danh sách Voucher
                    </h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                            <th className="p-3 font-semibold">Mã Code</th>
                            <th className="p-3 font-semibold">Giảm giá</th>
                            <th className="p-3 font-semibold">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {vouchers.map(v => (
                            <tr key={v.voucher_id} className="border-b border-slate-100">
                                <td className="p-3 font-bold text-orange-600">{v.code}</td>
                                <td className="p-3 font-semibold">{v.discount_percent}%</td>
                                <td className="p-3">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit">
                                            <CheckCircle2 size={12} /> Đang hoạt động
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}