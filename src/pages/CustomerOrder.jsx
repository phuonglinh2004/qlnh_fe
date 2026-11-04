// import { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import axiosClient from '../api/axiosClient';
// import { io } from 'socket.io-client';
// import {
//     Minus, Plus, UtensilsCrossed, Bell, X, CheckCircle2, Edit3, Menu, User
// } from 'lucide-react';
// import membershipCard from '../assets/membership.png';
//
// const socket = io('http://localhost:5000');
//
// const SERVICE_OPTIONS = [
//     'Thêm nước đá', 'Chén dĩa / Đũa muỗng', 'Châm thêm nước lẩu',
//     'Khăn lạnh', 'Nhân viên hỗ trợ', 'Yêu cầu tính tiền'
// ];
//
// export default function CustomerOrder() {
//     // Lấy số bàn từ URL (ví dụ: /order/table/1)
//     const { tableId } = useParams();
//     const [searchParams] = useSearchParams();
//
//     // Ưu tiên lấy từ URL, nếu không có thì lấy từ query (?table_id=1), cuối cùng mặc định là 1
//     const finalTableId = tableId || searchParams.get('table_id') || 1;
//
//     const [menuItems, setMenuItems] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('Tất cả');
//     const [selectedSizes, setSelectedSizes] = useState({});
//     const [cart, setCart] = useState({});
//     const [loading, setLoading] = useState(true);
//
//     // STATE MỚI: Lưu câu quảng cáo
//     const [marqueeText, setMarqueeText] = useState('');
//
//     // UI State
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isCartOpen, setIsCartOpen] = useState(false);
//
//     // Phục vụ & Tích điểm
//     const [isCallModalOpen, setIsCallModalOpen] = useState(false);
//     const [callSuccessMsg, setCallSuccessMsg] = useState('');
//     const [customer, setCustomer] = useState(null);
//     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//     const [isRegisterMode, setIsRegisterMode] = useState(false);
//     const [authForm, setAuthForm] = useState({ phone: '', full_name: '', password: '' });
//     const [authError, setAuthError] = useState('');
//     const [isLoadingAuth, setIsLoadingAuth] = useState(false);
//
//     useEffect(() => {
//         // 1. Gọi API lấy Menu
//         axiosClient.get('/menu/public')
//             .then((res) => {
//                 setMenuItems(res.data);
//                 const uniqueCats = ['Tất cả', ...new Set(res.data.map(i => i.category_name).filter(Boolean))];
//                 setCategories(uniqueCats);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error(err);
//                 setLoading(false);
//             });
//
//         // 2. Gọi API lấy câu quảng cáo
//         axiosClient.get('/settings/marquee')
//             .then(res => setMarqueeText(res.data.text))
//             .catch(console.error);
//     }, []);
//
//     const handleAuth = async (e) => {
//         e.preventDefault();
//         setAuthError('');
//         setIsLoadingAuth(true);
//         try {
//             if (isRegisterMode) {
//                 const res = await axiosClient.post('/customer/register', authForm);
//                 setCustomer(res.data.customer);
//                 alert('Đăng ký thành công!');
//             } else {
//                 const res = await axiosClient.post('/customer/login', { phone: authForm.phone, password: authForm.password });
//                 setCustomer(res.data.customer);
//                 alert(`Chào mừng, ${res.data.customer.full_name}!`);
//             }
//             setIsAuthModalOpen(false);
//         } catch (error) {
//             setAuthError(error.response?.data?.error || 'Có lỗi xảy ra.');
//         } finally {
//             setIsLoadingAuth(false);
//         }
//     };
//
//     const getItemDetails = (item) => {
//         if (item.portion_type === 'sizes') {
//             const currentSizeKey = selectedSizes[item.item_id] || 'small';
//             const isLarge = currentSizeKey === 'large';
//             const price = isLarge ? Number(item.large_price) : Number(item.price);
//             const sizeLabel = isLarge ? 'Lớn' : 'Nhỏ';
//             return { cartKey: `${item.item_id}_${currentSizeKey}`, displayName: `${item.name} (${sizeLabel})`, price: price };
//         }
//         return { cartKey: `${item.item_id}`, displayName: `${item.name}`, price: Number(item.price) };
//     };
//
//     const handlePlus = (item) => {
//         const { cartKey, displayName, price } = getItemDetails(item);
//         setCart((prev) => ({
//             ...prev,
//             [cartKey]: {
//                 cartKey, item_id: item.item_id, name: displayName, price: price,
//                 customerNote: prev[cartKey]?.customerNote || '',
//                 quantity: (prev[cartKey]?.quantity || 0) + 1
//             }
//         }));
//         setIsCartOpen(true);
//     };
//
//     const handleMinus = (item) => {
//         const { cartKey } = getItemDetails(item);
//         setCart((prev) => {
//             if (!prev[cartKey]) return prev;
//             const newQty = prev[cartKey].quantity - 1;
//             if (newQty <= 0) {
//                 const copy = { ...prev };
//                 delete copy[cartKey];
//                 if (Object.keys(copy).length === 0) setIsCartOpen(false);
//                 return copy;
//             }
//             return { ...prev, [cartKey]: { ...prev[cartKey], quantity: newQty } };
//         });
//     };
//
//     const handleUpdateNote = (cartKey, noteText) => {
//         setCart((prev) => ({ ...prev, [cartKey]: { ...prev[cartKey], customerNote: noteText } }));
//     };
//
//     const handleSelectSize = (itemId, sizeKey) => {
//         setSelectedSizes((prev) => ({ ...prev, [itemId]: sizeKey }));
//     };
//
//     const selectedItems = Object.values(cart);
//     const totalAmount = selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
//
//     const handleSendOrder = async () => {
//         if (selectedItems.length === 0) return;
//         try {
//             await axiosClient.post('/orders/public', {
//                 table_id: finalTableId,
//                 customer_id: customer ? customer.id : null,
//                 items: selectedItems.map(i => ({ item_id: i.item_id, quantity: i.quantity, note: i.customerNote || '' }))
//             });
//             alert('Đã gửi đơn xuống bếp!');
//             setCart({});
//             setIsCartOpen(false);
//         } catch (err) {
//             alert('Lỗi khi gửi đơn!');
//         }
//     };
//
//     const handleCallStaff = (serviceType) => {
//         socket.emit('call_service', { table_number: `Bàn ${finalTableId}`, type: serviceType });
//         setCallSuccessMsg(`Đã gửi yêu cầu: "${serviceType}"!`);
//         setTimeout(() => { setCallSuccessMsg(''); setIsCallModalOpen(false); }, 1800);
//     };
//
//     const filteredItems = selectedCategory === 'Tất cả'
//         ? menuItems
//         : menuItems.filter(item => item.category_name === selectedCategory);
//
//     // Component Danh sách gọi món
//     const CartContent = () => (
//         <>
//             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
//                 {selectedItems.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
//                         <p className="font-medium">Chưa chọn món nào</p>
//                     </div>
//                 ) : (
//                     selectedItems.map((item) => (
//                         <div key={item.cartKey} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
//                             <div className="flex justify-between items-start mb-2">
//                                 <div>
//                                     <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
//                                     <p className="text-orange-600 font-bold text-sm">{item.price.toLocaleString()}đ</p>
//                                 </div>
//                                 <div className="flex items-center bg-slate-100 rounded-lg p-1">
//                                     <button className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-orange-500" onClick={() => handleMinus(item)}><Minus size={12} strokeWidth={3} /></button>
//                                     <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
//                                     <button className="w-6 h-6 flex items-center justify-center bg-orange-500 rounded shadow-sm text-white hover:bg-orange-600" onClick={() => handlePlus(item)}><Plus size={12} strokeWidth={3} /></button>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
//                                 <Edit3 size={14} className="text-slate-400" />
//                                 <input type="text" placeholder="Ghi chú..." className="text-xs w-full outline-none bg-transparent" value={item.customerNote || ''} onChange={(e) => handleUpdateNote(item.cartKey, e.target.value)} />
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//             <div className="p-4 border-t border-slate-200 bg-white">
//                 <div className="flex justify-between items-end mb-4">
//                     <span className="text-slate-500 font-medium">Tổng thanh toán</span>
//                     <span className="text-2xl font-black text-orange-600">{totalAmount.toLocaleString()}đ</span>
//                 </div>
//                 <button onClick={handleSendOrder} disabled={selectedItems.length === 0} className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50">
//                     Xác nhận gửi bếp
//                 </button>
//             </div>
//         </>
//     );
//
//     return (
//         <div className="h-screen w-full flex overflow-hidden bg-slate-50 font-sans text-slate-800 relative flex-col">
//
//             {/* THANH CHẠY CHỮ QUẢNG CÁO */}
//             {marqueeText && (
//                 <div className="w-full bg-orange-500 text-white font-bold py-2 overflow-hidden whitespace-nowrap z-50 text-sm shrink-0">
//                     <marquee scrollamount="8" className="uppercase tracking-wider">
//                         {marqueeText}
//                     </marquee>
//                 </div>
//             )}
//
//             {/* PHẦN THÂN CÒN LẠI */}
//             <div className="flex-1 flex overflow-hidden relative">
//                 {/* ================= SIDEBAR ================= */}
//                 {isSidebarOpen && (
//                     <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
//                 )}
//
//                 <aside className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-300 z-40 absolute top-0 bottom-0 left-0 w-64 shadow-2xl md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//                     <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0 bg-white">
//                         <div className="flex items-center gap-2">
//                             <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
//                                 <X size={22} />
//                             </button>
//                             <span className="font-black text-lg text-slate-800 tracking-tight uppercase">Danh mục món</span>
//                         </div>
//                     </div>
//                     <div className="p-4 overflow-y-auto flex-1">
//                         <ul className="space-y-1">
//                             {categories.map((cat) => (
//                                 <li key={cat}>
//                                     <button
//                                         onClick={() => {
//                                             setSelectedCategory(cat);
//                                             if (window.innerWidth < 768) setIsSidebarOpen(false);
//                                         }}
//                                         className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
//                                     >
//                                         {cat}
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </aside>
//
//                 {/* ================= CỘT GIỮA ================= */}
//                 <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
//
//                     {/* HEADER: Chữ "Bàn X" nằm chính giữa */}
//                     <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
//                         <div className="flex items-center gap-3 z-10">
//                             <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors">
//                                 <Menu size={22} />
//                             </button>
//                             <div className="flex items-center gap-2">
//                                 <UtensilsCrossed size={20} className="text-orange-500" />
//                                 <span className="font-black text-lg text-orange-600 tracking-tight">RESTO</span>
//                             </div>
//                         </div>
//
//                         {/* Chữ Bàn Nằm Chính Giữa */}
//                         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
//                             <h1 className="font-black text-xl text-slate-800 whitespace-nowrap">Bàn {finalTableId}</h1>
//                         </div>
//
//                         <div className="flex items-center gap-2 z-10">
//                             {customer ? (
//                                 <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
//                                     <span className="text-sm font-bold text-emerald-700"><User size={14} className="inline mr-1"/>{customer.full_name}</span>
//                                 </div>
//                             ) : (
//                                 <button
//                                     onClick={() => setIsAuthModalOpen(true)}
//                                     className="hidden sm:flex items-center gap-2 bg-slate-800 text-yellow-400 px-3 py-1.5 rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors shadow-md"
//                                 >
//                                     <img src={membershipCard} alt="Card" className="w-5 h-5 rounded-sm object-cover" />
//                                     <span>Thẻ Thành Viên</span>
//                                 </button>
//                             )}
//                             <button className="p-2 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100" onClick={() => setIsCallModalOpen(true)}><Bell size={18} /></button>
//                         </div>
//                     </header>
//
//                     {/* Lưới món ăn */}
//                     <div className="flex-1 overflow-y-auto p-4 md:p-6">
//                         {loading ? (
//                             <p className="text-center text-slate-400 mt-10">Đang tải thực đơn...</p>
//                         ) : (
//                             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
//                                 {filteredItems.map((item) => {
//                                     const activeSizeKey = selectedSizes[item.item_id] || 'small';
//                                     const { cartKey, price } = getItemDetails(item);
//                                     const currentQty = cart[cartKey]?.quantity || 0;
//
//                                     return (
//                                         <div key={item.item_id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-3">
//                                             <div className="relative h-32 md:h-44 overflow-hidden bg-slate-100 rounded-xl mb-3">
//                                                 <img
//                                                     src={item.image_url ? new URL(`../assets/${item.image_url}`, import.meta.url).href : 'https://placehold.co/400x300?text=No+Image'}
//                                                     alt={item.name}
//                                                     className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-500"
//                                                     onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
//                                                 />
//                                                 {item.badge === 'bestseller' && <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">BÁN CHẠY</span>}
//                                             </div>
//
//                                             <div className="flex flex-col items-center flex-1">
//                                                 <h3 className="font-bold text-sm md:text-base text-slate-800 line-clamp-2 leading-tight text-center min-h-[40px] flex items-center justify-center mb-1">{item.name}</h3>
//
//                                                 {item.portion_type === 'sizes' && (
//                                                     <div className="flex gap-1 w-full mt-1 mb-2 bg-slate-100 p-1 rounded-lg">
//                                                         <button
//                                                             className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${activeSizeKey === 'small' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
//                                                             onClick={() => handleSelectSize(item.item_id, 'small')}
//                                                         >
//                                                             Nhỏ
//                                                         </button>
//                                                         <button
//                                                             className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${activeSizeKey === 'large' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
//                                                             onClick={() => handleSelectSize(item.item_id, 'large')}
//                                                         >
//                                                             Lớn
//                                                         </button>
//                                                     </div>
//                                                 )}
//
//                                                 <div className="text-orange-600 font-black text-base md:text-lg mb-3">
//                                                     {price.toLocaleString()}đ
//                                                 </div>
//
//                                                 <div className="flex items-center bg-slate-100 rounded-lg p-1.5 justify-center gap-4 mx-auto mt-auto">
//                                                     <button className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-orange-500 disabled:opacity-50" onClick={() => handleMinus(item)} disabled={currentQty === 0}><Minus size={14} strokeWidth={3} /></button>
//                                                     <span className="text-center font-bold text-sm min-w-[20px]">{currentQty}</span>
//                                                     <button className="w-7 h-7 flex items-center justify-center bg-orange-500 rounded shadow-sm text-white hover:bg-orange-600" onClick={() => handlePlus(item)}><Plus size={14} strokeWidth={3} /></button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* ================= CỘT PHẢI ================= */}
//                 <aside className={`bg-white border-l border-slate-200 flex-col hidden md:flex shrink-0 z-20 transition-all duration-300 ease-in-out overflow-hidden ${isCartOpen && selectedItems.length > 0 ? 'w-80 lg:w-96' : 'w-0 border-l-0'}`}>
//                     <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 min-w-[320px] lg:min-w-[384px]">
//                         <h2 className="font-bold text-lg flex items-center gap-2">
//                             <UtensilsCrossed size={20} className="text-orange-500"/> Danh sách gọi món
//                         </h2>
//                     </div>
//                     <div className="w-80 lg:w-96 flex flex-col h-full">
//                         <CartContent />
//                     </div>
//                 </aside>
//             </div>
//
//             {/* MOBILE POPUP */}
//             {isCartOpen && (
//                 <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end">
//                     <div className="bg-white rounded-t-3xl w-full max-h-[90vh] flex flex-col animate-slide-up">
//                         <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-3xl shrink-0">
//                             <h3 className="font-bold text-xl text-slate-800">Danh sách gọi món</h3>
//                             <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
//                         </div>
//                         <CartContent />
//                     </div>
//                 </div>
//             )}
//
//             {/* MODALS */}
//             {isAuthModalOpen && (
//                 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-3xl w-full max-w-[380px] p-0 shadow-2xl relative overflow-hidden animate-slide-up">
//                         <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 text-center relative">
//                             <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 p-1.5 bg-black/10 hover:bg-black/20 text-slate-800 rounded-full transition-colors"><X size={18} /></button>
//                             <div className="w-24 h-16 mx-auto mb-3 shadow-lg rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
//                                 <img src={membershipCard} alt="Membership Card" className="w-full h-full object-contain" />
//                             </div>
//                             <h3 className="font-black text-2xl text-slate-900 tracking-tight">
//                                 {isRegisterMode ? 'Đăng Ký Hội Viên' : 'Đăng Nhập Tích Điểm'}
//                             </h3>
//                         </div>
//                         <div className="p-6">
//                             <form onSubmit={handleAuth} className="space-y-4">
//                                 {isRegisterMode && (
//                                     <div>
//                                         <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Họ và tên</label>
//                                         <input type="text" required placeholder="VD: Nguyễn Văn A..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white transition-colors text-sm" value={authForm.full_name} onChange={e => setAuthForm({ ...authForm, full_name: e.target.value })} />
//                                     </div>
//                                 )}
//                                 <div>
//                                     <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Số điện thoại</label>
//                                     <input type="tel" required placeholder="Nhập số điện thoại..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white transition-colors text-sm" value={authForm.phone} onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Mật khẩu</label>
//                                     <input type="password" required placeholder="Nhập mật khẩu..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white transition-colors text-sm" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} />
//                                 </div>
//                                 {authError && <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg text-center border border-red-100">{authError}</div>}
//                                 <button type="submit" disabled={isLoadingAuth} className="w-full bg-slate-900 text-yellow-400 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-70 shadow-lg flex justify-center items-center mt-2">
//                                     {isLoadingAuth ? 'Đang xử lý...' : (isRegisterMode ? 'Tạo Thẻ Thành Viên' : 'Đăng Nhập')}
//                                 </button>
//                             </form>
//                             <div className="text-center mt-5">
//                                 <button onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); }} className="text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors">
//                                     {isRegisterMode ? 'Đã có thẻ? Đăng nhập' : 'Chưa có thẻ? Đăng ký ngay'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {isCallModalOpen && (
//                 <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="font-bold text-lg flex items-center gap-2"><Bell size={20} className="text-orange-500"/> Gọi Phục Vụ</h3>
//                             <button onClick={() => setIsCallModalOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={18} /></button>
//                         </div>
//                         {callSuccessMsg ? (
//                             <div className="text-center py-6"><CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" /><p className="font-bold text-emerald-600">{callSuccessMsg}</p></div>
//                         ) : (
//                             <div className="grid grid-cols-2 gap-2">
//                                 {SERVICE_OPTIONS.map((opt) => (
//                                     <button key={opt} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors" onClick={() => handleCallStaff(opt)}>{opt}</button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { io } from 'socket.io-client';
import {
    Minus, Plus, UtensilsCrossed, Bell, X, CheckCircle2, Edit3, Menu, User
} from 'lucide-react';
import membershipCard from '../assets/membership.png';

const socket = io('http://localhost:5000');

const SERVICE_OPTIONS = [
    'Thêm nước đá', 'Chén dĩa / Đũa muỗng', 'Châm thêm nước lẩu',
    'Khăn lạnh', 'Nhân viên hỗ trợ', 'Yêu cầu tính tiền'
];

export default function CustomerOrder() {
    // Lấy số bàn từ URL (ví dụ: /order/table/1)
    const { tableId } = useParams();
    const [searchParams] = useSearchParams();

    // Ưu tiên lấy từ URL, nếu không có thì lấy từ query (?table_id=1), cuối cùng mặc định là 1
    const finalTableId = tableId || searchParams.get('table_id') || 1;

    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedSizes, setSelectedSizes] = useState({});
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(true);

    // STATE: Lưu câu quảng cáo
    const [marqueeText, setMarqueeText] = useState('');

    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Phục vụ & Tích điểm
    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    const [callSuccessMsg, setCallSuccessMsg] = useState('');
    const [customer, setCustomer] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [authForm, setAuthForm] = useState({ phone: '', full_name: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [isLoadingAuth, setIsLoadingAuth] = useState(false);

    useEffect(() => {
        // 1. Gọi API lấy Menu
        axiosClient.get('/menu/public')
            .then((res) => {
                setMenuItems(res.data);
                const uniqueCats = ['Tất cả', ...new Set(res.data.map(i => i.category_name).filter(Boolean))];
                setCategories(uniqueCats);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });

        // 2. Gọi API lấy câu quảng cáo
        axiosClient.get('/settings/marquee')
            .then(res => setMarqueeText(res.data.text))
            .catch(console.error);
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError('');
        setIsLoadingAuth(true);
        try {
            if (isRegisterMode) {
                const res = await axiosClient.post('/customer/register', authForm);
                setCustomer(res.data.customer);
                alert('Đăng ký thành công!');
            } else {
                const res = await axiosClient.post('/customer/login', { phone: authForm.phone, password: authForm.password });
                setCustomer(res.data.customer);
                alert(`Chào mừng, ${res.data.customer.full_name}!`);
            }
            setIsAuthModalOpen(false);
        } catch (error) {
            setAuthError(error.response?.data?.error || 'Có lỗi xảy ra.');
        } finally {
            setIsLoadingAuth(false);
        }
    };

    const getItemDetails = (item) => {
        if (item.portion_type === 'sizes') {
            const currentSizeKey = selectedSizes[item.item_id] || 'small';
            const isLarge = currentSizeKey === 'large';
            const price = isLarge ? Number(item.large_price) : Number(item.price);
            const sizeLabel = isLarge ? 'Lớn' : 'Nhỏ';
            return { cartKey: `${item.item_id}_${currentSizeKey}`, displayName: `${item.name} (${sizeLabel})`, price: price };
        }
        return { cartKey: `${item.item_id}`, displayName: `${item.name}`, price: Number(item.price) };
    };

    const handlePlus = (item) => {
        const { cartKey, displayName, price } = getItemDetails(item);
        setCart((prev) => ({
            ...prev,
            [cartKey]: {
                cartKey, item_id: item.item_id, name: displayName, price: price,
                customerNote: prev[cartKey]?.customerNote || '',
                quantity: (prev[cartKey]?.quantity || 0) + 1
            }
        }));
        setIsCartOpen(true);
    };

    const handleMinus = (item) => {
        const { cartKey } = getItemDetails(item);
        setCart((prev) => {
            if (!prev[cartKey]) return prev;
            const newQty = prev[cartKey].quantity - 1;
            if (newQty <= 0) {
                const copy = { ...prev };
                delete copy[cartKey];
                if (Object.keys(copy).length === 0) setIsCartOpen(false);
                return copy;
            }
            return { ...prev, [cartKey]: { ...prev[cartKey], quantity: newQty } };
        });
    };

    const handleUpdateNote = (cartKey, noteText) => {
        setCart((prev) => ({ ...prev, [cartKey]: { ...prev[cartKey], customerNote: noteText } }));
    };

    const handleSelectSize = (itemId, sizeKey) => {
        setSelectedSizes((prev) => ({ ...prev, [itemId]: sizeKey }));
    };

    const selectedItems = Object.values(cart);
    const totalAmount = selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    const handleSendOrder = async () => {
        if (selectedItems.length === 0) return;
        try {
            await axiosClient.post('/orders/public', {
                table_id: finalTableId,
                customer_id: customer ? customer.id : null,
                items: selectedItems.map(i => ({ item_id: i.item_id, quantity: i.quantity, note: i.customerNote || '' }))
            });
            alert('Đã gửi đơn xuống bếp!');
            setCart({});
            setIsCartOpen(false);
        } catch (err) {
            alert('Lỗi khi gửi đơn!');
        }
    };

    const handleCallStaff = (serviceType) => {
        socket.emit('call_service', { table_number: `Bàn ${finalTableId}`, type: serviceType });
        setCallSuccessMsg(`Đã gửi yêu cầu: "${serviceType}"!`);
        setTimeout(() => { setCallSuccessMsg(''); setIsCallModalOpen(false); }, 1800);
    };

    const filteredItems = selectedCategory === 'Tất cả'
        ? menuItems
        : menuItems.filter(item => item.category_name === selectedCategory);

    // Component Danh sách gọi món
    const CartContent = () => (
        <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {selectedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
                        <p className="font-medium">Chưa chọn món nào</p>
                    </div>
                ) : (
                    selectedItems.map((item) => (
                        <div key={item.cartKey} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                                    <p className="text-orange-600 font-bold text-sm">{item.price.toLocaleString()}đ</p>
                                </div>
                                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                    <button className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-orange-500" onClick={() => handleMinus(item)}><Minus size={12} strokeWidth={3} /></button>
                                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                    <button className="w-6 h-6 flex items-center justify-center bg-orange-500 rounded shadow-sm text-white hover:bg-orange-600" onClick={() => handlePlus(item)}><Plus size={12} strokeWidth={3} /></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
                                <Edit3 size={14} className="text-slate-400" />
                                <input type="text" placeholder="Ghi chú..." className="text-xs w-full outline-none bg-transparent" value={item.customerNote || ''} onChange={(e) => handleUpdateNote(item.cartKey, e.target.value)} />
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-slate-500 font-medium">Tổng thanh toán</span>
                    <span className="text-2xl font-black text-orange-600">{totalAmount.toLocaleString()}đ</span>
                </div>
                <button onClick={handleSendOrder} disabled={selectedItems.length === 0} className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50">
                    Xác nhận gửi bếp
                </button>
            </div>
        </>
    );

    return (
        <div className="h-screen w-full flex overflow-hidden bg-slate-50 font-sans text-slate-800 relative flex-col">

            {/* THANH CHẠY CHỮ QUẢNG CÁO */}
            {marqueeText && (
                <div className="w-full bg-orange-500 text-white font-bold py-2 overflow-hidden whitespace-nowrap z-50 text-sm shrink-0">
                    <marquee scrollamount="8" className="uppercase tracking-wider">
                        {marqueeText}
                    </marquee>
                </div>
            )}

            {/* PHẦN THÂN CÒN LẠI */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* ================= SIDEBAR ================= */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
                )}

                <aside className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-300 z-40 absolute top-0 bottom-0 left-0 w-64 shadow-2xl md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0 bg-white">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
                                <X size={22} />
                            </button>
                            <span className="font-black text-lg text-slate-800 tracking-tight uppercase">Danh mục món</span>
                        </div>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1">
                        <ul className="space-y-1">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* ================= CỘT GIỮA ================= */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">

                    {/* HEADER */}
                    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
                        <div className="flex items-center gap-3 z-10">
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors">
                                <Menu size={22} />
                            </button>
                            <div className="flex items-center gap-2">
                                <UtensilsCrossed size={20} className="text-orange-500" />
                                <span className="font-black text-lg text-orange-600 tracking-tight">RESTO</span>
                            </div>
                        </div>

                        {/* Chữ Bàn Nằm Chính Giữa */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                            <h1 className="font-black text-xl text-slate-800 whitespace-nowrap">Bàn {finalTableId}</h1>
                        </div>

                        <div className="flex items-center gap-2 z-10">
                            {customer ? (
                                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                                    <span className="text-sm font-bold text-emerald-700"><User size={14} className="inline mr-1"/>{customer.full_name}</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="hidden sm:flex items-center gap-2 bg-slate-800 text-yellow-400 px-3 py-1.5 rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors shadow-md"
                                >
                                    <img src={membershipCard} alt="Card" className="w-5 h-5 rounded-sm object-cover" />
                                    <span>Thẻ Thành Viên</span>
                                </button>
                            )}

                            {/* Nút Gọi Phục Vụ Màu Đỏ Nổi Bật */}
                            <button
                                onClick={() => setIsCallModalOpen(true)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-colors"
                            >
                                <Bell size={18} />
                                <span>Gọi Phục Vụ</span>
                            </button>
                        </div>
                    </header>

                    {/* Lưới món ăn */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        {loading ? (
                            <p className="text-center text-slate-400 mt-10">Đang tải thực đơn...</p>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                                {filteredItems.map((item) => {
                                    const activeSizeKey = selectedSizes[item.item_id] || 'small';
                                    const { cartKey, price } = getItemDetails(item);
                                    const currentQty = cart[cartKey]?.quantity || 0;

                                    return (
                                        <div key={item.item_id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-3">
                                            <div className="relative h-32 md:h-44 overflow-hidden bg-slate-100 rounded-xl mb-3">
                                                <img
                                                    src={item.image_url ? new URL(`../assets/${item.image_url}`, import.meta.url).href : 'https://placehold.co/400x300?text=No+Image'}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                                                />
                                                {item.badge === 'bestseller' && <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">BÁN CHẠY</span>}
                                            </div>

                                            <div className="flex flex-col items-center flex-1">
                                                <h3 className="font-bold text-sm md:text-base text-slate-800 line-clamp-2 leading-tight text-center min-h-[40px] flex items-center justify-center mb-1">{item.name}</h3>

                                                {item.portion_type === 'sizes' && (
                                                    <div className="flex gap-1 w-full mt-1 mb-2 bg-slate-100 p-1 rounded-lg">
                                                        <button
                                                            className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${activeSizeKey === 'small' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                                                            onClick={() => handleSelectSize(item.item_id, 'small')}
                                                        >
                                                            Nhỏ
                                                        </button>
                                                        <button
                                                            className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${activeSizeKey === 'large' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                                                            onClick={() => handleSelectSize(item.item_id, 'large')}
                                                        >
                                                            Lớn
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="text-orange-600 font-black text-base md:text-lg mb-3">
                                                    {price.toLocaleString()}đ
                                                </div>

                                                <div className="flex items-center bg-slate-100 rounded-lg p-1.5 justify-center gap-4 mx-auto mt-auto">
                                                    <button className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-orange-500 disabled:opacity-50" onClick={() => handleMinus(item)} disabled={currentQty === 0}><Minus size={14} strokeWidth={3} /></button>
                                                    <span className="text-center font-bold text-sm min-w-[20px]">{currentQty}</span>
                                                    <button className="w-7 h-7 flex items-center justify-center bg-orange-500 rounded shadow-sm text-white hover:bg-orange-600" onClick={() => handlePlus(item)}><Plus size={14} strokeWidth={3} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= CỘT PHẢI ================= */}
                <aside className={`bg-white border-l border-slate-200 flex-col hidden md:flex shrink-0 z-20 transition-all duration-300 ease-in-out overflow-hidden ${isCartOpen && selectedItems.length > 0 ? 'w-80 lg:w-96' : 'w-0 border-l-0'}`}>
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 min-w-[320px] lg:min-w-[384px]">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <UtensilsCrossed size={20} className="text-orange-500"/> Danh sách gọi món
                        </h2>
                    </div>
                    <div className="w-80 lg:w-96 flex flex-col h-full">
                        <CartContent />
                    </div>
                </aside>
            </div>

            {/* MOBILE POPUP GIỎ HÀNG */}
            {isCartOpen && (
                <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end">
                    <div className="bg-white rounded-t-3xl w-full max-h-[90vh] flex flex-col animate-slide-up">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-3xl shrink-0">
                            <h3 className="font-bold text-xl text-slate-800">Danh sách gọi món</h3>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <CartContent />
                    </div>
                </div>
            )}

            {/* MODAL HỘI VIÊN / TÍCH ĐIỂM */}
            {isAuthModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-[380px] p-0 shadow-2xl relative overflow-hidden animate-slide-up">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 text-center relative">
                            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 p-1.5 bg-black/10 hover:bg-black/20 text-slate-800 rounded-full transition-colors"><X size={18} /></button>
                            <div className="w-24 h-16 mx-auto mb-3 shadow-lg rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                                <img src={membershipCard} alt="Membership Card" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight">
                                {isRegisterMode ? 'Đăng Ký Hội Viên' : 'Đăng Nhập Tích Điểm'}
                            </h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAuth} className="space-y-4">
                                {isRegisterMode && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Họ và tên</label>
                                        <input type="text" required placeholder="VD: Nguyễn Văn A..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white transition-colors text-sm" value={authForm.full_name} onChange={e => setAuthForm({ ...authForm, full_name: e.target.value })} />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Số điện thoại</label>
                                    <input type="tel" required placeholder="Nhập số điện thoại..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white transition-colors text-sm" value={authForm.phone} onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Mật khẩu</label>
                                    <input type="password" required placeholder="Nhập mật khẩu..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white transition-colors text-sm" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} />
                                </div>
                                {authError && <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg text-center border border-red-100">{authError}</div>}
                                <button type="submit" disabled={isLoadingAuth} className="w-full bg-slate-900 text-yellow-400 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-70 shadow-lg flex justify-center items-center mt-2">
                                    {isLoadingAuth ? 'Đang xử lý...' : (isRegisterMode ? 'Tạo Thẻ Thành Viên' : 'Đăng Nhập')}
                                </button>
                            </form>
                            <div className="text-center mt-5">
                                <button onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); }} className="text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors">
                                    {isRegisterMode ? 'Đã có thẻ? Đăng nhập' : 'Chưa có thẻ? Đăng ký ngay'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL GỌI PHỤC VỤ */}
            {isCallModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2"><Bell size={20} className="text-orange-500"/> Gọi Phục Vụ</h3>
                            <button onClick={() => setIsCallModalOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={18} /></button>
                        </div>
                        {callSuccessMsg ? (
                            <div className="text-center py-6"><CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" /><p className="font-bold text-emerald-600">{callSuccessMsg}</p></div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {SERVICE_OPTIONS.map((opt) => (
                                    <button key={opt} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors" onClick={() => handleCallStaff(opt)}>{opt}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}