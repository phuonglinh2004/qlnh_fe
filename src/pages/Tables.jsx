import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, User, X, Plus, Minus, ShoppingCart, Search } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function Tables() {
    const tables = [
        { id: 1, name: 'Bàn 01', capacity: 2, status: 'available' },
        { id: 2, name: 'Bàn 02', capacity: 4, status: 'occupied' },
        { id: 3, name: 'Bàn 03', capacity: 4, status: 'waiting_payment' },
        { id: 4, name: 'Bàn 04', capacity: 6, status: 'available' },
        { id: 5, name: 'Bàn 05', capacity: 8, status: 'occupied' },
        { id: 6, name: 'Bàn 06', capacity: 2, status: 'available' },
    ];

    const [selectedTable, setSelectedTable] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [searchTerm, setSearchTerm] = useState('');

    // State cho Hóa đơn
    const [billData, setBillData] = useState(null);
    const [qrUrl, setQrUrl] = useState('');

    useEffect(() => {
        if (selectedTable) {
            axiosClient.get('/menu').then(res => setMenuItems(res.data)).catch(console.error);
        }
    }, [selectedTable]);

    const addToCart = (item) => {
        const existing = cart.find(c => c.item_id === item.item_id);
        if (existing) {
            setCart(cart.map(c => c.item_id === item.item_id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (item) => {
        const existing = cart.find(c => c.item_id === item.item_id);
        if (existing.quantity === 1) {
            setCart(cart.filter(c => c.item_id !== item.item_id));
        } else {
            setCart(cart.map(c => c.item_id === item.item_id ? { ...c, quantity: c.quantity - 1 } : c));
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Vui lòng chọn món!');
        try {
            await axiosClient.post('/orders', {
                table_id: selectedTable.id,
                items: cart.map(c => ({ item_id: c.item_id, quantity: c.quantity, note: '' }))
            });
            alert('Đã gửi đơn xuống Bếp!');
            setSelectedTable(null); setCart([]); setActiveCategory('Tất cả');
            window.location.reload();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleOpenBill = async (table) => {
        try {
            const res = await axiosClient.get(`/tables/${table.id}/bill`);
            setBillData(res.data);
            const qrRes = await axiosClient.get(`/orders/${res.data.order.order_id}/qr`);
            setQrUrl(qrRes.data.qrUrl);
        } catch (error) {
            alert(error.response?.data?.message || "Bàn này chưa có hóa đơn!");
        }
    };

    const handlePaymentConfirm = async (method) => {
        if (!window.confirm('Xác nhận đã thu tiền và hoàn tất?')) return;
        try {
            await axiosClient.post('/checkout', {
                tableId: billData.order.table_id,
                orderId: billData.order.order_id,
                paymentMethod: method
            });
            alert('Thanh toán thành công!');
            setBillData(null); setQrUrl('');
            window.location.reload();
        } catch (error) {
            alert('Lỗi thanh toán: ' + error.message);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const categories = ['Tất cả', ...new Set(menuItems.map(item => item.category_name).filter(Boolean))];

    // Lọc theo danh mục và tìm kiếm
    const filteredItems = menuItems.filter(item => {
        const matchCategory = activeCategory === 'Tất cả' || item.category_name === activeCategory;
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    // --- GIAO DIỆN SƠ ĐỒ BÀN ---
    const getTableStyle = (status) => {
        switch (status) {
            case 'available': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', chair: 'bg-emerald-200' };
            case 'occupied': return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', chair: 'bg-rose-200' };
            case 'waiting_payment': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', chair: 'bg-amber-200' };
            default: return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', chair: 'bg-slate-200' };
        }
    };

    const TableVisual = ({ status, capacity }) => {
        const style = getTableStyle(status);
        return (
            <div className="relative flex items-center justify-center w-24 h-24 my-2">
                <div className={`absolute left-0 w-3 h-8 rounded-full ${style.chair}`}></div>
                <div className={`absolute right-0 w-3 h-8 rounded-full ${style.chair}`}></div>
                {capacity > 4 && (
                    <>
                        <div className={`absolute top-0 w-8 h-3 rounded-full ${style.chair}`}></div>
                        <div className={`absolute bottom-0 w-8 h-3 rounded-full ${style.chair}`}></div>
                    </>
                )}
                <div className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center bg-white shadow-sm ${style.border}`}>
                    <span className={`text-lg font-bold ${style.text}`}>{capacity}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto relative h-full">
            {/* Header Sơ đồ bàn */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sơ đồ bàn ăn</h1>
                    <p className="text-slate-500 text-sm mt-1">Chạm vào bàn để gọi món hoặc thanh toán</p>
                </div>
                <div className="flex gap-4 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-sm font-medium">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Trống</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-400"></div> Có khách</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Chờ TT</div>
                </div>
            </div>

            {/* Grid Bàn ăn */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {tables.map(table => {
                    const style = getTableStyle(table.status);
                    return (
                        <div
                            key={table.id}
                            onClick={() => {
                                if (table.status === 'available') { setSelectedTable(table); setCart([]); }
                                else { handleOpenBill(table); }
                            }}
                            className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${style.bg} ${style.border} flex flex-col items-center`}
                        >
                            <h3 className={`text-lg font-bold ${style.text}`}>{table.name}</h3>
                            <TableVisual status={table.status} capacity={table.capacity} />
                            <div className={`mt-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white shadow-sm flex items-center gap-1.5 ${style.text}`}>
                                {table.status === 'available' && <CheckCircle2 size={14} />}
                                {table.status === 'occupied' && <User size={14} />}
                                {table.status === 'waiting_payment' && <Clock size={14} />}
                                {table.status === 'available' ? 'Bàn trống' : table.status === 'occupied' ? 'Đang dùng' : 'Chờ TT'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ================= POPUP GỌI MÓN (GIAO DIỆN CHUẨN iPOS) ================= */}
            {selectedTable && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-6">
                    <div className="bg-slate-100 rounded-2xl w-full max-w-7xl h-[95vh] md:h-[90vh] flex flex-col overflow-hidden shadow-2xl">

                        {/* Header */}
                        <div className="bg-blue-600 text-white p-3 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold">ORDER - {selectedTable.name}</h2>
                                <button className="bg-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-800 transition-colors">Món ăn</button>
                                <button className="px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors opacity-80">Đồ uống</button>
                            </div>
                            <button onClick={() => setSelectedTable(null)} className="p-2 hover:bg-blue-700 rounded-full transition-colors"><X size={24} /></button>
                        </div>

                        {/* Body Layout */}
                        <div className="flex flex-1 overflow-hidden">

                            {/* CỘT TRÁI: MENU VÀ TÌM KIẾM */}
                            <div className="flex-1 flex flex-col min-w-0 bg-white">
                                {/* Thanh tìm kiếm */}
                                <div className="p-3 border-b flex gap-4 items-center bg-gray-50">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Nhập mã / tên món ăn cần tìm..."
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">Hay dùng</button>
                                </div>

                                {/* Tabs Danh mục */}
                                <div className="flex overflow-x-auto gap-2 p-2 scrollbar-hide border-b bg-white shrink-0">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                                                activeCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Grid Món ăn (Có ảnh, giá, nút +) */}
                                <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {filteredItems.map(item => (
                                            <div key={item.item_id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                                                <div className="relative h-32 md:h-40 overflow-hidden">
                                                    <img src={item.image_url || 'https://placehold.co/400x300?text=No+Image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    <span className="absolute top-2 left-2 bg-blue-600 text-white font-bold px-2 py-1 rounded text-sm shadow">
                                                        {new Intl.NumberFormat('vi-VN').format(item.price / 1000)}k
                                                    </span>
                                                </div>
                                                <div className="p-2 md:p-3 flex flex-col flex-1">
                                                    <h4 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 leading-tight flex-1">{item.name}</h4>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-blue-600 font-bold text-sm md:text-base">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</span>
                                                        <button onClick={() => addToCart(item)} className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                                                            <Plus size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* CỘT PHẢI: HÓA ĐƠN TẠM TÍNH (Giống iPOS) */}
                            <div className="w-80 md:w-96 bg-white border-l border-gray-300 flex flex-col shrink-0 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]">
                                <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><ShoppingCart size={18} /> Hóa đơn tạm tính</h3>
                                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{cart.length} món</span>
                                </div>

                                <div className="flex-1 p-3 overflow-y-auto bg-gray-50/50">
                                    {cart.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <ShoppingCart size={48} className="mb-4 opacity-20"/>
                                            <p>Chưa có món nào</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {cart.map(item => (
                                                <div key={item.item_id} className="flex justify-between items-center bg-white p-2 md:p-3 rounded-lg border border-gray-200 shadow-sm">
                                                    <div className="flex-1 pr-2">
                                                        <p className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</p>
                                                        <p className="text-blue-600 text-xs font-semibold mt-0.5">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 md:gap-2">
                                                        <button onClick={() => removeFromCart(item)} className="p-1 md:p-1.5 bg-gray-100 rounded hover:bg-gray-200 text-gray-600"><Minus size={16}/></button>
                                                        <span className="w-6 md:w-8 text-center font-bold text-sm md:text-base">{item.quantity}</span>
                                                        <button onClick={() => addToCart(item)} className="p-1 md:p-1.5 bg-gray-100 rounded hover:bg-gray-200 text-gray-600"><Plus size={16}/></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer thanh toán */}
                                <div className="p-3 md:p-4 border-t border-gray-300 bg-white">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="font-medium text-gray-500">Tổng cộng:</span>
                                        <span className="text-2xl md:text-3xl font-black text-blue-600">{new Intl.NumberFormat('vi-VN').format(cartTotal)}đ</span>
                                    </div>
                                    <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2">
                                        <CheckCircle2 size={20} /> Gửi xuống Bếp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* POPUP THANH TOÁN (Giữ nguyên) */}
            {billData && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">Hóa đơn thanh toán</h2>
                            <button onClick={() => { setBillData(null); setQrUrl(''); }} className="p-2 hover:bg-slate-200 rounded-full"><X size={24} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="space-y-3 mb-6">
                                {billData.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-slate-800"><span className="font-bold">{item.quantity}x</span> {item.item_name}</span>
                                        <span className="font-semibold text-slate-600">{new Intl.NumberFormat('vi-VN').format(item.item_price * item.quantity)}đ</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center border-t pt-4 mb-6">
                                <span className="font-bold text-lg text-slate-800">Tổng cộng:</span>
                                <span className="font-black text-2xl text-orange-600">{new Intl.NumberFormat('vi-VN').format(billData.order.total_amount)}đ</span>
                            </div>
                            {qrUrl && (
                                <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p className="text-sm text-slate-500 mb-2 font-medium">Quét mã VietQR để chuyển khoản</p>
                                    <img src={qrUrl} alt="VietQR" className="w-64 h-64 object-contain mix-blend-multiply rounded-lg" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-slate-50 flex gap-3">
                            <button onClick={() => handlePaymentConfirm('cash')} className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300">Thu tiền mặt</button>
                            <button onClick={() => handlePaymentConfirm('vietqr')} className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/30">Đã nhận CK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}