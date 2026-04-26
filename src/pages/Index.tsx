import { useState, useRef, useEffect, useCallback } from 'react';

const VK_NOTIFY_URL = 'https://functions.poehali.dev/207bd5e2-1d61-48ed-b39c-0753ddb6ec82';

// Royalty-free track — cinematic romantic piano, similar vibe to Golden Brown x Love Story
// Source: Pixabay (CC0)
const MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b05d05e.mp3';

const WEDDING_DATE = new Date('2026-09-06T11:20:00');

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('revealed'); } }),
      { threshold: 0.15 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Countdown hook ── */
function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

export default function Index() {
  useReveal();
  const countdown = useCountdown(WEDDING_DATE);

  /* Music */
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [musicStarted, setMusicStarted] = useState(false);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.play()
      .then(() => { setPlaying(true); setMusicStarted(true); })
      .catch(() => { setMusicStarted(true); });
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => setPlaying(true)).catch((_e) => {}); }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  /* RSVP Form */
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [wish, setWish] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !attendance) return;
    setSending(true);
    try {
      await fetch(VK_NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attendance, guests_count: guestsCount, message: wish }),
      });
    } catch (_e) { /* ignore */ }
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div className="inv">
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-inner">

          {/* Music button */}
          {!musicStarted ? (
            <button className="music-trigger reveal" onClick={startMusic}>
              <span className="music-icon">▷</span>
              <span className="music-note">♪</span>
              ВКЛЮЧИТЬ МУЗЫКУ
            </button>
          ) : (
            <div className="mini-player reveal">
              <button className="mini-play" onClick={togglePlay}>{playing ? '⏸' : '▷'}</button>
              <span className="mini-label">Golden Brown × Love Story</span>
              <input
                type="range" min={0} max={1} step={0.02}
                value={volume}
                onChange={e => handleVolume(Number(e.target.value))}
                className="vol-range"
              />
            </div>
          )}
          {!musicStarted && <p className="music-hint">Нажмите, чтобы включить музыку</p>}

          <h1 className="hero-title reveal">Свадебное приглашение</h1>
          <p className="hero-names-top reveal">СОНЯ · 6 СЕНТЯБРЯ 2026</p>

          {/* Save the date card */}
          <div className="save-card reveal">
            <div className="save-inner">
              <p className="save-eyebrow">Мы женимся!</p>
              <p className="save-sub">и счастливы пригласить вас</p>
              <div className="names-block">
                <span className="name-big">Соня</span>
                <span className="amp">&</span>
                <span className="name-big">...</span>
              </div>
            </div>
          </div>

          {/* Save the date */}
          <div className="std-box reveal">
            <p className="std-label">SAVE THE DATE</p>
            <p className="std-date">06 / 09 / 26</p>
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section className="section cream">
        <div className="sec-inner">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Cupid_Bouguereau_%281875%29.jpg/512px-Cupid_Bouguereau_%281875%29.jpg"
            alt="Купидон"
            className="cupid reveal"
          />
          <p className="quote-text reveal">
            Мы так счастливы пригласить вас разделить с<br />нами радость нашей любви…
          </p>

          <h2 className="sec-title reveal">До свадьбы осталось</h2>
          <div className="countdown reveal">
            {[
              { v: countdown.days, l: 'дней' },
              { v: countdown.hours, l: 'часов' },
              { v: countdown.minutes, l: 'минут' },
              { v: countdown.seconds, l: 'секунд' },
            ].map(({ v, l }) => (
              <div key={l} className="cd-item">
                <span className="cd-num">{String(v).padStart(2, '0')}</span>
                <span className="cd-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="section dark-section">
        <div className="sec-inner">
          <h2 className="sec-title light reveal">Локация</h2>
          <div className="location-card reveal">
            <p className="loc-flowers">🌸 🌺 🌸</p>
            <p className="loc-name">г/к «Аврора», 1 этаж</p>
            <p className="loc-addr">ул. Поворотникова, д. 6</p>
            <div className="loc-img-wrap">
              <img
                src="https://cdn.poehali.dev/projects/968b4fb1-7f9f-468c-b13b-8b979d7207c2/bucket/3477840c-6bc0-474b-b092-f52cef28e42b.png"
                alt="г/к Аврора"
                className="loc-img"
              />
            </div>
            <p className="loc-flowers">🌺 🌸 🌺</p>
          </div>
        </div>
      </section>

      {/* ── TIMING ── */}
      <section className="section cream">
        <div className="sec-inner">
          <h2 className="sec-title reveal">Тайминг</h2>
          <div className="timeline">
            {[
              { time: '11:20', title: 'Церемония в ЗАГСе', sub: 'Центральный ЗАГС' },
              { time: '16:30', title: 'Сбор гостей', sub: 'г/к «Аврора»' },
              { time: '17:00', title: 'Праздничный банкет', sub: 'Торжество и угощения' },
              { time: '23:00', title: 'Окончание вечера', sub: 'Свадебный торт & Прощание' },
            ].map(({ time, title, sub }, i) => (
              <div key={i} className="tl-item reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="tl-time">{time}</div>
                <div className="tl-line" />
                <div className="tl-content">
                  <p className="tl-title">{title}</p>
                  <p className="tl-sub">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DRESS CODE ── */}
      <section className="section dark-section">
        <div className="sec-inner">
          <h2 className="sec-title light reveal">Дресс-код</h2>
          <div className="dress-colors reveal">
            <span className="dc-circle" style={{ background: '#6d1a2a' }} />
            <span className="dc-circle" style={{ background: '#e8e0d5' }} />
            <span className="dc-circle" style={{ background: '#d4859a' }} />
            <span className="dc-circle" style={{ background: '#c9b99a' }} />
          </div>
          <p className="dress-text reveal">
            Нам будет приятно видеть вас в тёплых, элегантных<br />
            нарядах цветовой гаммы нашей свадьбы
          </p>
          <div className="sun reveal">☀️</div>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section className="section cream">
        <div className="sec-inner">
          <h2 className="sec-title reveal">Форма гостя</h2>
          <p className="rsvp-sub reveal">Сможете ли вы прийти? Пожалуйста, ответьте до 1 августа 2026</p>

          {submitted ? (
            <div className="success reveal">
              <div className="success-icon">💌</div>
              <p className="success-title">Спасибо!</p>
              <p className="success-sub">Твой ответ получен — очень ждём тебя!</p>
            </div>
          ) : (
            <form className="rsvp-form reveal" onSubmit={handleSubmit}>
              <input
                className="f-input"
                type="text"
                placeholder="Имя Фамилия"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <div className="radio-group">
                <label className={`radio-opt${attendance === 'yes' ? ' selected' : ''}`}>
                  <input type="radio" name="att" value="yes" onChange={() => setAttendance('yes')} hidden />
                  Да, с удовольствием буду
                </label>
                <label className={`radio-opt${attendance === 'no' ? ' selected' : ''}`}>
                  <input type="radio" name="att" value="no" onChange={() => setAttendance('no')} hidden />
                  К сожалению, не смогу
                </label>
                <label className={`radio-opt${attendance === 'maybe' ? ' selected' : ''}`}>
                  <input type="radio" name="att" value="maybe" onChange={() => setAttendance('maybe')} hidden />
                  Пока не уверен(а)
                </label>
              </div>

              {attendance === 'yes' && (
                <div className="counter-row">
                  <span className="counter-label">Количество гостей:</span>
                  <div className="counter">
                    <button type="button" className="cnt-btn" onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}>−</button>
                    <span className="cnt-val">{guestsCount}</span>
                    <button type="button" className="cnt-btn" onClick={() => setGuestsCount(Math.min(10, guestsCount + 1))}>+</button>
                  </div>
                </div>
              )}

              <textarea
                className="f-input f-textarea"
                placeholder="Пожелания молодожёнам (необязательно)"
                value={wish}
                onChange={e => setWish(e.target.value)}
                rows={3}
              />

              <button
                className="submit-btn"
                type="submit"
                disabled={sending || !name || !attendance}
              >
                {sending ? 'Отправляю...' : 'Отправить ответ'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p className="footer-title">Соня & ...</p>
        <p className="footer-date">6 сентября 2026</p>
        <p className="footer-love">С любовью ♥</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Golos+Text:wght@400;500&family=Great+Vibes&display=swap');

        :root {
          --burgundy: #6d1a2a;
          --burgundy-dark: #4a1020;
          --cream: #f5ede8;
          --cream2: #fdf8f4;
          --rose: #d4859a;
          --gold: #c9a96e;
          --text: #3a1a1a;
          --text-mid: #7a5050;
          --text-light: #b09090;
          --white: #fff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .inv {
          font-family: 'Golos Text', sans-serif;
          color: var(--text);
          background: var(--cream2);
          overflow-x: hidden;
        }

        /* ── SCROLL REVEAL ── */
        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          background: var(--burgundy-dark);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1.5rem 3rem;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, #8b2035 0%, #4a1020 60%, #2a0810 100%);
        }
        .hero-inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center;
          width: 100%; max-width: 480px;
          gap: 0.8rem;
        }

        /* Music trigger */
        .music-trigger {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.95);
          border: none; border-radius: 999px;
          padding: 0.75rem 2rem;
          font-family: 'Golos Text', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: var(--burgundy);
          cursor: pointer;
          margin-top: 0.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
        .music-trigger:hover { transform: scale(1.03); }
        .music-icon { font-size: 1rem; }
        .music-note { font-size: 1rem; }
        .music-hint {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }

        /* Mini player */
        .mini-player {
          display: flex; align-items: center; gap: 0.6rem;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          padding: 0.5rem 1.2rem;
          margin-top: 0.5rem;
        }
        .mini-play {
          background: none; border: none;
          color: #fff; font-size: 1.1rem; cursor: pointer;
        }
        .mini-label {
          font-size: 0.75rem; color: rgba(255,255,255,0.8);
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          white-space: nowrap;
        }
        .vol-range {
          width: 70px; accent-color: var(--rose);
          cursor: pointer;
        }

        /* Hero title */
        .hero-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.5rem, 10vw, 4rem);
          color: #fff;
          text-align: center;
          margin-top: 1.5rem;
          line-height: 1.2;
        }
        .hero-names-top {
          font-size: 0.72rem;
          letter-spacing: 0.25em;
          color: rgba(255,255,255,0.6);
          text-align: center;
        }

        /* Save card */
        .save-card {
          width: 100%;
          background: var(--cream);
          border-radius: 4px;
          margin-top: 1rem;
          overflow: hidden;
        }
        .save-inner {
          padding: 2rem 1.5rem;
          text-align: center;
          border: 2px solid var(--burgundy);
          margin: 12px;
          border-radius: 2px;
        }
        .save-eyebrow {
          font-family: 'Great Vibes', cursive;
          font-size: 2rem;
          color: var(--burgundy);
        }
        .save-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: var(--rose);
          font-size: 1rem;
          margin-bottom: 1.2rem;
        }
        .names-block {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
        }
        .name-big {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(3rem, 12vw, 5rem);
          color: var(--burgundy);
          line-height: 1;
        }
        .amp {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          color: var(--rose);
          font-style: italic;
        }

        /* Save the date box */
        .std-box {
          width: 100%;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 4px;
          padding: 1.2rem;
          text-align: center;
        }
        .std-label {
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.55);
          margin-bottom: 0.3rem;
        }
        .std-date {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 9vw, 3.5rem);
          font-weight: 300;
          color: #fff;
          letter-spacing: 0.05em;
        }

        /* ── SECTIONS ── */
        .section { padding: 4rem 1.5rem; }
        .cream { background: var(--cream2); }
        .dark-section { background: var(--burgundy-dark); }

        .sec-inner {
          max-width: 520px; margin: 0 auto;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
        }

        .sec-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2rem, 8vw, 3rem);
          color: var(--burgundy);
        }
        .sec-title.light { color: #fff; }

        /* Cupid */
        .cupid {
          width: 180px; height: 180px;
          object-fit: cover;
          border-radius: 4px;
        }
        .quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.05rem;
          color: var(--text-mid);
          line-height: 1.7;
          text-align: center;
        }

        /* ── COUNTDOWN ── */
        .countdown {
          display: flex; gap: 0.8rem; flex-wrap: wrap; justify-content: center;
        }
        .cd-item {
          display: flex; flex-direction: column; align-items: center;
          background: var(--white);
          border: 1px solid rgba(109,26,42,0.2);
          border-radius: 12px;
          padding: 1rem 1.4rem;
          min-width: 72px;
          box-shadow: 0 2px 12px rgba(109,26,42,0.06);
        }
        .cd-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 600;
          color: var(--burgundy);
          line-height: 1;
        }
        .cd-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-light);
          margin-top: 0.3rem;
        }

        /* ── LOCATION ── */
        .location-card {
          background: var(--cream2);
          border-radius: 8px;
          padding: 1.5rem 1rem 1rem;
          width: 100%;
          text-align: center;
          overflow: hidden;
        }
        .loc-flowers { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .loc-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          color: var(--text);
          margin-bottom: 0.25rem;
        }
        .loc-addr {
          font-size: 0.9rem;
          color: var(--text-mid);
          margin-bottom: 1rem;
        }
        .loc-img-wrap { width: 100%; border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
        .loc-img { width: 100%; height: 200px; object-fit: cover; display: block; }

        /* ── TIMELINE ── */
        .timeline {
          width: 100%;
          display: flex; flex-direction: column; gap: 0;
        }
        .tl-item {
          display: grid;
          grid-template-columns: 80px 1px 1fr;
          gap: 0 1rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(109,26,42,0.12);
          text-align: left;
        }
        .tl-item:last-child { border-bottom: none; }
        .tl-time {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.9rem;
          font-weight: 400;
          color: var(--burgundy);
          line-height: 1;
          text-align: right;
          padding-top: 2px;
        }
        .tl-line {
          background: rgba(212, 133, 154, 0.4);
          width: 1px;
        }
        .tl-content { padding-left: 0.5rem; }
        .tl-title {
          font-family: 'Great Vibes', cursive;
          font-size: 1.5rem;
          color: var(--text);
          line-height: 1.2;
        }
        .tl-sub {
          font-size: 0.82rem;
          color: var(--text-mid);
          margin-top: 0.2rem;
          letter-spacing: 0.02em;
        }

        /* ── DRESS CODE ── */
        .dress-colors {
          display: flex; gap: 1rem; justify-content: center;
        }
        .dc-circle {
          width: 52px; height: 52px;
          border-radius: 50%;
          display: block;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .dress-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.05rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
          text-align: center;
        }
        .sun { font-size: 2.5rem; }

        /* ── RSVP ── */
        .rsvp-sub {
          font-size: 0.9rem;
          color: var(--text-mid);
          text-align: center;
        }
        .rsvp-form {
          width: 100%;
          display: flex; flex-direction: column; gap: 1rem;
          text-align: left;
        }
        .f-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 1.5px solid rgba(109,26,42,0.25);
          border-radius: 8px;
          background: #fff;
          font-family: 'Golos Text', sans-serif;
          font-size: 1rem;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
        }
        .f-input:focus { border-color: var(--burgundy); }
        .f-textarea { resize: vertical; min-height: 90px; }

        .radio-group {
          display: flex; flex-direction: column; gap: 0.6rem;
        }
        .radio-opt {
          display: flex; align-items: center; gap: 0.7rem;
          padding: 0.75rem 1rem;
          border: 1.5px solid rgba(109,26,42,0.2);
          border-radius: 8px;
          background: #fff;
          font-size: 0.95rem;
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s;
        }
        .radio-opt::before {
          content: '';
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(109,26,42,0.3);
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .radio-opt.selected {
          border-color: var(--burgundy);
          background: rgba(109,26,42,0.04);
        }
        .radio-opt.selected::before {
          background: var(--burgundy);
          border-color: var(--burgundy);
          box-shadow: inset 0 0 0 3px #fff;
        }

        .counter-row {
          display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
        }
        .counter-label { font-size: 0.9rem; color: var(--text-mid); }
        .counter { display: flex; align-items: center; gap: 0.8rem; }
        .cnt-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1.5px solid rgba(109,26,42,0.3);
          background: #fff; color: var(--burgundy);
          font-size: 1.2rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .cnt-btn:hover { background: rgba(109,26,42,0.07); }
        .cnt-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; color: var(--text);
          min-width: 28px; text-align: center;
        }

        .submit-btn {
          padding: 1rem 2.5rem;
          background: var(--burgundy);
          color: #fff;
          border: none; border-radius: 999px;
          font-family: 'Golos Text', sans-serif;
          font-size: 1rem; font-weight: 500;
          cursor: pointer;
          align-self: center;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.03em;
        }
        .submit-btn:hover:not(:disabled) { background: var(--burgundy-dark); transform: scale(1.02); }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Success */
        .success {
          text-align: center; padding: 2rem;
        }
        .success-icon { font-size: 3rem; margin-bottom: 0.8rem; }
        .success-title {
          font-family: 'Great Vibes', cursive;
          font-size: 2.5rem; color: var(--burgundy);
          margin-bottom: 0.4rem;
        }
        .success-sub { color: var(--text-mid); font-size: 1rem; }

        /* ── FOOTER ── */
        .footer {
          background: var(--burgundy-dark);
          text-align: center;
          padding: 3rem 1.5rem;
        }
        .footer-title {
          font-family: 'Great Vibes', cursive;
          font-size: 2.5rem; color: #fff;
          margin-bottom: 0.4rem;
        }
        .footer-date {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; color: rgba(255,255,255,0.55);
          letter-spacing: 0.1em;
        }
        .footer-love {
          margin-top: 0.8rem;
          font-size: 0.9rem; color: var(--rose);
        }
      `}</style>
    </div>
  );
}
