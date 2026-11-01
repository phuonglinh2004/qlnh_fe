import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Package, Eye, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PurchaseOrders() {
    const [history, setHistory] = useState([]);
    const [detail, setDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await axiosClient.get('/admin/purchase-orders');
            setHistory(res.data);
        } catch (err) {
            console.error("Lỗi lấy lịch sử nhập:", err);
        }
    };

    const handleViewDetail = async (poId) => {
        try {
            const res = await axiosClient.get(`/admin/purchase-orders/${poId}`);
            setDetail(res.data);
            setIsDetailOpen(true);
        } catch (err) {
            alert('Lỗi lấy chi tiết phiếu nhập');
        }
    };

    const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '24px 32px', fontFamily: 'sans-serif' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <Link to="/admin/inventory" style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '10px', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem' }}>
                    <ArrowLeft size={16} /> Quản lý kho
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#ea580c', padding: '8px', borderRadius: '10px', color: '#fff' }}>
                        <Package size={22} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>LỊCH SỬ NHẬP KHO</h1>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Danh sách các phiếu nhập nguyên liệu</span>
                    </div>
                </div>
            </div>

            {/* Bảng lịch sử */}
            <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        Chưa có phiếu nhập kho nào
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                        <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '12px 14px' }}>Mã phiếu</th>
                            <th style={{ padding: '12px 14px' }}>Ngày nhập</th>
                            <th style={{ padding: '12px 14px' }}>Người nhập</th>
                            <th style={{ padding: '12px 14px' }}>Nhà cung cấp</th>
                            <th style={{ padding: '12px 14px' }}>Ghi chú</th>
                            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Tổng chi</th>
                            <th style={{ padding: '12px 14px', textAlign: 'center' }}>Chi tiết</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map(po => (
                            <tr key={po.po_id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>#{po.po_id}</td>
                                <td style={{ padding: '14px', color: '#475569' }}>
                                    {new Date(po.created_at).toLocaleString('vi-VN')}
                                </td>
                                <td style={{ padding: '14px', fontWeight: 700, color: '#2563eb' }}>{po.user_name}</td>
                                <td style={{ padding: '14px', color: '#475569' }}>{po.supplier_name || 'Không có'}</td>
                                <td style={{ padding: '14px', color: '#94a3b8', fontSize: '0.85rem' }}>{po.note || '-'}</td>
                                <td style={{ padding: '14px', textAlign: 'right', fontWeight: 900, color: '#059669', fontSize: '1rem' }}>
                                    {formatMoney(po.total_cost)}
                                </td>
                                <td style={{ padding: '14px', textAlign: 'center' }}>
                                    <button onClick={() => handleViewDetail(po.po_id)}
                                            style={{ background: '#eff6ff', color: '#2563eb', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <Eye size={14} /> Xem
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL CHI TIẾT PHIẾU NHẬP */}
            {isDetailOpen && detail && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', width: '600px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                                📦 Chi tiết phiếu nhập #{detail.order.po_id}
                            </h3>
                            <button onClick={() => setIsDetailOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
                            <div style={{ marginBottom: '6px' }}><b>Ngày nhập:</b> {new Date(detail.order.created_at).toLocaleString('vi-VN')}</div>
                            <div style={{ marginBottom: '6px' }}><b>Người nhập:</b> <span style={{ color: '#2563eb', fontWeight: 700 }}>{detail.order.user_name}</span></div>
                            <div style={{ marginBottom: '6px' }}><b>Nhà cung cấp:</b> {detail.order.supplier_name || 'Không có'}</div>
                            <div><b>Ghi chú:</b> {detail.order.note || '-'}</div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                            <thead>
                            <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Nguyên liệu</th>
                                <th style={{ padding: '10px', textAlign: 'center' }}>Số lượng</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Đơn giá</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Thành tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {detail.items.map(item => (
                                <tr key={item.po_item_id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '10px', fontWeight: 700 }}>{item.ingredient_name}</td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        {Number(item.quantity).toLocaleString()} {item.unit}
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right' }}>{formatMoney(item.unit_price)}</td>
                                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                                        {formatMoney(item.quantity * item.unit_price)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr style={{ background: '#f8fafc', borderTop: '2px solid #ea580c' }}>
                                <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>TỔNG CỘNG:</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 900, fontSize: '1.1rem', color: '#ea580c' }}>
                                    {formatMoney(detail.order.total_cost)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}