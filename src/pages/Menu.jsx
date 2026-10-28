import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Search } from 'lucide-react';

export default function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tất cả');

    useEffect(() => {
        axiosClient.get('/menu').then(res => setMenuItems(res.data)).catch(console.error);
    }, []);

    // Lấy danh sách các danh mục duy nhất
    const categories = ['Tất cả', ...new Set(menuItems.map(item => item.category_name).filter(Boolean))];

    // Lọc theo danh mục và thanh tìm kiếm
    const filteredItems = menuItems.filter(item => {
        const matchCategory = activeCategory === 'Tất cả' || item.category_name === activeCategory;
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Thực đơn nhà hàng</h1>
                    <p className="text-slate-500 text-sm mt-1">Xem và quản lý danh sách món ăn</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm món ăn..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Thanh Tab Danh Mục */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium transition-colors border ${
                            activeCategory === cat
                                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Danh sách món */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map(item => (
                    <div key={item.item_id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <img
                            src={item.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                            alt={item.name}
                            className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                            <p className="text-xs text-orange-500 font-semibold mb-1">{item.category_name}</p>
                            <h3 className="font-bold text-slate-800 text-sm truncate">{item.name}</h3>
                            <p className="text-slate-800 font-bold mt-2">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}