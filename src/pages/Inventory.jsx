// import { useState, useEffect } from 'react';
// import axiosClient from '../api/axiosClient';
// import { Plus, Trash2, Package, History } from 'lucide-react';
//
// export default function Inventory() {
//     const [ingredients, setIngredients] = useState([]);
//     const [suppliers, setSuppliers] = useState([]);
//     const [history, setHistory] = useState([]);
//     const [cart, setCart] = useState([]);
//     const [activeTab, setActiveTab] = useState('import');
//     const [selectedSupplier, setSelectedSupplier] = useState('');
//
//     useEffect(() => {
//         axiosClient.get('/admin/ingredients').then(res => setIngredients(res.data));
//         axiosClient.get('/admin/suppliers').then(res => setSuppliers(res.data));
//         axiosClient.get('/admin/purchase-orders').then(res => setHistory(res.data));
//     }, []);
//
//     const addToCart = (ingredient) => {
//         const existing = cart.find(c => c.ingredient_id === ingredient.ingredient_id);
//         if (existing) {
//             setCart(cart.map(c => c.ingredient_id === ingredient.ingredient_id ? { ...c, quantity: c.quantity + 1 } : c));
//         } else {
//             setCart([...cart, { ...ingredient, quantity: 1, unit_price: ingredient.cost_price }]);
//         }
//     };
//
//     const updateItem = (id, field, value) => {
//         setCart(cart.map(c => c.ingredient_id === id ? { ...c, [field]: value } : c));
//     };
//
//     const removeFromCart = (id) => setCart(cart.filter(c => c.ingredient_id !== id));
//
//     const totalCost = cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
//
//     const handleSubmit = async () => {
//         if (cart.length === 0) return alert('Vui lòng chọn nguyên liệu!');
//         if (!selectedSupplier) return alert('Vui lòng chọn nhà cung cấp!');
//         try {
//             await axiosClient.post('/admin/purchase-orders', {
//                 supplier_id: Number(selectedSupplier),
//                 items: cart.map(c => ({ ingredient_id: c.ingredient_id, quantity: c.quantity, unit_price: c.unit_price })),
//                 note: 'Nhập kho'
//             });
//             alert('Nhập kho thành công!');
//             setCart([]);
//             axiosClient.get('/admin/purchase-orders').then(res => setHistory(res.data));
//         } catch (error) { alert('Lỗi: ' + (error.response?.data?.error || error.message)); }
//     };
//
//     return (
//         <div className="max-w-6xl mx-auto">
//             <div className="flex gap-4 mb-6 border-b">
//                 <button onClick={() => setActiveTab('import')} className={`pb-2 px-4 font-bold flex items-center gap-2 ${activeTab === 'import' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-slate-500'}`}>
//                     <Package size={18}/> Nhập Kho
//                 </button>
//                 <button onClick={() => setActiveTab('history')} className={`pb-2 px-4 font-bold flex items-center gap-2 ${activeTab === 'history' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-slate-500'}`}>
//                     <History size={18}/> Lịch Sử Nhập
//                 </button>
//             </div>
//
//             {activeTab === 'import' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {/* Cột trái: Danh sách nguyên liệu */}
//                     <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border">
//                         <h3 className="font-bold text-lg mb-4">Chọn nguyên liệu</h3>
//                         <div className="grid grid-cols-2 gap-3">
//                             {ingredients.map(ing => (
//                                 <div key={ing.ingredient_id} onClick={() => addToCart(ing)} className="p-3 border rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition">
//                                     <p className="font-bold">{ing.name}</p>
//                                     <p className="text-sm text-slate-500">Tồn: {ing.stock_quantity} {ing.unit}</p>
//                                     <p className="text-sm text-orange-600 font-bold">{Number(ing.cost_price).toLocaleString()}đ / {ing.unit}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//
//                     {/* Cột phải: Phiếu nhập tạm */}
//                     <div className="bg-white p-4 rounded-xl shadow-sm border h-fit">
//                         <h3 className="font-bold text-lg mb-4">Phiếu nhập tạm</h3>
//                         <div className="mb-3">
//                             <label className="block text-sm font-bold text-slate-700 mb-1">Nhà cung cấp</label>
//                             <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} className="w-full p-2 border rounded-lg">
//                                 <option value="">-- Chọn NCC --</option>
//                                 {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>)}
//                             </select>
//                         </div>
//                         <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
//                             {cart.map(item => (
//                                 <div key={item.ingredient_id} className="bg-slate-50 p-2 rounded border text-sm">
//                                     <p className="font-bold">{item.name}</p>
//                                     <div className="flex gap-2 mt-1 items-center">
//                                         <input type="number" value={item.quantity} onChange={e => updateItem(item.ingredient_id, 'quantity', Number(e.target.value))} className="w-16 p-1 border rounded" placeholder="SL"/>
//                                         <input type="number" value={item.unit_price} onChange={e => updateItem(item.ingredient_id, 'unit_price', Number(e.target.value))} className="w-20 p-1 border rounded" placeholder="Giá"/>
//                                         <button onClick={() => removeFromCart(item.ingredient_id)} className="text-red-500"><Trash2 size={16}/></button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="border-t pt-3">
//                             <div className="flex justify-between font-bold text-lg mb-3"><span>Tổng chi:</span><span className="text-orange-600">{totalCost.toLocaleString()}đ</span></div>
//                             <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">Xác nhận Nhập Kho</button>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//                     <table className="w-full text-left">
//                         <thead className="bg-slate-50 border-b">
//                         <tr>
//                             <th className="p-3">Mã</th>
//                             <th className="p-3">Ngày</th>
//                             <th className="p-3">Người nhập</th>
//                             <th className="p-3">Nhà CC</th>
//                             <th className="p-3 text-right">Tổng chi</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {history.map(po => (
//                             <tr key={po.po_id} className="border-b hover:bg-slate-50">
//                                 <td className="p-3">#{po.po_id}</td>
//                                 <td className="p-3">{new Date(po.created_at).toLocaleString('vi-VN')}</td>
//                                 <td className="p-3 font-medium">{po.user_name}</td>
//                                 <td className="p-3">{po.supplier_name || '-'}</td>
//                                 <td className="p-3 text-right font-bold text-orange-600">{Number(po.total_cost).toLocaleString()}đ</td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
    Package,
    ArrowLeft,
    PlusCircle,
    AlertTriangle,
    CheckCircle2,
    Edit2,
    Trash2,
    BookOpen,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UNIT_OPTIONS = [
    { label: 'Viên (bò viên, chả viên...)', value: 'viên' },
    { label: 'Con (tôm, cua, ghẹ...)', value: 'con' },
    { label: 'Gram - g (thịt, nấm, rau...)', value: 'g' },
    { label: 'Kilogram - kg (gạo, xương lẩu...)', value: 'kg' },
    { label: 'Lon / Chai (nước ngọt, bia...)', value: 'lon' },
    { label: 'Phần / Vá (cốt lẩu, sốt...)', value: 'phần' },
    { label: 'Gói / Bịch (mì, bún gói...)', value: 'gói' },
    { label: 'Mililít - ml (sữa, syrup...)', value: 'ml' }
];

function Inventory() {
    const [tab, setTab] = useState('inventory'); // 'inventory' | 'recipes'
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

    // Form data
    const [selectedItem, setSelectedItem] = useState(null);
    const [ingForm, setIngForm] = useState({
        name: '',
        unit: 'viên',
        stock_quantity: 0,
        cost_price: '',
        min_stock: 10
    });
    const [importAmount, setImportAmount] = useState('');
    const [importPrice, setImportPrice] = useState('');
    const [recipeForm, setRecipeForm] = useState({
        item_id: '',
        ingredient_id: '',
        amount_needed: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ingRes, recRes, menuRes] = await Promise.all([
                axiosClient.get('/inventory'),
                axiosClient.get('/inventory/recipes'),
                axiosClient.get('/menu')
            ]);
            setIngredients(ingRes.data);
            setRecipes(recRes.data);
            setMenuItems(menuRes.data);
        } catch (err) {
            console.error('Lỗi nạp dữ liệu kho:', err);
        }
    };

    // 1. Thêm nguyên liệu mới
    const handleAddIngredient = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/inventory', ingForm);
            alert('Thêm nguyên liệu mới thành công!');
            setIsAddModalOpen(false);
            setIngForm({ name: '', unit: 'viên', stock_quantity: 0, cost_price: '', min_stock: 10 });
            loadData();
        } catch (err) {
            alert(err.response?.data?.error || 'Lỗi thêm nguyên liệu!');
        }
    };

    // 2. Chỉnh sửa nguyên liệu
    const handleEditIngredient = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.put(`/inventory/${selectedItem.ingredient_id}`, ingForm);
            alert('Cập nhật nguyên liệu thành công!');
            setIsEditModalOpen(false);
            setSelectedItem(null);
            loadData();
        } catch (err) {
            alert(err.response?.data?.error || 'Lỗi cập nhật!');
        }
    };

    // 3. Xóa nguyên liệu
    const handleDeleteIngredient = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa nguyên liệu "${name}" khỏi kho? Các công thức liên quan sẽ bị xóa theo!`)) return;
        try {
            await axiosClient.delete(`/inventory/${id}`);
            alert('Đã xóa nguyên liệu!');
            loadData();
        } catch (err) {
            alert('Lỗi khi xóa!');
        }
    };

    // 4. Nhập thêm hàng vào kho
    const handleImportStock = async (e) => {
        e.preventDefault();
        if (!selectedItem || !importAmount) return;
        try {
            await axiosClient.post('/inventory/import', {
                ingredient_id: selectedItem.ingredient_id,
                amount: Number(importAmount),
                cost_price: importPrice ? Number(importPrice) : null
            });
            alert(`Nhập kho thành công cho: ${selectedItem.name}!`);
            setIsImportModalOpen(false);
            setSelectedItem(null);
            setImportAmount('');
            setImportPrice('');
            loadData();
        } catch (err) {
            alert('Lỗi nhập kho!');
        }
    };

    // 5. Thêm công thức định lượng (BOM)
    const handleAddRecipe = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/inventory/recipes', recipeForm);
            alert('Đã thiết lập định lượng cho món!');
            setIsRecipeModalOpen(false);
            setRecipeForm({ item_id: '', ingredient_id: '', amount_needed: '' });
            loadData();
        } catch (err) {
            alert(err.response?.data?.error || 'Lỗi thiết lập định lượng!');
        }
    };

    // 6. Xóa định lượng
    const handleDeleteRecipe = async (recipeId) => {
        if (!window.confirm('Xác nhận xóa liên kết định lượng này?')) return;
        try {
            await axiosClient.delete(`/inventory/recipes/${recipeId}`);
            alert('Đã xóa định lượng!');
            loadData();
        } catch (err) {
            alert('Lỗi khi xóa định lượng!');
        }
    };

    // Tìm đơn vị tương ứng với nguyên liệu đang chọn khi cài định lượng
    const activeSelectedIngredient = ingredients.find(
        (ing) => String(ing.ingredient_id) === String(recipeForm.ingredient_id)
    );

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Link to="/dashboard" style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '10px', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem' }}>
                        <ArrowLeft size={16} /> Dashboard
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#ea580c', padding: '8px', borderRadius: '10px', color: '#fff' }}>
                            <Package size={22} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>QUẢN LÝ KHO & ĐỊNH LƯỢNG NGUYÊN LIỆU</h1>
                            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tùy biến linh hoạt đơn vị tính (Viên, Con, Gam, Kg, Lon, Phần...)</span>
                        </div>
                    </div>
                </div>

                {/* Nút thao tác nhanh */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    {tab === 'inventory' ? (
                        <button
                            onClick={() => {
                                setIngForm({ name: '', unit: 'viên', stock_quantity: 0, cost_price: '', min_stock: 10 });
                                setIsAddModalOpen(true);
                            }}
                            style={{ background: '#ea580c', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <PlusCircle size={16} /> Thêm Nguyên Liệu Mới
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsRecipeModalOpen(true)}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <PlusCircle size={16} /> Cài Định Lượng Món
                        </button>
                    )}
                </div>
            </div>

            {/* Thanh Tab Chuyển Đổi */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => setTab('inventory')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        background: tab === 'inventory' ? '#ea580c' : '#ffffff',
                        color: tab === 'inventory' ? '#ffffff' : '#475569',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                >
                    <Package size={18} /> Tồn Kho Nguyên Liệu ({ingredients.length})
                </button>

                <button
                    onClick={() => setTab('recipes')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        background: tab === 'recipes' ? '#ea580c' : '#ffffff',
                        color: tab === 'recipes' ? '#ffffff' : '#475569',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                >
                    <BookOpen size={18} /> Công Thức Định Lượng (BOM) ({recipes.length})
                </button>
            </div>

            {/* TAB 1: DANH SÁCH TỒN KHO NGUYÊN LIỆU */}
            {tab === 'inventory' && (
                <div style={{ background: '#ffffff', borderRadius: '18px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                        <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '12px 14px' }}>Tên nguyên vật liệu</th>
                            <th style={{ padding: '12px 14px' }}>Đơn vị tính</th>
                            <th style={{ padding: '12px 14px' }}>Số lượng tồn hiện tại</th>
                            <th style={{ padding: '12px 14px' }}>Giá vốn nhập (COGS)</th>
                            <th style={{ padding: '12px 14px' }}>Tình trạng kho</th>
                            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ingredients.map((item) => {
                            const isLow = Number(item.stock_quantity) <= Number(item.min_stock);
                            return (
                                <tr key={item.ingredient_id} style={{ borderBottom: '1px solid #f8fafc', background: isLow ? '#fffbf5' : 'transparent' }}>
                                    <td style={{ padding: '14px', fontWeight: 700, color: '#1e293b' }}>
                                        {item.name}
                                    </td>
                                    <td style={{ padding: '14px' }}>
                                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                                                {item.unit}
                                            </span>
                                    </td>
                                    <td style={{ padding: '14px', fontWeight: 900, fontSize: '1rem', color: isLow ? '#dc2626' : '#0f172a' }}>
                                        {Number(item.stock_quantity).toLocaleString()} {item.unit}
                                    </td>
                                    <td style={{ padding: '14px', fontWeight: 700, color: '#059669' }}>
                                        {Number(item.cost_price).toLocaleString()}đ / {item.unit}
                                    </td>
                                    <td style={{ padding: '14px' }}>
                                        {isLow ? (
                                            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <AlertTriangle size={13} /> Sắp hết hàng
                                                </span>
                                        ) : (
                                            <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <CheckCircle2 size={13} /> Đầy đủ
                                                </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setImportPrice(item.cost_price);
                                                    setIsImportModalOpen(true);
                                                }}
                                                style={{ background: '#ea580c', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                                            >
                                                + Nhập thêm
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIngForm({
                                                        name: item.name,
                                                        unit: item.unit,
                                                        stock_quantity: item.stock_quantity,
                                                        cost_price: item.cost_price,
                                                        min_stock: item.min_stock
                                                    });
                                                    setIsEditModalOpen(true);
                                                }}
                                                title="Sửa thông tin"
                                                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteIngredient(item.ingredient_id, item.name)}
                                                title="Xóa nguyên liệu"
                                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TAB 2: CÔNG THỨC ĐỊNH LƯỢNG MÓN ĂN (BOM) */}
            {tab === 'recipes' && (
                <div style={{ background: '#ffffff', borderRadius: '18px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ marginBottom: '16px', color: '#64748b', fontSize: '0.85rem' }}>
                        Khi khách đặt món và chốt thanh toán, kho sẽ tự động trừ hao chính xác theo định lượng (viên, con, gam...):
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                        <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '12px 14px' }}>Món ăn trên menu</th>
                            <th style={{ padding: '12px 14px' }}>Nguyên liệu tiêu hao</th>
                            <th style={{ padding: '12px 14px', textAlign: 'center' }}>Định lượng trừ cho 1 phần ăn</th>
                            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recipes.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                                    Chưa có công thức định lượng nào được tạo
                                </td>
                            </tr>
                        ) : (
                            recipes.map((rec) => (
                                <tr key={rec.recipe_id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>
                                        🍽️ {rec.item_name}
                                    </td>
                                    <td style={{ padding: '14px', fontWeight: 700, color: '#ea580c' }}>
                                        {rec.ingredient_name}
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'center', fontWeight: 900, color: '#059669' }}>
                                        {Number(rec.amount_needed).toLocaleString()} <span style={{ fontSize: '0.85rem', color: '#475569' }}>{rec.unit} / phần</span>
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDeleteRecipe(rec.recipe_id)}
                                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}
                                        >
                                            Xóa định lượng
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL 1: THÊM NGUYÊN LIỆU MỚI */}
            {isAddModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', width: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>Thêm Nguyên Liệu Vào Kho</h3>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleAddIngredient} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Tên nguyên vật liệu</label>
                                <input
                                    required
                                    placeholder="vd: Tôm sú, Bò viên, Cua Cà Mau..."
                                    value={ingForm.name}
                                    onChange={e => setIngForm({ ...ingForm, name: e.target.value })}
                                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.9fr', gap: '10px' }}>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Đơn vị tính</label>
                                    <select
                                        value={ingForm.unit}
                                        onChange={e => setIngForm({ ...ingForm, unit: e.target.value })}
                                        style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                    >
                                        {UNIT_OPTIONS.map((u) => (
                                            <option key={u.value} value={u.value}>{u.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Số lượng ban đầu</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={ingForm.stock_quantity}
                                        onChange={e => setIngForm({ ...ingForm, stock_quantity: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Giá vốn (VNĐ / {ingForm.unit})</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        placeholder="vd: 5000..."
                                        value={ingForm.cost_price}
                                        onChange={e => setIngForm({ ...ingForm, cost_price: e.target.value })}
                                        style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Báo hết khi &lt;=</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={ingForm.min_stock}
                                        onChange={e => setIngForm({ ...ingForm, min_stock: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{ width: '100%', padding: '11px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', marginTop: '8px' }}
                            >
                                Lưu Nguyên Liệu Mới
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: CHỈNH SỬA NGUYÊN LIỆU */}
            {isEditModalOpen && selectedItem && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', width: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>Chỉnh Sửa Nguyên Liệu</h3>
                            <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleEditIngredient} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Tên nguyên vật liệu</label>
                                <input
                                    required
                                    value={ingForm.name}
                                    onChange={e => setIngForm({ ...ingForm, name: e.target.value })}
                                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.9fr', gap: '10px' }}>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Đơn vị tính</label>
                                    <select
                                        value={ingForm.unit}
                                        onChange={e => setIngForm({ ...ingForm, unit: e.target.value })}
                                        style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                    >
                                        {UNIT_OPTIONS.map((u) => (
                                            <option key={u.value} value={u.value}>{u.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Tồn kho hiện tại</label>
                                    <input
                                        type="number"
                                        value={ingForm.stock_quantity}
                                        onChange={e => setIngForm({ ...ingForm, stock_quantity: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Giá vốn (VNĐ / {ingForm.unit})</label>
                                    <input
                                        required
                                        type="number"
                                        value={ingForm.cost_price}
                                        onChange={e => setIngForm({ ...ingForm, cost_price: e.target.value })}
                                        style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Báo hết khi &lt;=</label>
                                    <input
                                        type="number"
                                        value={ingForm.min_stock}
                                        onChange={e => setIngForm({ ...ingForm, min_stock: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{ width: '100%', padding: '11px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', marginTop: '8px' }}
                            >
                                Lưu Thay Đổi
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: NHẬP THÊM HÀNG */}
            {isImportModalOpen && selectedItem && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', width: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                                📦 Nhập hàng: {selectedItem.name}
                            </h3>
                            <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px' }}>
                            Tồn kho hiện tại: <b>{Number(selectedItem.stock_quantity).toLocaleString()} {selectedItem.unit}</b>
                        </p>

                        <form onSubmit={handleImportStock} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                                    Số lượng nhập thêm ({selectedItem.unit})
                                </label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    placeholder={`Nhập số ${selectedItem.unit}...`}
                                    value={importAmount}
                                    onChange={e => setImportAmount(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                                    Giá vốn mới (VNĐ / {selectedItem.unit})
                                </label>
                                <input
                                    type="number"
                                    placeholder={selectedItem.cost_price}
                                    value={importPrice}
                                    onChange={e => setImportPrice(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{ width: '100%', padding: '11px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}
                            >
                                Xác Nhận Nhập Kho
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 4: CÀI CÔNG THỨC ĐỊNH LƯỢNG (BOM) */}
            {isRecipeModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', width: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>Cài Đặt Định Lượng Món (BOM)</h3>
                            <button onClick={() => setIsRecipeModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleAddRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>1. Chọn Món Ăn Trên Thực Đơn</label>
                                <select
                                    required
                                    value={recipeForm.item_id}
                                    onChange={e => setRecipeForm({ ...recipeForm, item_id: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                >
                                    <option value="">-- Chọn món ăn --</option>
                                    {menuItems.map(item => (
                                        <option key={item.item_id} value={item.item_id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>2. Chọn Nguyên Liệu Trong Kho Tiêu Hao</label>
                                <select
                                    required
                                    value={recipeForm.ingredient_id}
                                    onChange={e => setRecipeForm({ ...recipeForm, ingredient_id: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                >
                                    <option value="">-- Chọn nguyên liệu kho --</option>
                                    {ingredients.map(ing => (
                                        <option key={ing.ingredient_id} value={ing.ingredient_id}>
                                            {ing.name} (Đơn vị: {ing.unit})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                                    3. Định lượng trừ kho cho 1 phần ăn{' '}
                                    {activeSelectedIngredient && (
                                        <b style={{ color: '#ea580c' }}>
                                            (Tính theo: {activeSelectedIngredient.unit})
                                        </b>
                                    )}
                                </label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder={
                                        activeSelectedIngredient
                                            ? `Nhập số ${activeSelectedIngredient.unit} tiêu hao...`
                                            : 'Chọn nguyên liệu trước...'
                                    }
                                    value={recipeForm.amount_needed}
                                    onChange={e => setRecipeForm({ ...recipeForm, amount_needed: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{ width: '100%', padding: '11px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', marginTop: '8px' }}
                            >
                                Lưu Liên Kết Định Lượng
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Inventory;

