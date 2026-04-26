interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ContentSectionsProps {
  countdown: CountdownTime;
}

export function ContentSections({ countdown }: ContentSectionsProps) {
  return (
    <>
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
                src="https://cdn.poehali.dev/projects/968b4fb1-7f9f-468c-b13b-8b979d7207c2/bucket/b48c2482-f8eb-4302-ab63-bf68c2859caf.jpeg"
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
    </>
  );
}