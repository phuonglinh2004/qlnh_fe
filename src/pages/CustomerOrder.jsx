import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ShoppingCart, Plus, Minus, CheckCircle2, X, Search } from 'lucide-react';

export default function CustomerOrder() {
    const [searchParams] = useSearchParams();
    const tableId = searchParams.get('table_id') || 1;

    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [isOrdered, setIsOrdered] = useState(false);

    // Dùng cho mobile
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        axiosClient.get('/menu/public').then(res => setMenuItems(res.data)).catch(console.error);
    }, []);

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

    const handleOrder = async () => {
        if (cart.length === 0) return alert('Vui lòng chọn món!');
        try {
            await axiosClient.post('/orders/public', {
                table_id: tableId,
                items: cart.map(c => ({ item_id: c.item_id, quantity: c.quantity, note: '' }))
            });
            setIsOrdered(true);
            if (window.innerWidth < 768) setIsCartOpen(false);
        } catch (error) {
            alert('Lỗi gửi đơn: ' + error.message);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const categories = ['Tất cả', ...new Set(menuItems.map(item => item.category_name).filter(Boolean))];
    const filteredItems = activeCategory === 'Tất cả' ? menuItems : menuItems.filter(i => i.category_name === activeCategory);

    if (isOrdered) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 p-6 text-center">
                <CheckCircle2 size={80} className="text-emerald-500 mb-6 animate-bounce" />
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Đặt món thành công!</h1>
                <p className="text-slate-600 mb-8 px-4">Món ăn của bạn đang được nhà bếp chuẩn bị. Vui lòng đợi trong giây lát.</p>
                <button onClick={() => { setIsOrdered(false); setCart([]); }} className="bg-emerald-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-600 transition-colors">
                    Gọi thêm món
                </button>
            </div>
        );
    }

    // Component Giỏ Hàng
    const CartContent = () => (
        <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-10">
                        <ShoppingCart size={48} className="mb-2 opacity-20"/>
                        <p>Chưa chọn món nào</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.item_id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex-1 pr-2">
                                <p className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</p>
                                <p className="text-blue-600 text-xs font-bold mt-1">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 rounded-lg border border-slate-200 p-1">
                                <button onClick={() => removeFromCart(item)} className="p-1 hover:bg-white rounded text-slate-600 transition-colors"><Minus size={14}/></button>
                                <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                                <button onClick={() => addToCart(item)} className="p-1 hover:bg-white rounded text-slate-600 transition-colors"><Plus size={14}/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-5 border-t bg-white shrink-0">
                <div className="flex justify-between items-end mb-4">
                    <span className="font-medium text-slate-500">Tổng thanh toán:</span>
                    <span className="text-2xl font-black text-blue-600">{new Intl.NumberFormat('vi-VN').format(cartTotal)}đ</span>
                </div>
                <button onClick={handleOrder} disabled={cart.length === 0} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 flex justify-center items-center gap-2">
                    <CheckCircle2 size={20} /> Gửi xuống Bếp
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center p-0 md:p-6">
            {/* Container chính */}
            <div className="w-full max-w-[1400px] bg-white shadow-xl rounded-none md:rounded-3xl overflow-hidden flex flex-col md:flex-row h-screen md:h-[90vh]">

                {/* CỘT TRÁI: MENU */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="bg-white p-4 md:p-6 border-b border-slate-200 shrink-0 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Thực đơn nhà hàng</h1>
                            <p className="text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-lg mt-2">Bạn đang ngồi tại Bàn {tableId}</p>
                        </div>
                        <button onClick={() => setIsCartOpen(true)} className="md:hidden relative p-3 bg-slate-100 rounded-full">
                            <ShoppingCart size={24} className="text-slate-700" />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
                        </button>
                    </header>

                    {/* Tabs Danh mục (Sửa lỗi thanh cuộn) */}
                    <div className="p-3 md:px-6 bg-white border-b border-slate-200 shrink-0">
                        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-slate-300">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm md:text-base font-bold transition-all border ${
                                        activeCategory === cat
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Danh sách món (Lưới 2-4 cột tùy màn hình) */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filteredItems.map(item => (
                                <div key={item.item_id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all duration-200 group">
                                    <div className="relative h-40 md:h-48 w-full overflow-hidden">
                                        <img
                                            src={item.image_url || 'https://placehold.co/400x300?text=No+Image'}
                                            onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-3 md:p-4 flex flex-col flex-1">
                                        <h4 className="font-bold text-base text-slate-800 line-clamp-2 flex-1 leading-tight">{item.name}</h4>
                                        <div className="flex justify-between items-center mt-3">
                                            <p className="text-blue-600 font-black text-lg">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                                            <button onClick={() => addToCart(item)} className="bg-blue-50 text-blue-600 p-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-colors active:scale-90">
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: GIỎ HÀNG (Hiển thị mặc định trên máy tính) */}
                <div className="hidden md:flex w-96 flex-col border-l border-slate-200 bg-white shrink-0">
                    <div className="p-5 border-b bg-white flex justify-between items-center shrink-0">
                        <h3 className="font-black text-xl text-slate-800 flex items-center gap-2"><ShoppingCart size={24} /> Giỏ hàng</h3>
                        <span className="text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{cartCount} món</span>
                    </div>
                    <CartContent />
                </div>

            </div>

            {/* MOBILE BOTTOM BAR */}
            {cart.length > 0 && !isCartOpen && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] flex justify-between items-center z-40">
                    <div>
                        <p className="text-xs text-slate-500 font-medium">Tổng cộng</p>
                        <p className="text-xl font-black text-blue-600">{new Intl.NumberFormat('vi-VN').format(cartTotal)}đ</p>
                    </div>
                    <button onClick={() => setIsCartOpen(true)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2">
                        <ShoppingCart size={20} /> Xem giỏ ({cartCount})
                    </button>
                </div>
            )}

            {/* MOBILE CART POPUP */}
            {isCartOpen && (
                <div className="md:hidden fixed inset-0 bg-black/60 z-50 flex flex-col justify-end">
                    <div className="bg-white rounded-t-3xl w-full max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center bg-white rounded-t-3xl shrink-0">
                            <h3 className="font-bold text-xl text-slate-800">Giỏ hàng</h3>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <CartContent />
                    </div>
                </div>
            )}
        </div>
    );
}