import { useState } from 'react';

const VK_NOTIFY_URL = 'https://functions.poehali.dev/207bd5e2-1d61-48ed-b39c-0753ddb6ec82';

export function RsvpSection() {
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
    <>
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
        <p className="footer-title">Евгений & София</p>
        <p className="footer-date">22 июля 2026</p>
        <p className="footer-love">С любовью ♥</p>
      </footer>
    </>
  );
}