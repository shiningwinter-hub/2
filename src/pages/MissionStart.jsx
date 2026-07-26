import React, { useState, useRef } from 'react';

const CHARACTERS = {
  rabbit: { sleep: '🐰', wake: '🐰💦', happy: '🐇✨', name: 'Kawaii Bunny' },
  bear: { sleep: '🐻', wake: '🐻💦', happy: '🧸✨', name: 'Cozy Bear' },
  fox: { sleep: '🦊', wake: '🦊💦', happy: '🦊✨', name: 'Gentle Fox' },
};

export default function MissionStart() {
  const [charKey, setCharKey] = useState('rabbit');
  const [threshold, setThreshold] = useState(50);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('30');
  const [seconds, setSeconds] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentDb, setCurrentDb] = useState(0);
  const [petState, setPetState] = useState('sleep');
  const [statusMsg, setStatusMsg] = useState('Set your timer and relax.');

  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const reqIdRef = useRef(null);

  const checkDecibel = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    const db = Math.max(0, Math.round(((sum / dataArray.length) / 256) * 100 + 20));
    setCurrentDb(db);
    
    if (db > threshold) {
      setPetState('wake'); setStatusMsg(`Shh... too loud! (${db}dB)`);
    } else {
      setPetState('sleep'); setStatusMsg('Sleeping peacefully...');
    }
    reqIdRef.current = requestAnimationFrame(checkDecibel);
  };

  const startMission = async () => {
    const totalSeconds = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    if (totalSeconds <= 0) return alert('Please set the timer.');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      audioContextRef.current.createMediaStreamSource(stream).connect(analyserRef.current);
      
      setTimeLeft(totalSeconds); setIsRunning(true); setPetState('sleep');
      checkDecibel();
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { stopMission(true); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (e) { alert('Microphone access is required.'); }
  };

  const stopMission = (completed = false) => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    cancelAnimationFrame(reqIdRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setCurrentDb(0);
    if (completed) { setPetState('happy'); setStatusMsg('Great focus session! ✨'); }
    else { setPetState('wake'); setStatusMsg('Timer paused.'); }
  };

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div>
      <div className="card" style={{ padding: '40px 24px' }}>
        <div className="char-display">{CHARACTERS[charKey][petState]}</div>
        <p style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0 24px' }}>{statusMsg}</p>
        
        {isRunning && (
          <div style={{ background: 'var(--surface-low)', padding: '24px', borderRadius: '24px' }}>
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <div style={{ fontWeight: 600, color: 'var(--on-surface)' }}>
              Target: {threshold}dB
            </div>
          </div>
        )}
      </div>

      {!isRunning ? (
        <div className="card">
          <div className="input-group">
            <label>Choose a friend</label>
            <select value={charKey} onChange={e => setCharKey(e.target.value)}>
              {Object.entries(CHARACTERS).map(([k, v]) => (<option key={k} value={k}>{v.name}</option>))}
            </select>
          </div>
          <div className="input-group">
            <label>Noise limit (dB)</label>
            <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Time (H : M : S)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" placeholder="00" value={hours} onChange={e => setHours(e.target.value)} />
              <input type="number" placeholder="30" value={minutes} onChange={e => setMinutes(e.target.value)} />
              <input type="number" placeholder="00" value={seconds} onChange={e => setSeconds(e.target.value)} />
            </div>
          </div>
          <button className="btn" style={{ marginTop: '16px' }} onClick={startMission}>Start Focus</button>
        </div>
      ) : (
        <button className="btn stop" onClick={() => stopMission(false)}>End Session</button>
      )}
    </div>
  );
}
