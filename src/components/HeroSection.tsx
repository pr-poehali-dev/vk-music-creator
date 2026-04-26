import { useRef, useState, useCallback } from 'react';

// Шопен — Ноктюрн Op.9 No.2 (публичный домен, загружен в CDN)
const MUSIC_URL = 'https://cdn.poehali.dev/projects/968b4fb1-7f9f-468c-b13b-8b979d7207c2/bucket/music/wedding-nocturne.mp3';

interface HeroSectionProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
  musicStarted: boolean;
  setMusicStarted: (v: boolean) => void;
}

export function HeroSection({
  audioRef,
  playing,
  setPlaying,
  volume,
  setVolume,
  musicStarted,
  setMusicStarted,
}: HeroSectionProps) {
  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.play()
      .then(() => { setPlaying(true); setMusicStarted(true); })
      .catch(() => { setMusicStarted(true); });
  }, [audioRef, volume, setPlaying, setMusicStarted]);

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

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-inner">

        {!musicStarted ? (
          <button className="music-trigger reveal" onClick={startMusic}>
            <span className="music-icon">▷</span>
            <span className="music-note">♪</span>
            ВКЛЮЧИТЬ МУЗЫКУ
          </button>
        ) : (
          <div className="mini-player reveal">
            <button className="mini-play" onClick={togglePlay}>{playing ? '⏸' : '▷'}</button>
            <span className="mini-label">Шопен · Ноктюрн Op.9 №2</span>
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
        <p className="hero-names-top reveal">ЕВГЕНИЙ & СОФИЯ · 22 ИЮЛЯ 2026</p>

        <div className="save-card reveal">
          <div className="save-inner">
            <p className="save-eyebrow">Мы женимся!</p>
            <p className="save-sub">и счастливы пригласить вас</p>
            <div className="names-block">
              <span className="name-big">Евгений</span>
              <span className="amp">&</span>
              <span className="name-big">София</span>
            </div>
          </div>
        </div>

        <div className="std-box reveal">
          <p className="std-label">SAVE THE DATE</p>
          <p className="std-date">22 / 07 / 26</p>
        </div>
      </div>
    </section>
  );
}

export { MUSIC_URL };