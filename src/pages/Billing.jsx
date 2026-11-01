import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Receipt, Banknote, CheckCircle2, Printer, QrCode, RotateCcw, X, Minus, Plus } from 'lucide-react';

/* ============ CẤU HÌNH ============ */
const BANK = {
    id: 'VCB',
    label: 'Vietcombank',
    accountNo: '1031495439',
    accountName: 'TRAN NGOC PHUONG LINH',
};
const POINT_VALUE = 10000;   // 1 điểm giảm 10.000đ
const DEFAULT_VAT = 8;       // dùng khi món chưa có vat_rate

const TABLE_STATUS = {
    available: { label: 'Trống', tone: 'idle' },
    occupied: { label: 'Có khách', tone: 'busy' },
    waiting_payment: { label: 'Chờ thanh toán', tone: 'wait' },
    reserved: { label: 'Đã đặt', tone: 'hold' },
};

/* ============ HÀM TIỆN ÍCH ============ */
const money = (n) => `${Math.round(Number(n) || 0).toLocaleString('vi-VN')}đ`;
const formatTime = (d) =>
    new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const removeDiacritics = (s = '') =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

/* ============ STYLE ============ */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

.bl {
  --bg:#f6f7f9; --paper:#ffffff; --ink:#172033; --muted:#5d6778; --line:#e3e6eb;
  --ember:#e8590c; --ember-deep:#c2410c; --ember-tint:#fff1e6;
  --go:#1b7f4b; --go-deep:#166a3f; --stop:#c0392b; --stop-tint:#fdecea;
  min-height:100%; padding:24px 32px 40px; background:var(--bg); color:var(--ink);
  font-family:'Be Vietnam Pro', system-ui, 'Segoe UI', sans-serif; font-size:14px; line-height:1.5;
  font-variant-numeric:tabular-nums;
}
.bl *, .bl *::before, .bl *::after { box-sizing:border-box; }
.bl button { font:inherit; color:inherit; cursor:pointer; }
.bl button:focus-visible { outline:2px solid var(--ember); outline-offset:2px; }

/* Đầu trang */
.bl-top { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:24px; }
.bl-top h1 { margin:0; font-size:1.5rem; font-weight:700; letter-spacing:-0.01em; }
.bl-top p { margin:2px 0 0; color:var(--muted); }
.bl-top-actions { display:flex; align-items:center; gap:14px; color:var(--muted); }
.bl-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:8px 14px; border:1px solid var(--line); background:var(--paper); border-radius:8px; font-weight:600; }
.bl-btn-ghost:hover { border-color:#cdd2da; }

/* Bố cục */
.bl-main { display:grid; grid-template-columns:minmax(0,1fr) 420px; gap:28px; align-items:start; }
@media (max-width:1000px) { .bl { padding:16px; } .bl-main { grid-template-columns:1fr; } .bl-panel { position:static !important; } }

/* Danh sách bàn */
.bl-section-title { margin:0 0 14px; font-size:1rem; font-weight:700; }
.bl-tables { display:grid; grid-template-columns:repeat(auto-fill, minmax(170px, 1fr)); gap:12px; }
.bl-table { width:100%; text-align:left; background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:14px 16px; display:flex; flex-direction:column; gap:12px; transition:border-color .15s, background .15s; }
.bl-table:hover { border-color:#c3c9d4; }
.bl-table[aria-pressed="true"] { border-color:var(--ember); box-shadow:0 0 0 1px var(--ember); background:var(--ember-tint); }
.bl-table-head { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:4px 8px; }
.bl-table-name { font-weight:700; font-size:1.05rem; }
.bl-status { display:inline-flex; align-items:center; gap:6px; font-size:.78rem; font-weight:500; color:var(--muted); }
.bl-dot { width:8px; height:8px; border-radius:50%; background:#b6bdc9; display:inline-block; }
.bl-status[data-tone="busy"] { color:var(--ember-deep); }
.bl-status[data-tone="busy"] .bl-dot { background:var(--ember); }
.bl-status[data-tone="wait"] .bl-dot { background:#d19a00; }
.bl-status[data-tone="hold"] .bl-dot { background:#3b6fd4; }
.bl-table-total small { display:block; color:var(--muted); font-size:.75rem; }
.bl-table-total strong { font-size:1.15rem; font-weight:700; }
.bl-table[data-tone="idle"] .bl-table-total strong { color:#9aa3b2; font-weight:600; }
.bl-note { margin:16px 0; text-align:center; color:var(--muted); }

/* Khung hóa đơn */
.bl-panel { position:sticky; top:16px; background:var(--paper); border:1px solid var(--line); border-radius:14px; box-shadow:0 1px 2px rgba(23,32,51,.04), 0 10px 28px rgba(23,32,51,.07); }
.bl-empty { padding:72px 32px; text-align:center; color:var(--muted); }
.bl-empty svg { opacity:.35; margin-bottom:12px; }
.bl-empty strong { display:block; color:var(--ink); margin-bottom:4px; }

/* Phiếu */
.bl-ticket { padding:24px 24px 18px; }
.bl-ticket-head { text-align:center; padding-bottom:14px; border-bottom:1px dashed #aeb5c2; margin-bottom:12px; }
.bl-ticket-head h2 { margin:0; font-size:1.2rem; font-weight:700; letter-spacing:.02em; }
.bl-ticket-head p { margin:2px 0 0; font-size:.78rem; color:var(--muted); }
.bl-ticket-head h3 { margin:12px 0 0; font-size:.95rem; font-weight:600; }
.bl-meta { display:grid; grid-template-columns:1fr auto; row-gap:2px; font-size:.8rem; padding-bottom:12px; border-bottom:1px dashed #aeb5c2; margin-bottom:6px; }
.bl-meta span:nth-child(even) { text-align:right; }
.bl-meta .full { grid-column:1 / -1; text-align:left !important; }
.bl-items { list-style:none; margin:0; padding:0; max-height:300px; overflow-y:auto; }
.bl-item { display:grid; grid-template-columns:30px minmax(0,1fr) auto 26px; gap:8px; align-items:start; padding:8px 0; border-bottom:1px dotted var(--line); }
.bl-item-qty { font-weight:700; color:var(--ember-deep); }
.bl-item-name { font-weight:600; }
.bl-item-sub { display:block; font-size:.75rem; font-weight:400; color:var(--muted); }
.bl-item-total { font-weight:600; text-align:right; }
.bl-x { width:26px; height:26px; border:0; border-radius:6px; background:transparent; color:#9aa3b2; display:grid; place-items:center; }
.bl-x:hover { background:var(--stop-tint); color:var(--stop); }
.bl-sums { margin-top:10px; padding-top:10px; border-top:1px dashed #aeb5c2; font-size:.85rem; }
.bl-row { display:flex; justify-content:space-between; gap:12px; padding:2px 0; }
.bl-row.minus { color:var(--stop); font-weight:600; }
.bl-grand { display:flex; justify-content:space-between; align-items:baseline; margin-top:8px; padding-top:10px; border-top:2px solid var(--ink); }
.bl-grand span { font-weight:700; }
.bl-grand strong { font-size:1.7rem; font-weight:700; letter-spacing:-.01em; color:var(--ember-deep); }
.bl-thanks { margin:14px 0 0; text-align:center; font-size:.78rem; font-style:italic; color:var(--muted); }
.bl-error { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:10px 12px; margin:8px 0; border-radius:8px; background:var(--stop-tint); color:var(--stop); font-size:.85rem; }

/* Đường xé phiếu */
.bl-perf { position:relative; height:0; border-top:2px dashed var(--line); }
.bl-perf::before, .bl-perf::after { content:""; position:absolute; top:-11px; width:24px; height:24px; border-radius:50%; background:var(--bg); }
.bl-perf::before { left:-13px; }
.bl-perf::after { right:-13px; }

/* Phần thao tác */
.bl-stub { padding:20px 24px 24px; display:flex; flex-direction:column; gap:14px; }
.bl-btn-line { width:100%; display:flex; justify-content:center; align-items:center; gap:8px; padding:10px; border:1px dashed var(--ember); background:transparent; color:var(--ember-deep); border-radius:8px; font-weight:600; }
.bl-btn-line:disabled { opacity:.45; cursor:not-allowed; }
.bl-points { border:1px solid var(--line); border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; gap:8px; }
.bl-points-row { display:flex; justify-content:space-between; align-items:center; gap:12px; }
.bl-points p { margin:0; font-weight:600; }
.bl-points small { display:block; font-size:.75rem; font-weight:400; color:var(--muted); }
.bl-step { display:inline-flex; align-items:center; gap:6px; }
.bl-step button { width:28px; height:28px; display:grid; place-items:center; border:1px solid var(--line); background:var(--paper); border-radius:6px; }
.bl-step button:disabled { opacity:.4; cursor:not-allowed; }
.bl-step output { min-width:32px; text-align:center; font-weight:700; }
.bl-link { border:0; background:none; padding:0; font-size:.78rem; font-weight:600; color:var(--ember-deep); text-decoration:underline; text-underline-offset:3px; }
.bl-seg { display:grid; grid-template-columns:1fr 1fr; gap:4px; padding:4px; background:var(--bg); border-radius:10px; }
.bl-seg button { display:flex; align-items:center; justify-content:center; gap:8px; padding:9px; border:0; background:transparent; border-radius:7px; font-weight:600; color:var(--muted); }
.bl-seg button[aria-checked="true"] { background:var(--paper); color:var(--ink); box-shadow:0 1px 2px rgba(23,32,51,.14); }
.bl-qr { display:flex; align-items:center; gap:14px; padding:12px; border:1px solid var(--line); border-radius:10px; }
.bl-qr > button { flex:none; padding:0; border:0; background:none; cursor:zoom-in; }
.bl-qr img { width:132px; height:132px; object-fit:contain; display:block; border-radius:6px; }
.bl-qr-info { font-size:.8rem; color:var(--muted); }
.bl-qr-info strong { display:block; color:var(--ink); font-size:.9rem; }
.bl-pay { width:100%; padding:14px 16px; border:0; border-radius:10px; background:var(--go); color:#fff; font-size:1rem; font-weight:700; display:flex; align-items:center; justify-content:center; gap:10px; }
.bl-pay:hover:not(:disabled) { background:var(--go-deep); }
.bl-pay:disabled { background:#cfd4dc; cursor:not-allowed; }

/* Hộp thoại + thông báo */
.bl-overlay { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:16px; background:rgba(23,32,51,.6); }
.bl-modal { position:relative; width:min(440px, 100%); padding:24px; background:var(--paper); border-radius:14px; box-shadow:0 24px 48px rgba(0,0,0,.25); }
.bl-modal h2 { margin:0 0 6px; font-size:1.15rem; }
.bl-modal p { margin:0 0 20px; color:var(--muted); }
.bl-modal .bl-error { margin:0 0 16px; }
.bl-modal-actions { display:flex; justify-content:flex-end; gap:10px; }
.bl-btn { padding:10px 18px; border:1px solid var(--line); background:var(--paper); border-radius:8px; font-weight:600; }
.bl-btn.go { background:var(--go); border-color:var(--go); color:#fff; }
.bl-btn.danger { background:var(--stop); border-color:var(--stop); color:#fff; }
.bl-btn:disabled { opacity:.6; cursor:wait; }
.bl-modal.qr { width:min(460px, 100%); text-align:center; }
.bl-modal.qr h2 { margin-bottom:16px; padding-right:32px; }
.bl-modal.qr img { width:340px; max-width:100%; display:block; margin:0 auto; object-fit:contain; border-radius:10px; }
.bl-modal-close { position:absolute; top:14px; right:14px; width:34px; height:34px; display:grid; place-items:center; border:0; border-radius:50%; background:var(--bg); color:var(--muted); }
.bl-facts { margin:20px 0 0; padding:14px 16px; background:var(--bg); border-radius:10px; text-align:left; }
.bl-facts div { display:flex; justify-content:space-between; gap:12px; padding:3px 0; }
.bl-facts dt { color:var(--muted); }
.bl-facts dd { margin:0; font-weight:600; }
.bl-facts dd.amount { color:var(--ember-deep); font-size:1.2rem; font-weight:700; }
.bl-toast { position:fixed; right:24px; bottom:24px; z-index:1100; padding:12px 16px; border-radius:10px; background:var(--ink); color:#fff; font-weight:500; box-shadow:0 8px 24px rgba(0,0,0,.2); }
.bl-toast[data-type="success"] { background:var(--go); }
.bl-toast[data-type="error"] { background:var(--stop); }

/* In phiếu 80mm */
@media print {
  body * { visibility:hidden; }
  #printable-receipt, #printable-receipt * { visibility:visible; }
  #printable-receipt { position:absolute; left:0; top:0; width:80mm; padding:8px; background:#fff; color:#000; font-family:'Courier New', Courier, monospace; }
  #printable-receipt .bl-items { max-height:none; overflow:visible; }
  .bl-no-print { display:none !important; }
}
`;

/* ============ HỘP THOẠI XÁC NHẬN ============ */
function ConfirmDialog({ dialog, onClose }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const run = async () => {
        setBusy(true);
        setError('');
        try {
            await dialog.onConfirm();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Có lỗi xảy ra, thử lại sau.');
            setBusy(false);
        }
    };

    return (
        <div className="bl-overlay bl-no-print" onClick={busy ? undefined : onClose}>
            <div
                className="bl-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="bl-dialog-title"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="bl-dialog-title">{dialog.title}</h2>
                <p>{dialog.message}</p>
                {error && <div className="bl-error">{error}</div>}
                <div className="bl-modal-actions">
                    <button type="button" className="bl-btn" onClick={onClose} disabled={busy}>Quay lại</button>
                    <button type="button" className={`bl-btn ${dialog.tone}`} onClick={run} disabled={busy} autoFocus>
                        {busy ? 'Đang xử lý…' : dialog.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ============ TRANG THU NGÂN ============ */
function Billing() {
    const { tableId } = useParams();
    const navigate = useNavigate();

    const [tables, setTables] = useState([]);
    const [billItems, setBillItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'vietqr'
    const [loadingBill, setLoadingBill] = useState(false);
    const [billError, setBillError] = useState('');
    const [pointsToUse, setPointsToUse] = useState(0);
    const [qrOpen, setQrOpen] = useState(false);
    const [dialog, setDialog] = useState(null);
    const [toast, setToast] = useState(null);
    const requestId = useRef(0);

    const userRole = localStorage.getItem('role') || 'Thu ngân';

    const showToast = useCallback((type, text) => setToast({ type, text }), []);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setQrOpen(false);
                setDialog(null);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    /* --- Tải dữ liệu --- */
    const loadTables = useCallback(async () => {
        try {
            const res = await axiosClient.get('/billing/tables');
            setTables(res.data);
        } catch (err) {
            console.error('Lỗi nạp danh sách bàn:', err);
            showToast('error', 'Không tải được danh sách bàn. Kiểm tra backend rồi bấm Làm mới.');
        }
    }, [showToast]);

    const fetchBill = useCallback(async (id) => {
        const mine = ++requestId.current; // bỏ qua kết quả cũ khi bấm bàn liên tục
        setLoadingBill(true);
        setBillError('');
        try {
            const res = await axiosClient.get(`/billing/table/${id}`);
            if (mine !== requestId.current) return;
            setBillItems(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            if (mine !== requestId.current) return;
            setBillItems([]);
            if (err.response?.status !== 404) {
                console.error('Lỗi lấy chi tiết bill:', err);
                setBillError(err.response?.data?.details || err.response?.data?.error || 'Không tải được hóa đơn.');
            }
        } finally {
            if (mine === requestId.current) setLoadingBill(false);
        }
    }, []);

    useEffect(() => {
        loadTables();
    }, [loadTables]);

    useEffect(() => {
        setPointsToUse(0);
        if (tableId) {
            fetchBill(tableId);
        } else {
            requestId.current += 1;
            setBillItems([]);
            setBillError('');
            setLoadingBill(false);
        }
    }, [tableId, fetchBill]);

    const refresh = () => {
        loadTables();
        if (tableId) fetchBill(tableId);
    };

    const selectedTable = useMemo(
        () => tables.find((t) => String(t.table_id) === tableId) || null,
        [tables, tableId]
    );

    /* --- Tính tiền: VAT theo từng món, điểm thưởng --- */
    const calc = useMemo(() => {
        const subTotal = billItems.reduce((sum, i) => sum + Number(i.item_price) * i.quantity, 0);

        const vatMap = {};
        billItems.forEach((i) => {
            const rate = Number(i.vat_rate ?? DEFAULT_VAT);
            vatMap[rate] = (vatMap[rate] || 0) + (Number(i.item_price) * i.quantity * rate) / 100;
        });
        const vatLines = Object.entries(vatMap)
            .map(([rate, amount]) => ({ rate: Number(rate), amount: Math.round(amount) }))
            .sort((a, b) => a.rate - b.rate);
        const vatAmount = vatLines.reduce((sum, l) => sum + l.amount, 0);

        const totalBeforeDiscount = subTotal + vatAmount;
        const customer = billItems.find((i) => i.customer_id) || null;
        const availablePoints = customer ? Number(customer.points) || 0 : 0;
        const maxUsable = Math.min(availablePoints, Math.floor(totalBeforeDiscount / POINT_VALUE));
        const pointsApplied = Math.min(pointsToUse, maxUsable);
        const discount = pointsApplied * POINT_VALUE;
        const grandTotal = totalBeforeDiscount - discount;
        const earned = customer ? Math.floor(subTotal / 100000) : 0;

        const orderIds = [...new Set(billItems.map((i) => i.order_id))];
        const openedAt = billItems.reduce((min, i) => {
            const t = new Date(i.created_at);
            return !min || t < min ? t : min;
        }, null);

        return {
            subTotal, vatLines, customer, availablePoints, maxUsable,
            pointsApplied, discount, grandTotal, earned, orderIds, openedAt,
        };
    }, [billItems, pointsToUse]);

    const {
        subTotal, vatLines, customer, availablePoints, maxUsable,
        pointsApplied, discount, grandTotal, earned, orderIds, openedAt,
    } = calc;

    const transferNote = selectedTable ? `Thanh toan ${removeDiacritics(selectedTable.table_number)}` : '';
    const qrUrl = useMemo(
        () =>
            `https://img.vietqr.io/image/${BANK.id}-${BANK.accountNo}-compact2.jpg` +
            `?amount=${grandTotal}&addInfo=${encodeURIComponent(transferNote)}` +
            `&accountName=${encodeURIComponent(BANK.accountName)}`,
        [grandTotal, transferNote]
    );

    /* --- Thao tác --- */
    const askCancelItem = (item) =>
        setDialog({
            title: 'Hủy món này?',
            message: `${item.item_name} x${item.quantity} sẽ bị bỏ khỏi hóa đơn và tổng tiền được tính lại.`,
            confirmLabel: 'Hủy món',
            tone: 'danger',
            onConfirm: async () => {
                await axiosClient.put(`/billing/items/${item.order_item_id}/cancel`);
                await Promise.all([loadTables(), fetchBill(tableId)]);
                showToast('success', `Đã hủy ${item.item_name}.`);
            },
        });

    const askCheckout = () => {
        if (!selectedTable || billItems.length === 0) return;
        setDialog({
            title: 'Xác nhận thanh toán',
            message: `Thu ${money(grandTotal)} từ ${selectedTable.table_number} bằng ${
                paymentMethod === 'cash' ? 'tiền mặt' : 'chuyển khoản QR'
            }.`,
            confirmLabel: 'Đã thu tiền',
            tone: 'go',
            onConfirm: async () => {
                await axiosClient.post('/billing/checkout', {
                    table_id: selectedTable.table_id,
                    payment_method: paymentMethod,
                    points_used: pointsApplied,
                });
                showToast('success', `Đã thanh toán ${selectedTable.table_number}.`);
                navigate('/billing');
                await loadTables();
            },
        });
    };

    const occupiedCount = tables.filter((t) => t.status !== 'available').length;
    const hasItems = billItems.length > 0;

    return (
        <div className="bl">
            <style>{styles}</style>

            <header className="bl-top bl-no-print">
                <div>
                    <h1>Thu ngân</h1>
                    <p>{occupiedCount > 0 ? `${occupiedCount} bàn đang có khách` : 'Chưa có bàn nào có khách'}</p>
                </div>
                <div className="bl-top-actions">
                    <span>Nhân viên: {userRole}</span>
                    <button type="button" className="bl-btn-ghost" onClick={refresh}>
                        <RotateCcw size={16} /> Làm mới
                    </button>
                </div>
            </header>

            <div className="bl-main">
                {/* ===== Danh sách bàn ===== */}
                <section className="bl-no-print" aria-labelledby="bl-tables-title">
                    <h2 id="bl-tables-title" className="bl-section-title">Bàn ăn</h2>
                    <div className="bl-tables">
                        {tables.map((t) => {
                            const meta = TABLE_STATUS[t.status] || TABLE_STATUS.available;
                            return (
                                <button
                                    key={t.table_id}
                                    type="button"
                                    className="bl-table"
                                    data-tone={meta.tone}
                                    aria-pressed={String(t.table_id) === tableId}
                                    onClick={() => navigate(`/billing/table/${t.table_id}`)}
                                >
                                    <span className="bl-table-head">
                                        <span className="bl-table-name">{t.table_number}</span>
                                        <span className="bl-status" data-tone={meta.tone}>
                                            <i className="bl-dot" />
                                            {meta.label}
                                        </span>
                                    </span>
                                    <span className="bl-table-total">
                                        <small>Tạm tính</small>
                                        <strong>{money(t.current_total)}</strong>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {tables.length === 0 && <p className="bl-note">Chưa có bàn nào.</p>}
                </section>

                {/* ===== Hóa đơn ===== */}
                <aside className="bl-panel" aria-label="Hóa đơn">
                    {!selectedTable ? (
                        <div className="bl-empty">
                            <Receipt size={48} />
                            <strong>Chưa chọn bàn</strong>
                            Bấm vào một bàn để xem hóa đơn và thanh toán.
                        </div>
                    ) : (
                        <>
                            <div className="bl-ticket" id="printable-receipt">
                                <header className="bl-ticket-head">
                                    <h2>RESTO MANAGER</h2>
                                    <p>
                                        Đ/c: 236B Lê Văn Sỹ, Q. Tân Bình, TP.HCM<br />
                                        Hotline: 1900 6868
                                    </p>
                                    <h3>Phiếu thanh toán</h3>
                                </header>

                                <div className="bl-meta">
                                    <span><b>Bàn:</b> {selectedTable.table_number}</span>
                                    <span><b>HĐ:</b> {orderIds.length ? orderIds.map((id) => `#${id}`).join(', ') : '--'}</span>
                                    <span><b>Mở:</b> {openedAt ? formatTime(openedAt) : '--:--'}</span>
                                    <span><b>In:</b> {formatTime(new Date())}</span>
                                    <span className="full">
                                        <b>Khách:</b>{' '}
                                        {customer ? `${customer.customer_name} (${customer.customer_phone})` : 'Khách vãng lai'}
                                    </span>
                                </div>

                                {loadingBill ? (
                                    <p className="bl-note">Đang nạp món…</p>
                                ) : billError ? (
                                    <div className="bl-error bl-no-print">
                                        <span>{billError}</span>
                                        <button type="button" className="bl-link" onClick={() => fetchBill(tableId)}>Thử lại</button>
                                    </div>
                                ) : !hasItems ? (
                                    <p className="bl-note">Bàn này chưa có món cần thanh toán.</p>
                                ) : (
                                    <>
                                        <ul className="bl-items">
                                            {billItems.map((item) => (
                                                <li className="bl-item" key={item.order_item_id}>
                                                    <span className="bl-item-qty">{item.quantity}×</span>
                                                    <span className="bl-item-name">
                                                        {item.item_name}
                                                        <span className="bl-item-sub">{money(item.item_price)}</span>
                                                        {item.note ? <span className="bl-item-sub">Ghi chú: {item.note}</span> : null}
                                                    </span>
                                                    <span className="bl-item-total">{money(Number(item.item_price) * item.quantity)}</span>
                                                    <button
                                                        type="button"
                                                        className="bl-x bl-no-print"
                                                        aria-label={`Hủy ${item.item_name}`}
                                                        title="Hủy món này"
                                                        onClick={() => askCancelItem(item)}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="bl-sums">
                                            <div className="bl-row"><span>Cộng tiền món</span><span>{money(subTotal)}</span></div>
                                            {vatLines.map((l) => (
                                                <div className="bl-row" key={l.rate}>
                                                    <span>Thuế VAT ({l.rate}%)</span><span>{money(l.amount)}</span>
                                                </div>
                                            ))}
                                            {pointsApplied > 0 && (
                                                <div className="bl-row minus">
                                                    <span>Giảm điểm thưởng ({pointsApplied} điểm)</span>
                                                    <span>-{money(discount)}</span>
                                                </div>
                                            )}
                                            <div className="bl-grand"><span>Tổng cộng</span><strong>{money(grandTotal)}</strong></div>
                                        </div>
                                    </>
                                )}

                                <p className="bl-thanks">Cảm ơn quý khách và hẹn gặp lại!</p>
                            </div>

                            <div className="bl-perf bl-no-print" />

                            <div className="bl-stub bl-no-print">
                                <button type="button" className="bl-btn-line" onClick={() => window.print()} disabled={!hasItems}>
                                    <Printer size={16} /> In phiếu tạm tính
                                </button>

                                {customer && availablePoints > 0 && (
                                    <div className="bl-points">
                                        <div className="bl-points-row">
                                            <p>
                                                Khách có {availablePoints} điểm
                                                <small>Mỗi điểm giảm {money(POINT_VALUE)}</small>
                                            </p>
                                            <div className="bl-step" role="group" aria-label="Số điểm dùng">
                                                <button
                                                    type="button"
                                                    aria-label="Giảm 1 điểm"
                                                    disabled={pointsApplied <= 0}
                                                    onClick={() => setPointsToUse(Math.max(0, pointsApplied - 1))}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <output>{pointsApplied}</output>
                                                <button
                                                    type="button"
                                                    aria-label="Tăng 1 điểm"
                                                    disabled={pointsApplied >= maxUsable}
                                                    onClick={() => setPointsToUse(Math.min(maxUsable, pointsApplied + 1))}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bl-points-row">
                                            <small>{earned > 0 ? `Thanh toán xong được cộng ${earned} điểm` : 'Chưa đủ tiền để cộng điểm'}</small>
                                            <button type="button" className="bl-link" onClick={() => setPointsToUse(maxUsable)} disabled={maxUsable === 0}>
                                                Dùng tối đa
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="bl-seg" role="radiogroup" aria-label="Hình thức thanh toán">
                                    <button type="button" role="radio" aria-checked={paymentMethod === 'cash'} onClick={() => setPaymentMethod('cash')}>
                                        <Banknote size={16} /> Tiền mặt
                                    </button>
                                    <button type="button" role="radio" aria-checked={paymentMethod === 'vietqr'} onClick={() => setPaymentMethod('vietqr')}>
                                        <QrCode size={16} /> Quét QR
                                    </button>
                                </div>

                                {paymentMethod === 'vietqr' && hasItems && (
                                    <div className="bl-qr">
                                        <button type="button" onClick={() => setQrOpen(true)} aria-label="Phóng to mã QR">
                                            <img src={qrUrl} alt={`Mã VietQR số tiền ${money(grandTotal)}`} />
                                        </button>
                                        <div className="bl-qr-info">
                                            <strong>{BANK.accountName}</strong>
                                            {BANK.label}<br />
                                            Số tiền {money(grandTotal)}<br />
                                            Bấm vào mã để phóng to
                                        </div>
                                    </div>
                                )}

                                <button type="button" className="bl-pay" disabled={!hasItems || loadingBill} onClick={askCheckout}>
                                    <CheckCircle2 size={20} />
                                    {hasItems ? `Thanh toán ${money(grandTotal)}` : 'Thanh toán'}
                                </button>
                            </div>
                        </>
                    )}
                </aside>
            </div>

            {/* ===== Phóng to mã QR ===== */}
            {qrOpen && selectedTable && (
                <div className="bl-overlay bl-no-print" onClick={() => setQrOpen(false)}>
                    <div className="bl-modal qr" role="dialog" aria-modal="true" aria-labelledby="bl-qr-title" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="bl-modal-close" aria-label="Đóng" onClick={() => setQrOpen(false)}>
                            <X size={18} />
                        </button>
                        <h2 id="bl-qr-title">Quét mã để chuyển khoản</h2>
                        <img src={qrUrl} alt={`Mã VietQR số tiền ${money(grandTotal)}`} />
                        <dl className="bl-facts">
                            <div><dt>Số tiền</dt><dd className="amount">{money(grandTotal)}</dd></div>
                            <div><dt>Nội dung</dt><dd>{transferNote}</dd></div>
                            <div><dt>Ngân hàng</dt><dd>{BANK.label}</dd></div>
                        </dl>
                    </div>
                </div>
            )}

            {dialog && <ConfirmDialog dialog={dialog} onClose={() => setDialog(null)} />}

            {toast && (
                <div className="bl-toast bl-no-print" role="status" data-type={toast.type}>
                    {toast.text}
                </div>
            )}
        </div>
    );
}

export default Billing;
