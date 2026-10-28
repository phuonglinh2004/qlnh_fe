import { useState } from 'react';

export default function Dashboard() {
    return (
        <div>
            <h1 className="mt-2 mb-4">Tổng quan hệ thống</h1>

            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body">Tổng doanh thu</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white h-100">
                        <div className="card-body">Đơn hàng mới</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body">Khách hàng</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-danger text-white h-100">
                        <div className="card-body">Món đang nấu</div>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="bi bi-table me-1"></i> Bảng dữ liệu
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Bàn</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr><td>#001</td><td>Bàn 01</td><td>150.000đ</td><td><span className="badge bg-success">Đã TT</span></td></tr>
                        <tr><td>#002</td><td>Bàn 03</td><td>320.000đ</td><td><span className="badge bg-warning text-dark">Chờ TT</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}