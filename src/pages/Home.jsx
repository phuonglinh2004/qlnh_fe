import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ============================================================
   THÔNG TIN NHÀ HÀNG - sửa ở đây
   ============================================================ */
const INFO = {
    name: 'Paradise',
    slogan: 'Thiên đường ẩm thực',
    tagline: 'Những món ăn hấp dẫn, đem đến trải nghiệm khó quên.',
    phone: '0703249845',
    phoneDisplay: '0703 249 845',
    address: '237 Lê Văn Sỹ, Phường Tân Sơn Hòa, TP. Hồ Chí Minh',
    hours: '10:00 – 22:00, mỗi ngày', // sửa lại giờ thật của quán
    facebookPage: 'https://www.facebook.com/',       // link fanpage thật
    messengerUser: 'paradise.restaurant',            // tên fanpage để mở Messenger: m.me/<tên>
    instagram: 'https://www.instagram.com/',
};

// Món hiện đang là ví dụ, thay bằng món thật. price để trống '' thì sẽ ẩn giá.
// Có ảnh thật thì điền img: '/images/ten-anh.jpg'
const DISHES = [
    { name: 'Bò lúc lắc khoai tây', desc: 'Bò mềm xào lửa lớn, thơm bơ tỏi.', price: '', img: '' },
    { name: 'Cá hồi áp chảo sốt chanh dây', desc: 'Da giòn, thịt ẩm, sốt chua ngọt dịu.', price: '', img: '' },
    { name: 'Tôm nướng muối ớt', desc: 'Tôm tươi nướng than, chấm muối tiêu chanh.', price: '', img: '' },
    { name: 'Lẩu thái hải sản', desc: 'Nước dùng chua cay đậm vị, hải sản tươi.', price: '', img: '' },
    { name: 'Gỏi xoài khô cá sặc', desc: 'Xoài giòn, khô cá sặc, rau thơm đầy đặn.', price: '', img: '' },
    { name: 'Chè dừa non', desc: 'Món tráng miệng mát lạnh để kết bữa.', price: '', img: '' },
];

const STORY_POINTS = [
    { title: 'Nguyên liệu tươi', text: 'Chọn từng mẻ trong ngày, không để qua đêm.' },
    { title: 'Nêm nếm tận tâm', text: 'Mỗi món được đầu bếp nếm lại trước khi ra bàn.' },
    { title: 'Không gian dễ chịu', text: 'Đủ ấm để trò chuyện, đủ thoáng để thư giãn.' },
];

const REVIEWS = [
    { text: 'Món ra nhanh, nêm vừa miệng, nhân viên nhiệt tình. Sẽ rủ cả nhà quay lại.', who: 'Khách của Paradise' },
    { text: 'Không gian thoải mái, hợp đi nhóm bạn lẫn tiếp khách. Đồ ăn trình bày đẹp.', who: 'Khách của Paradise' },
    { text: 'Gọi món dễ, phục vụ chu đáo. Là chỗ mình hay chọn mỗi cuối tuần.', who: 'Khách của Paradise' },
];

// Đổi cho đúng API đặt bàn của backend
const RESERVATION_API = '/api/reservations';

const mapQuery = encodeURIComponent(INFO.address);
const MAP_EMBED = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

/* ============================================================ */

const Icon = {
    phone: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
    ),
    messenger: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.9 1.4 5.4 3.7 7.1V22l3.4-1.9c.9.2 1.9.4 2.9.4 5.5 0 10-4.1 10-9.3S17.5 2 12 2zm1 12.5-2.5-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.4 5.7z" /></svg>
    ),
    whatsapp: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.6-4.6A9 9 0 1 1 8 19.6L3 21z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4.5 4.5 0 0 1-2-2l.8-1-1-2L9 8.5z" /></svg>
    ),
    pin: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
    ),
};

export default function Home() {
    const [form, setForm] = useState({ name: '', phone: '', date: '', time: '18:00', guests: 2, note: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | ok | error

    const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch(RESERVATION_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Request failed');
            setStatus('ok');
            setForm({ name: '', phone: '', date: '', time: '18:00', guests: 2, note: '' });
        } catch {
            setStatus('error');
        }
    };

    const go = (id) => (e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="pd">
            <style>{css}</style>

            {/* ---------- Nút liên hệ nổi ---------- */}
            <aside className="float" aria-label="Liên hệ nhanh">
                <a className="fb fb-phone" href={`tel:${INFO.phone}`} aria-label="Gọi điện" data-tip="Gọi ngay">{Icon.phone}</a>
                <a className="fb fb-mess" href={`https://m.me/${INFO.messengerUser}`} target="_blank" rel="noreferrer" aria-label="Nhắn Messenger" data-tip="Messenger">{Icon.messenger}</a>
                <a className="fb fb-zalo" href={`https://zalo.me/${INFO.phone}`} target="_blank" rel="noreferrer" aria-label="Nhắn Zalo" data-tip="Zalo"><span>Zalo</span></a>
                <a className="fb fb-wa" href={`https://wa.me/84${INFO.phone.slice(1)}`} target="_blank" rel="noreferrer" aria-label="Nhắn WhatsApp" data-tip="WhatsApp">{Icon.whatsapp}</a>
            </aside>

            {/* ---------- Thanh điều hướng ---------- */}
            <header className="nav">
                <a href="#top" className="brand" onClick={go('top')}>{INFO.name}</a>
                <nav aria-label="Điều hướng chính">
                    <a href="#story" onClick={go('story')}>Câu chuyện</a>
                    <a href="#dishes" onClick={go('dishes')}>Món ngon</a>
                    <a href="#reviews" onClick={go('reviews')}>Khách nói gì</a>
                    <a href="#book" onClick={go('book')}>Đặt bàn</a>
                    <a href="#map" onClick={go('map')}>Địa chỉ</a>
                </nav>
                <a href={`tel:${INFO.phone}`} className="btn btn-coral small">{INFO.phoneDisplay}</a>
            </header>

            {/* ---------- Hero ---------- */}
            <section id="top" className="hero">
                <div className="sun" aria-hidden="true"><i /><i /><i /></div>
                <div className="hero-inner">
                    <p className="hero-kicker">{INFO.name} Restaurant</p>
                    <h1>{INFO.slogan}</h1>
                    <p className="hero-sub">{INFO.tagline}</p>
                    <div className="hero-cta">
                        <a href="#book" className="btn btn-coral" onClick={go('book')}>Đặt bàn ngay</a>
                        <Link to="/order" className="btn btn-ghost">Gọi món tại bàn</Link>
                    </div>
                    <p className="hero-addr">{Icon.pin}<span>{INFO.address}</span></p>
                </div>
            </section>

            {/* ---------- Câu chuyện ---------- */}
            <section id="story" className="section story">
                <div className="story-quote">
                    <h2>Có những bữa ăn khiến bạn quên hết bộn bề.</h2>
                </div>
                <div className="story-text">
                    <p>
                        Chúng tôi đặt tên quán là <strong>Paradise</strong> vì một ý nghĩ rất giản dị: cả ngày
                        chạy theo công việc, ai cũng cần một nơi để dừng lại. Một chiếc bàn, vài người thân
                        quen, và những món ăn làm câu chuyện kéo dài thêm một chút.
                    </p>
                    <p>
                        Ở Paradise, thực đơn không cầu kỳ. Món nào lên bàn cũng được chọn kỹ từ nguyên liệu,
                        nêm nếm cẩn thận và trình bày để bạn muốn chụp lại trước khi ăn. Gọi món theo ý bạn,
                        ăn theo nhịp của bạn.
                    </p>
                    <p className="story-end">Hẹn gặp bạn tại Lê Văn Sỹ.</p>
                </div>
                <ul className="points">
                    {STORY_POINTS.map((p) => (
                        <li key={p.title}>
                            <h3>{p.title}</h3>
                            <p>{p.text}</p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ---------- Món ngon ---------- */}
            <section id="dishes" className="section dishes-sec">
                <div className="section-head">
                    <h2>Món được gọi nhiều</h2>
                    <p>Gọi món thoải mái theo khẩu vị, quét mã tại bàn hoặc báo nhân viên.</p>
                </div>
                <div className="dishes">
                    {DISHES.map((d, i) => (
                        <article className={`dish tone-${i % 3}`} key={d.name}>
                            <div className="dish-img" style={d.img ? { backgroundImage: `url(${d.img})` } : undefined} />
                            <div className="dish-body">
                                <h3>{d.name}</h3>
                                <p>{d.desc}</p>
                                {d.price && <span className="price">{d.price}</span>}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ---------- Đánh giá ---------- */}
            <section id="reviews" className="section">
                <div className="section-head">
                    <h2>Khách hàng nói gì</h2>
                </div>
                <div className="reviews">
                    {REVIEWS.map((r, i) => (
                        <figure className="review" key={i}>
                            <blockquote>{r.text}</blockquote>
                            <figcaption>{r.who} · 5/5</figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            {/* ---------- Đặt bàn ---------- */}
            <section id="book" className="book">
                <div className="book-wrap">
                    <div className="book-info">
                        <h2>Giữ chỗ cho bữa tối của bạn</h2>
                        <p>Điền thông tin, Paradise sẽ gọi xác nhận trong thời gian sớm nhất.</p>
                        <dl>
                            <dt>Địa chỉ</dt><dd>{INFO.address}</dd>
                            <dt>Giờ mở cửa</dt><dd>{INFO.hours}</dd>
                            <dt>Điện thoại</dt><dd><a href={`tel:${INFO.phone}`}>{INFO.phoneDisplay}</a></dd>
                        </dl>
                    </div>

                    <form className="form" onSubmit={submit}>
                        <label>Họ tên
                            <input name="name" value={form.name} onChange={update} required autoComplete="name" />
                        </label>
                        <label>Số điện thoại
                            <input name="phone" type="tel" value={form.phone} onChange={update} required autoComplete="tel" />
                        </label>
                        <div className="row">
                            <label>Ngày
                                <input name="date" type="date" value={form.date} onChange={update} required />
                            </label>
                            <label>Giờ
                                <input name="time" type="time" value={form.time} onChange={update} required />
                            </label>
                            <label>Số người
                                <input name="guests" type="number" min="1" max="50" value={form.guests} onChange={update} required />
                            </label>
                        </div>
                        <label>Ghi chú
                            <textarea name="note" rows="2" value={form.note} onChange={update} placeholder="Dịp đặc biệt, dị ứng thực phẩm, yêu cầu chỗ ngồi…" />
                        </label>
                        <button className="btn btn-coral full" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Đang gửi…' : 'Đặt bàn'}
                        </button>
                        {status === 'ok' && <p className="msg ok" role="status">Đã nhận yêu cầu đặt bàn. Paradise sẽ gọi xác nhận cho bạn.</p>}
                        {status === 'error' && <p className="msg err" role="alert">Chưa gửi được. Vui lòng thử lại hoặc gọi {INFO.phoneDisplay}.</p>}
                    </form>
                </div>
            </section>

            {/* ---------- Bản đồ ---------- */}
            <section id="map" className="section map-sec">
                <div className="map-card">
                    <div className="map-text">
                        <h2>Tìm Paradise</h2>
                        <p className="map-addr">{INFO.address}</p>
                        <p>{INFO.hours}</p>
                        <div className="map-btns">
                            <a className="btn btn-coral" href={MAP_LINK} target="_blank" rel="noreferrer">Chỉ đường</a>
                            <a className="btn btn-outline" href={`tel:${INFO.phone}`}>Gọi {INFO.phoneDisplay}</a>
                        </div>
                    </div>
                    <iframe
                        title="Bản đồ Paradise Restaurant"
                        src={MAP_EMBED}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                </div>
            </section>

            {/* ---------- Chân trang ---------- */}
            <footer className="footer">
                <div className="footer-inner">
                    <div>
                        <strong className="brand">{INFO.name}</strong>
                        <p>{INFO.slogan}</p>
                    </div>
                    <div className="social">
                        <a href={INFO.facebookPage} target="_blank" rel="noreferrer">Facebook</a>
                        <a href={`https://zalo.me/${INFO.phone}`} target="_blank" rel="noreferrer">Zalo</a>
                        <a href={INFO.instagram} target="_blank" rel="noreferrer">Instagram</a>
                    </div>
                    <Link to="/login" className="staff">Dành cho nhân viên</Link>
                </div>
                <p className="copy">© {new Date().getFullYear()} Paradise Restaurant</p>
            </footer>
        </div>
    );
}

/* ============================================================
   CSS
   ============================================================ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;800&display=swap&subset=vietnamese');

.pd {
  --lagoon: #0a2f35;
  --lagoon-2: #11454c;
  --coral: #ff6a4d;
  --sun: #ffc247;
  --mint: #bfe6d8;
  --paper: #f7f8f5;
  --ink: #14201f;
  --muted: #5c6b69;
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
  color: var(--ink);
  background: var(--paper);
  line-height: 1.65;
  overflow-x: hidden;
}
.pd *, .pd *::before, .pd *::after { box-sizing: border-box; }
.pd h1, .pd h2, .pd h3, .pd p, .pd figure, .pd dl, .pd ul { margin: 0; padding: 0; }
.pd h1, .pd h2 { font-family: 'Playfair Display', Georgia, serif; font-weight: 800; line-height: 1.1; }
.pd h3 { font-weight: 700; line-height: 1.3; }
.pd a { color: inherit; }
.pd :focus-visible { outline: 3px solid var(--sun); outline-offset: 3px; }

/* Nút liên hệ nổi */
.float { position: fixed; right: 16px; top: 50%; transform: translateY(-50%); z-index: 50; display: flex; flex-direction: column; gap: 12px; }
.fb { position: relative; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; color: #fff; text-decoration: none; box-shadow: 0 6px 18px rgba(0,0,0,.25); transition: transform .15s; }
.fb:hover { transform: scale(1.1); }
.fb::after { content: attr(data-tip); position: absolute; right: 62px; background: var(--ink); color: #fff; font-size: .8rem; padding: 4px 10px; border-radius: 6px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .15s; }
.fb:hover::after, .fb:focus-visible::after { opacity: 1; }
.fb-phone { background: var(--coral); }
.fb-phone::before { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--coral); animation: ring 2.2s ease-out infinite; }
.fb-mess { background: #0084ff; }
.fb-zalo { background: #0068ff; font-weight: 700; font-size: .8rem; }
.fb-wa { background: #25d366; }
@keyframes ring { from { transform: scale(1); opacity: .8; } to { transform: scale(1.7); opacity: 0; } }

/* Nav */
.nav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 14px clamp(16px, 4vw, 56px); background: rgba(10,47,53,.92); backdrop-filter: blur(10px); color: #fff; }
.nav .brand, .footer .brand { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.5rem; text-decoration: none; color: var(--sun); }
.nav nav { display: flex; gap: 28px; }
.nav nav a { text-decoration: none; font-size: .95rem; opacity: .85; }
.nav nav a:hover { opacity: 1; }

/* Buttons */
.btn { display: inline-block; border: 0; cursor: pointer; font: 600 1rem 'Be Vietnam Pro', sans-serif; padding: 14px 28px; border-radius: 999px; text-decoration: none; text-align: center; transition: transform .15s, background .15s; }
.btn:hover { transform: translateY(-2px); }
.btn.small { padding: 9px 20px; font-size: .9rem; }
.btn.full { width: 100%; }
.btn:disabled { opacity: .6; cursor: wait; }
.btn-coral { background: var(--coral); color: #fff; }
.btn-ghost { border: 2px solid rgba(255,255,255,.7); color: #fff; }
.btn-outline { border: 2px solid var(--lagoon); color: var(--lagoon); }

/* Hero: mặt trời nhiệt đới */
.hero { position: relative; min-height: min(88vh, 820px); display: flex; align-items: center; background: var(--lagoon); color: #fff; overflow: hidden; padding: 90px clamp(20px, 6vw, 80px); }
.sun { position: absolute; right: -8vw; top: 50%; width: min(62vw, 720px); aspect-ratio: 1; transform: translateY(-50%); }
.sun i { position: absolute; border-radius: 50%; inset: 0; }
.sun i:nth-child(1) { background: radial-gradient(circle at 35% 30%, var(--sun), var(--coral) 70%); inset: 18%; }
.sun i:nth-child(2) { border: 2px solid rgba(255,194,71,.5); inset: 8%; }
.sun i:nth-child(3) { border: 2px solid rgba(255,194,71,.22); inset: 0; }
.hero-inner { position: relative; max-width: 700px; animation: rise .9s ease both; }
.hero-kicker { color: var(--sun); font-weight: 600; margin-bottom: 18px; }
.hero h1 { font-size: clamp(3rem, 8vw, 6rem); }
.hero-sub { max-width: 480px; margin: 22px 0 34px; font-size: 1.15rem; opacity: .9; }
.hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
.hero-addr { display: flex; align-items: center; gap: 8px; margin-top: 36px; font-size: .95rem; opacity: .8; }
.hero-addr svg { color: var(--sun); flex: none; }
@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

/* Section */
.section { padding: clamp(60px, 8vw, 110px) clamp(20px, 6vw, 80px); max-width: 1240px; margin: 0 auto; }
.section-head { margin-bottom: 44px; }
.section-head h2 { font-size: clamp(2rem, 4.5vw, 3rem); }
.section-head p { margin-top: 12px; color: var(--muted); max-width: 520px; }

/* Câu chuyện */
.story { display: grid; grid-template-columns: 1fr 1fr; gap: 40px clamp(32px, 6vw, 90px); align-items: start; }
.story-quote h2 { font-size: clamp(2.2rem, 5vw, 3.6rem); color: var(--lagoon); }
.story-text { display: grid; gap: 18px; color: var(--muted); font-size: 1.05rem; max-width: 56ch; }
.story-text strong { color: var(--ink); }
.story-end { color: var(--coral); font-weight: 600; }
.points { grid-column: 1 / -1; list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 20px; }
.points li { padding-top: 18px; border-top: 3px solid var(--sun); }
.points h3 { margin-bottom: 6px; }
.points p { color: var(--muted); font-size: .95rem; }

/* Món ăn */
.dishes-sec { max-width: none; background: var(--mint); }
.dishes-sec > * { max-width: 1240px; margin-left: auto; margin-right: auto; }
.dishes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.dish { background: #fff; border-radius: 20px; overflow: hidden; }
.dish-img { aspect-ratio: 4 / 3; background-size: cover; background-position: center; }
.tone-0 .dish-img { background-color: var(--coral); background-image: radial-gradient(circle at 70% 30%, var(--sun) 0 22%, transparent 23%); }
.tone-1 .dish-img { background-color: var(--lagoon-2); background-image: radial-gradient(circle at 30% 70%, var(--mint) 0 24%, transparent 25%); }
.tone-2 .dish-img { background-color: var(--sun); background-image: radial-gradient(circle at 60% 60%, var(--coral) 0 20%, transparent 21%); }
.dish-body { padding: 20px 22px 24px; }
.dish h3 { font-size: 1.15rem; margin-bottom: 6px; }
.dish p { color: var(--muted); font-size: .95rem; }
.price { display: inline-block; margin-top: 12px; font-weight: 700; color: var(--coral); }

/* Đánh giá */
.reviews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.review { padding-top: 18px; border-top: 3px solid var(--ink); }
.review blockquote { margin: 0 0 14px; font-family: 'Playfair Display', serif; font-size: 1.15rem; line-height: 1.55; }
.review figcaption { color: var(--muted); font-size: .9rem; }

/* Đặt bàn */
.book { background: var(--lagoon); color: #fff; padding: clamp(60px, 8vw, 110px) clamp(20px, 6vw, 80px); }
.book-wrap { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(32px, 6vw, 90px); align-items: start; }
.book-info h2 { font-size: clamp(2rem, 4.5vw, 3rem); margin-bottom: 16px; }
.book-info > p { opacity: .85; margin-bottom: 28px; }
.book dl { display: grid; grid-template-columns: auto 1fr; gap: 10px 20px; }
.book dt { color: var(--sun); }
.book dd { margin: 0; }
.form { background: #fff; color: var(--ink); padding: 32px; border-radius: 24px; display: grid; gap: 16px; }
.form label { display: grid; gap: 6px; font-size: .9rem; font-weight: 500; }
.form input, .form textarea { font: inherit; padding: 12px 14px; border: 1.5px solid #cfd8d5; border-radius: 12px; background: #fff; width: 100%; }
.form input:focus, .form textarea:focus { border-color: var(--coral); outline: none; box-shadow: 0 0 0 3px rgba(255,106,77,.22); }
.row { display: grid; grid-template-columns: 1.3fr 1fr .8fr; gap: 12px; }
.msg { padding: 12px 14px; border-radius: 12px; font-size: .95rem; }
.msg.ok { background: #dff3e6; color: #1e5a33; }
.msg.err { background: #fbe0dc; color: #8a1c1c; }

/* Bản đồ */
.map-card { display: grid; grid-template-columns: 1fr 1.6fr; border-radius: 24px; overflow: hidden; background: #fff; box-shadow: 0 20px 50px -30px rgba(10,47,53,.5); }
.map-text { padding: clamp(24px, 4vw, 48px); display: grid; gap: 14px; align-content: center; }
.map-text h2 { font-size: clamp(1.8rem, 3.5vw, 2.4rem); color: var(--lagoon); }
.map-addr { font-weight: 600; }
.map-text p { color: var(--muted); }
.map-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
.map-card iframe { width: 100%; height: 100%; min-height: 380px; border: 0; }

/* Footer */
.footer { background: var(--ink); color: rgba(255,255,255,.8); }
.footer-inner { max-width: 1240px; margin: 0 auto; padding: 40px clamp(20px, 6vw, 80px) 16px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
.social { display: flex; gap: 22px; }
.social a, .staff { text-decoration: none; }
.social a:hover { color: var(--sun); }
.staff { font-size: .85rem; opacity: .55; }
.staff:hover { opacity: 1; }
.copy { text-align: center; font-size: .8rem; opacity: .5; padding: 0 16px 28px; }

/* Responsive */
@media (max-width: 960px) {
  .nav nav { display: none; }
  .story, .book-wrap, .map-card { grid-template-columns: 1fr; }
  .dishes, .reviews { grid-template-columns: 1fr 1fr; }
  .sun { opacity: .5; right: -25vw; width: 90vw; }
}
@media (max-width: 620px) {
  .dishes, .reviews, .points { grid-template-columns: 1fr; }
  .row { grid-template-columns: 1fr 1fr; }
  .row label:last-child { grid-column: 1 / -1; }
  .form { padding: 22px; }
  .float { top: auto; bottom: 16px; transform: none; gap: 10px; }
  .fb { width: 46px; height: 46px; }
  .fb::after { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-inner, .fb-phone::before { animation: none; }
  .btn, .fb { transition: none; }
}
`;