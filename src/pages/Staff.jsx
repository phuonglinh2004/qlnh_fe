import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { UserPlus, Search, Lock, Unlock, X } from 'lucide-react';

export default function Staff() {
    const [staffList, setStaffList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        username: '', password: '', full_name: '', role: 'waiter'
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await axiosClient.get('/staff');
            setStaffList(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            await axiosClient.post('/staff', formData);
            alert('Thêm nhân viên thành công!');
            setIsModalOpen(false);
            setFormData({ username: '', password: '', full_name: '', role: 'waiter' });
            fetchStaff();
        } catch (error) {
            setErrorMsg(error.response?.data?.error || 'Lỗi tạo tài khoản');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        if (!window.confirm(`Bạn có chắc muốn ${currentStatus ? 'khóa' : 'mở khóa'} tài khoản này?`)) return;
        try {
            await axiosClient.put(`/staff/${id}/toggle`);
            fetchStaff();
        } catch (error) {
            alert('Lỗi cập nhật trạng thái');
        }
    };

    const filteredStaff = staffList.filter(s =>
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleInfo = (role) => {
        switch (role) {
            case 'admin': return { label: 'Quản lý', color: 'bg-red-100 text-red-700' };
            case 'cashier': return { label: 'Thu ngân', color: 'bg-purple-100 text-purple-700' };
            case 'kitchen': return { label: 'Đầu bếp', color: 'bg-orange-100 text-orange-700' };
            case 'waiter': return { label: 'Phục vụ', color: 'bg-blue-100 text-blue-700' };
            default: return { label: role, color: 'bg-gray-100 text-gray-700' };
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quản lý Nhân sự</h1>
                    <p className="text-slate-500 text-sm mt-1">Danh sách tài khoản nhân viên và phân quyền</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                    <UserPlus size={18} /> Thêm Nhân Viên
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
                    <input type="text" placeholder="Tìm theo tên hoặc tài khoản..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                           value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                        <th className="p-4 font-semibold">Họ Tên</th>
                        <th className="p-4 font-semibold">Tài khoản</th>
                        <th className="p-4 font-semibold">Vai trò</th>
                        <th className="p-4 font-semibold text-center">Trạng thái</th>
                        <th className="p-4 font-semibold text-center">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredStaff.map(staff => {
                        const roleInfo = getRoleInfo(staff.role);
                        return (
                            <tr key={staff.user_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-800">{staff.full_name}</td>
                                <td className="p-4 text-slate-600">{staff.username}</td>
                                <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${roleInfo.color}`}>{roleInfo.label}</span></td>
                                <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${staff.is_active ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{staff.is_active ? 'Hoạt động' : 'Đã khóa'}</span></td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleToggleStatus(staff.user_id, staff.is_active)} className={`p-2 rounded-lg transition-colors ${staff.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}>
                                        {staff.is_active ? <Lock size={18} /> : <Unlock size={18} />}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">Thêm Nhân Viên Mới</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
                            {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">{errorMsg}</div>}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Họ và Tên</label>
                                <input type="text" required placeholder="VD: Nguyễn Văn A" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tên Đăng Nhập</label>
                                <input type="text" required placeholder="VD: phucvu01" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Mật khẩu</label>
                                <input type="password" required placeholder="Nhập mật khẩu..." className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Phân Quyền</label>
                                <select className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                    <option value="waiter">Nhân viên Phục vụ</option>
                                    <option value="kitchen">Nhân viên Bếp</option>
                                    <option value="cashier">Thu ngân</option>
                                    <option value="admin">Quản lý (Admin)</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                                Tạo Tài Khoản
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}