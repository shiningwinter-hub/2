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
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setCurrentDb(0);
  };

  const checkDecibel = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    const avg = sum / dataArray.length;
    const db = Math.max(0, Math.round((avg / 256) * 100 + 20)); 
    setCurrentDb(db);

    reqIdRef.current = requestAnimationFrame(checkDecibel);
  };

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <p style={{ color: 'var(--text-light)', marginBottom: '30px', fontWeight: '500' }}>
        현재 마이크로 들어오는 소음의<br/>크기를 확인해 보세요!
      </p>
      
      <div style={{ 
        width: '150px', height: '150px', 
        borderRadius: '50%', 
        background: `conic-gradient(var(--primary-color) ${currentDb}%, #F0F0F0 0)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 30px',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          width: '120px', height: '120px',
          background: 'white', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', margin: 0 }}>{currentDb}</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 'bold' }}>dB</span>
        </div>
      </div>

      {!isTesting ? (
        <button className="btn" onClick={startTest}>측정 시작하기</button>
      ) : (
        <button className="btn stop" onClick={stopTest}>측정 멈추기</button>
      )}
    </div>
  );
}
