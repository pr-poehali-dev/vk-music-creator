import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const VK_NOTIFY_URL = 'https://functions.poehali.dev/207bd5e2-1d61-48ed-b39c-0753ddb6ec82';
const BG_IMAGE = 'https://cdn.poehali.dev/projects/968b4fb1-7f9f-468c-b13b-8b979d7207c2/files/618afe86-45fb-4908-9dfc-2792c65249cc.jpg';

// Royalty-free romantic ambient track (Pixabay / Free Music Archive)
const MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f45b517.mp3';

const WEDDING_DATE = new Date('2026-09-06T16:00:00');

function useCountdown(target: Date) {
  const [time, setTime] = useState(() => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  });
  useEffect(() => {
    const id = setInterval(() => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

export default function Index() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [wish, setWish] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const countdown = useCountdown(WEDDING_DATE);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v > 0) setMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !muted;
    setMuted(next);
    audioRef.current.volume = next ? 0 : volume;
  };

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
    <div className="invitation-root">
      <audio ref={audioRef} src={MUSIC_URL} loop preload="none" />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: `url(${BG_IMAGE})` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Мы выходим замуж</p>
          <h1 className="hero-names">Соня <span className="amp">&</span> ...</h1>
          <p className="hero-date">6 сентября 2026</p>
          <div className="divider-flowers">✦ ✿ ✦</div>

          {/* Countdown */}
          <div className="countdown">
            {[
              { v: countdown.days, l: 'дней' },
              { v: countdown.hours, l: 'часов' },
              { v: countdown.minutes, l: 'минут' },
              { v: countdown.seconds, l: 'секунд' },
            ].map(({ v, l }) => (
              <div key={l} className="countdown-item">
                <span className="countdown-num">{String(v).padStart(2, '0')}</span>
                <span className="countdown-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Music player */}
        <div className="player">
          <button className="player-btn" onClick={togglePlay} aria-label="play/pause">
            <Icon name={playing ? 'Pause' : 'Play'} size={18} />
          </button>
          <div className="player-info">
            <span className="player-title">Golden Brown × Love Story</span>
            <span className="player-sub">Музыка для тебя 🎶</span>
          </div>
          <button className="player-mute" onClick={toggleMute} aria-label="mute">
            <Icon name={muted || volume === 0 ? 'VolumeX' : 'Volume2'} size={16} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={e => handleVolume(Number(e.target.value))}
            className="volume-slider"
            aria-label="громкость"
          />
        </div>
      </section>

      {/* Dear guest */}
      <section className="section section-light">
        <div className="section-inner">
          <div className="divider-flowers">✿</div>
          <h2 className="section-title">Дорогой гость</h2>
          <p className="section-text">
            Мы рады пригласить тебя разделить с нами один из самых важных дней в нашей жизни —
            день нашей свадьбы. Твоё присутствие сделает этот праздник ещё более особенным и
            незабываемым для нас обоих.
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="section section-rose">
        <div className="section-inner">
          <h2 className="section-title">Детали торжества</h2>
          <div className="details-grid">
            <div className="detail-card">
              <Icon name="Calendar" size={28} />
              <span className="detail-label">Дата</span>
              <span className="detail-value">6 сентября 2026</span>
            </div>
            <div className="detail-card">
              <Icon name="Clock" size={28} />
              <span className="detail-label">Время</span>
              <span className="detail-value">16:00</span>
            </div>
            <div className="detail-card">
              <Icon name="MapPin" size={28} />
              <span className="detail-label">Место</span>
              <span className="detail-value">Уточним позже</span>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="section section-light">
        <div className="section-inner">
          <h2 className="section-title">Подтверди присутствие</h2>
          <p className="section-text">Пожалуйста, ответь до 1 августа 2026</p>

          {submitted ? (
            <div className="success-block">
              <div className="success-icon">💌</div>
              <p className="success-title">Спасибо!</p>
              <p className="success-sub">Твой ответ получен, мы очень ждём тебя!</p>
            </div>
          ) : (
            <form className="rsvp-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Твоё имя</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Имя Фамилия"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Придёшь?</label>
                <div className="attendance-group">
                  {[
                    { v: 'yes', l: '✅ Да, буду!' },
                    { v: 'no', l: '❌ Не смогу' },
                    { v: 'maybe', l: '🤔 Пока не знаю' },
                  ].map(({ v, l }) => (
                    <button
                      key={v}
                      type="button"
                      className={`attendance-btn${attendance === v ? ' active' : ''}`}
                      onClick={() => setAttendance(v)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {attendance === 'yes' && (
                <div className="form-group">
                  <label className="form-label">Сколько человек придёт?</label>
                  <div className="counter-group">
                    <button type="button" className="counter-btn" onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}>−</button>
                    <span className="counter-val">{guestsCount}</span>
                    <button type="button" className="counter-btn" onClick={() => setGuestsCount(Math.min(10, guestsCount + 1))}>+</button>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Пожелание молодожёнам (необязательно)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Напиши пожелание..."
                  value={wish}
                  onChange={e => setWish(e.target.value)}
                  rows={3}
                />
              </div>

              <button className="submit-btn" type="submit" disabled={sending || !name || !attendance}>
                {sending ? 'Отправляю...' : 'Отправить ответ 💌'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>С любовью, Соня &amp; ... ✨</p>
        <p className="footer-sub">6 сентября 2026</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Golos+Text:wght@400;500&display=swap');

        :root {
          --rose: #c9737a;
          --rose-light: #f0d5d7;
          --rose-pale: #fdf6f6;
          --gold: #c9a96e;
          --gold-light: #f5e8cc;
          --cream: #fef9f4;
          --text-dark: #3d2c2c;
          --text-mid: #7a5c5c;
          --text-light: #b09090;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .invitation-root {
          font-family: 'Golos Text', sans-serif;
          color: var(--text-dark);
          background: var(--cream);
          min-height: 100vh;
        }

        /* HERO */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem 7rem;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center top;
          background-attachment: fixed;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(253,246,246,0.45) 0%, rgba(253,246,246,0.72) 60%, rgba(254,249,244,1) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        .hero-eyebrow {
          font-family: 'Golos Text', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 1rem;
        }
        .hero-names {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 12vw, 6rem);
          font-weight: 300;
          color: var(--text-dark);
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }
        .amp {
          color: var(--rose);
          font-style: italic;
        }
        .hero-date {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 300;
          color: var(--text-mid);
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
        }
        .divider-flowers {
          color: var(--rose);
          font-size: 1.1rem;
          letter-spacing: 0.5em;
          margin: 1rem 0;
        }

        /* COUNTDOWN */
        .countdown {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          border: 1px solid var(--rose-light);
          border-radius: 12px;
          padding: 0.8rem 1.2rem;
          min-width: 70px;
        }
        .countdown-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 600;
          color: var(--rose);
          line-height: 1;
        }
        .countdown-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-light);
          margin-top: 0.2rem;
        }

        /* PLAYER */
        .player {
          position: fixed;
          bottom: 1.2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(16px);
          border: 1px solid var(--rose-light);
          border-radius: 999px;
          padding: 0.55rem 1.1rem;
          box-shadow: 0 4px 24px rgba(201,115,122,0.15);
          min-width: 280px;
          max-width: 90vw;
        }
        .player-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--rose);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .player-btn:hover { background: #b55e65; }
        .player-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .player-title {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-dark);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .player-sub {
          font-size: 0.68rem;
          color: var(--text-light);
        }
        .player-mute {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-mid);
          display: flex; align-items: center;
          padding: 4px;
        }
        .volume-slider {
          width: 60px;
          accent-color: var(--rose);
          cursor: pointer;
        }

        /* SECTIONS */
        .section {
          padding: 4rem 1.5rem;
        }
        .section-light { background: var(--cream); }
        .section-rose { background: var(--rose-pale); }
        .section-inner {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 5vw, 2.6rem);
          font-weight: 400;
          color: var(--text-dark);
          margin-bottom: 1.2rem;
        }
        .section-text {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-mid);
        }

        /* DETAILS */
        .details-grid {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
        }
        .detail-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          background: #fff;
          border: 1px solid var(--rose-light);
          border-radius: 16px;
          padding: 1.5rem 1.8rem;
          min-width: 130px;
          color: var(--rose);
        }
        .detail-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-light);
        }
        .detail-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: var(--text-dark);
          font-weight: 500;
        }

        /* RSVP FORM */
        .rsvp-form {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          margin-top: 2rem;
          text-align: left;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-mid);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .form-input, .form-textarea {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1.5px solid var(--rose-light);
          border-radius: 10px;
          background: #fff;
          font-family: 'Golos Text', sans-serif;
          font-size: 1rem;
          color: var(--text-dark);
          outline: none;
          transition: border-color 0.2s;
          resize: vertical;
        }
        .form-input:focus, .form-textarea:focus {
          border-color: var(--rose);
        }
        .attendance-group {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .attendance-btn {
          padding: 0.6rem 1rem;
          border: 1.5px solid var(--rose-light);
          border-radius: 999px;
          background: #fff;
          font-family: 'Golos Text', sans-serif;
          font-size: 0.9rem;
          color: var(--text-dark);
          cursor: pointer;
          transition: all 0.2s;
        }
        .attendance-btn:hover { border-color: var(--rose); }
        .attendance-btn.active {
          background: var(--rose);
          border-color: var(--rose);
          color: #fff;
        }
        .counter-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .counter-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--rose-light);
          background: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--rose);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .counter-btn:hover { background: var(--rose-light); }
        .counter-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          color: var(--text-dark);
          min-width: 32px;
          text-align: center;
        }
        .submit-btn {
          padding: 0.9rem 2rem;
          background: var(--rose);
          color: #fff;
          border: none;
          border-radius: 999px;
          font-family: 'Golos Text', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
          align-self: center;
        }
        .submit-btn:hover:not(:disabled) { background: #b55e65; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* SUCCESS */
        .success-block {
          text-align: center;
          padding: 2.5rem 1rem;
        }
        .success-icon { font-size: 3rem; margin-bottom: 0.8rem; }
        .success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: var(--rose);
          margin-bottom: 0.4rem;
        }
        .success-sub { color: var(--text-mid); }

        /* FOOTER */
        .footer {
          text-align: center;
          padding: 2.5rem 1rem 5rem;
          background: var(--rose-pale);
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: var(--text-mid);
        }
        .footer-sub {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-top: 0.3rem;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}