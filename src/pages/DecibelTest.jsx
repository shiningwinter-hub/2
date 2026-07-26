import React, { useState, useRef } from 'react';

export default function DecibelTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [currentDb, setCurrentDb] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const reqIdRef = useRef(null);

  const startTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      setIsTesting(true);
      checkDecibel();
    } catch (e) {
      alert('마이크 권한이 필요합니다.');
    }
  };

  const stopTest = () => {
    setIsTesting(false);
    cancelAnimationFrame(reqIdRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setCurrentDb(0);
  };

  const checkDecibel = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    const db = Math.max(0, Math.round(((sum / dataArray.length) / 256) * 100 + 20)); 
    setCurrentDb(db);
    reqIdRef.current = requestAnimationFrame(checkDecibel);
  };

  const isSafe = currentDb < 60;

  return (
    <div className="card">
      <p style={{ marginBottom: '40px', fontSize: '18px', fontWeight: '500', color: 'var(--on-surface-variant)' }}>
        Let's check the room noise.
      </p>
      
      <div className={`noise-monitor ${isSafe ? 'safe' : 'warning'}`}>
        <div className="noise-monitor-content">
          <h1 style={{ fontSize: '56px', margin: 0 }}>{currentDb}</h1>
          <span style={{ fontSize: '18px', fontWeight: 700 }}>dB</span>
        </div>
      </div>

      <p style={{ marginBottom: '32px', fontSize: '18px', fontWeight: '700' }}>
        {currentDb === 0 ? "Ready to listen" : (isSafe ? "Perfectly quiet! ✨" : "A bit loud... 🤫")}
      </p>

      {!isTesting ? (
        <button className="btn" onClick={startTest}>Start Listening</button>
      ) : (
        <button className="btn stop" onClick={stopTest}>Stop</button>
      )}
    </div>
  );
}
