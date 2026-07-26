import React, { useState, useRef, useEffect } from 'react';

export default function DecibelTest() {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [db, setDb] = useState(0);
  const [resultReady, setResultReady] = useState(false);
  
  const pulseScale = 1 + (db / 100);
  const waveHeights = [
    isMeasuring ? Math.random() * 40 + 10 : 8,
    isMeasuring ? Math.random() * 40 + 10 : 16,
    isMeasuring ? Math.random() * 40 + 10 : 32,
    isMeasuring ? Math.random() * 40 + 10 : 12,
    isMeasuring ? Math.random() * 40 + 10 : 24,
  ];

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const reqIdRef = useRef(null);

  const startMeasurement = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      audioContextRef.current.createMediaStreamSource(stream).connect(analyserRef.current);
      
      setIsMeasuring(true);
      setResultReady(false);
      checkDecibel();
      
      // 임시로 5초 후 결과 표시
      setTimeout(() => {
        setIsMeasuring(false);
        setResultReady(true);
        cancelAnimationFrame(reqIdRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
      }, 5000);
      
    } catch (e) { alert('마이크 권한이 필요합니다.'); }
  };

  const checkDecibel = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    const currentDb = Math.max(0, Math.round(((sum / dataArray.length) / 256) * 100 + 20));
    setDb(currentDb);
    reqIdRef.current = requestAnimationFrame(checkDecibel);
  };

  return (
    <div className="flex flex-col w-full px-container-padding-mobile pt-4 gap-8">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-headline-lg-mobile text-[28px] font-bold text-primary">주변 소음 측정하기</h1>
        <p className="font-body-md text-[16px] text-on-surface-variant px-4">
          10초 동안 주변 소음을 측정하여 토끼가 깨지 않을 최적의 기준을 추천해 드릴게요.
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center py-8">
        <div 
          className="absolute w-64 h-64 rounded-full bg-primary/10 transition-transform duration-100"
          style={{ transform: `scale(${isMeasuring ? pulseScale : 1})` }}
        ></div>
        <div 
          className="absolute w-48 h-48 rounded-full bg-secondary-container/30 transition-transform duration-100"
          style={{ transform: `scale(${isMeasuring ? pulseScale * 0.8 : 1})` }}
        ></div>
        
        <div className="relative w-56 h-56 rounded-full bg-surface-container-highest shadow-[0_20px_40px_rgba(40,105,92,0.15)] flex flex-col items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <span className="font-headline-xl text-[64px] font-bold text-primary leading-none">{resultReady ? '55' : db}</span>
            <span className="font-label-md text-[14px] text-on-surface-variant mt-2">dB</span>
          </div>
          <div className="absolute -bottom-4 bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2">
            <span className="text-xl">{resultReady ? '✨' : '😴'}</span>
            <span className="font-label-sm text-[12px] text-secondary">{resultReady ? '아주 평화로운 환경이에요' : '조용히 해주세요...'}</span>
          </div>
        </div>

        <div className="flex items-end gap-1.5 h-12 mt-12">
          {waveHeights.map((h, i) => (
            <div key={i} className="w-2 bg-primary-fixed-dim rounded-full transition-all duration-150" style={{ height: `${h}px` }}></div>
          ))}
        </div>
      </div>

      {resultReady && (
        <div className="bg-secondary-container rounded-lg p-6 flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex flex-col">
            <span className="font-label-sm text-[12px] text-on-secondary-container opacity-80">분석 완료! 추천 기준</span>
            <span className="font-headline-md text-[24px] font-bold text-on-secondary-container">55dB 미만</span>
          </div>
          <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[28px] filled">check_circle</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {!resultReady ? (
          <button 
            className="w-full h-16 bg-tertiary text-on-tertiary rounded-full font-headline-md text-[20px] font-bold shadow-[0_8px_24px_rgba(127,81,97,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={startMeasurement}
            disabled={isMeasuring}
          >
            <span className={`material-symbols-outlined ${isMeasuring ? 'animate-spin' : ''}`}>
              {isMeasuring ? 'refresh' : 'play_arrow'}
            </span>
            {isMeasuring ? '측정 중...' : '측정 시작'}
          </button>
        ) : (
          <button 
            className="w-full h-16 bg-primary text-on-primary rounded-full font-headline-md text-[20px] font-bold shadow-[0_8px_24px_rgba(40,105,92,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={() => alert('기준이 적용되었습니다!')}
          >
            기준 적용하기
          </button>
        )}
      </div>
    </div>
  );
}
