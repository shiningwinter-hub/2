import React, { useState, useRef, useEffect } from 'react';

const CHARACTERS = [
  { id: 'rabbit', name: '토끼', imgPos: '0%' },
  { id: 'bear', name: '곰', imgPos: '25%' },
  { id: 'fox', name: '여우', imgPos: '50%' },
  { id: 'dog', name: '강아지', imgPos: '75%' },
  { id: 'cat', name: '고양이', imgPos: '100%' }
];

export default function MissionStart() {
  const [missionState, setMissionState] = useState('setting'); // setting, active, summary
  
  // Setting State
  const [activeMode, setActiveMode] = useState('공부/집중');
  const [timeStr, setTimeStr] = useState('00:30:00');
  const [threshold, setThreshold] = useState(45);
  const [charId, setCharId] = useState('rabbit');

  // Active State
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentDb, setCurrentDb] = useState(0);
  const [sleepStatus, setSleepStatus] = useState('얕은 잠 (적응 중...)');
  const [isAwake, setIsWake] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [maxDb, setMaxDb] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const reqIdRef = useRef(null);
  const timerRef = useRef(null);

  const handleStart = async () => {
    const parts = timeStr.split(':');
    const totalSeconds = parseInt(parts[0])*3600 + parseInt(parts[1])*60 + parseInt(parts[2]);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      audioContextRef.current.createMediaStreamSource(stream).connect(analyserRef.current);
      
      setTimeLeft(totalSeconds);
      setProgress(0);
      setMaxDb(0);
      setMissionState('active');
      
      const initialTotal = totalSeconds;

      const checkDb = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const db = Math.max(0, Math.round(((sum / dataArray.length) / 256) * 100 + 20));
        
        setCurrentDb(db);
        setMaxDb(prev => Math.max(prev, db));

        if (db > threshold) {
          setIsWake(true);
          setTimeout(() => setIsWake(false), 2000);
        }
        
        reqIdRef.current = requestAnimationFrame(checkDb);
      };
      
      checkDb();

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleStop(true);
            return 0;
          }
          setProgress(((initialTotal - (prev - 1)) / initialTotal) * 100);
          
          const p = ((initialTotal - (prev - 1)) / initialTotal) * 100;
          if (p < 25) setSleepStatus('얕은 잠 (적응 중...)');
          else if (p < 75) setSleepStatus('깊은 잠 (고요해요)');
          else setSleepStatus('숙면 중 (매우 안정적)');
          
          return prev - 1;
        });
      }, 1000);

    } catch (e) { alert('마이크 권한이 필요합니다.'); }
  };

  const handleStop = (completed = false) => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(reqIdRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    
    if (completed) {
      setMissionState('summary');
      fetchFeedback();
    } else {
      if(confirm('미션을 중단하시겠어요?')) {
        setMissionState('summary');
        fetchFeedback();
      }
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/api/generate', { method: 'POST' });
      const data = await res.json();
      setFeedback(data.message || "오늘도 조용히 해줘서 고마워요!");
    } catch(e) {
      setFeedback("수고하셨습니다!");
    }
  };

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const dbBars = Array.from({length: 12}).map((_, i) => (
    <div key={i} className="w-1.5 bg-primary-fixed-dim rounded-full transition-all duration-150" 
         style={{ height: missionState === 'active' ? `${Math.random() * (currentDb/2) + 4}px` : '4px' }}></div>
  ));

  if (missionState === 'setting') {
    return (
      <div className="flex flex-col w-full px-container-padding-mobile gap-8 pt-4 pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline-lg-mobile text-[28px] font-bold text-on-surface">미션 설정</h1>
          <p className="font-body-md text-[16px] text-on-surface-variant">오늘의 정숙한 도전을 시작해볼까요? ✨</p>
        </div>

        <section className="grid grid-cols-2 gap-4">
          <button className={`flex flex-col gap-3 p-5 rounded-lg col-span-2 transition-all ${activeMode==='공부/집중' ? 'bg-primary-container text-on-primary-container ring-4 ring-primary/20' : 'bg-surface-container-high text-on-surface-variant'}`} onClick={()=>setActiveMode('공부/집중')}>
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-[32px]">menu_book</span>
              {activeMode === '공부/집중' && <span className="material-symbols-outlined">check_circle</span>}
            </div>
            <div className="text-left">
              <p className="font-headline-md text-[20px] font-bold">공부/집중</p>
              <p className="font-label-sm text-[12px] opacity-80">도서관처럼 조용한 몰입 시간</p>
            </div>
          </button>
          
          <button className={`flex flex-col gap-3 p-5 rounded-lg transition-all ${activeMode==='어린이 수면' ? 'bg-secondary-container text-on-secondary-container ring-4 ring-primary/20' : 'bg-surface-container-high text-on-surface-variant'}`} onClick={()=>setActiveMode('어린이 수면')}>
             <span className="material-symbols-outlined text-[32px]">child_care</span>
             <div className="text-left">
              <p className="font-headline-md text-[18px] font-bold">어린이 수면</p>
              <p className="font-label-sm text-[12px] opacity-80">꿈나라를 지켜주세요</p>
            </div>
          </button>

          <button className={`flex flex-col gap-3 p-5 rounded-lg transition-all ${activeMode==='회의/스터디' ? 'bg-surface-container-highest text-on-surface-variant ring-4 ring-primary/20' : 'bg-surface-container-high text-on-surface-variant'}`} onClick={()=>setActiveMode('회의/스터디')}>
             <span className="material-symbols-outlined text-[32px]">groups</span>
             <div className="text-left">
              <p className="font-headline-md text-[18px] font-bold">회의/스터디</p>
              <p className="font-label-sm text-[12px] opacity-80">배려하는 대화</p>
            </div>
          </button>
        </section>

        <div className="bg-surface-container-low p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">schedule</span>
            <h3 className="font-label-md text-[16px] font-bold">목표 시간 설정</h3>
          </div>
          <div className="bg-white/50 p-4 rounded-DEFAULT shadow-inner">
            <input className="bg-transparent text-center font-headline-md text-[24px] font-bold w-full outline-none text-on-surface" type="text" value={timeStr} onChange={e=>setTimeStr(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-full bg-white text-on-surface-variant font-label-sm shadow-sm" onClick={()=>setTimeStr('00:15:00')}>15분</button>
            <button className="flex-1 py-2 rounded-full bg-primary-fixed-dim text-on-primary-fixed-variant font-label-sm shadow-sm" onClick={()=>setTimeStr('00:30:00')}>30분</button>
            <button className="flex-1 py-2 rounded-full bg-white text-on-surface-variant font-label-sm shadow-sm" onClick={()=>setTimeStr('01:00:00')}>1시간</button>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">volume_up</span>
              <h3 className="font-label-md text-[16px] font-bold">소음 제한 수치</h3>
            </div>
            <span className="text-primary font-headline-md text-[24px] font-bold">{threshold} <span className="text-[14px]">dB</span></span>
          </div>
          <input className="w-full h-2 bg-outline-variant rounded-lg appearance-none accent-primary" type="range" min="30" max="90" value={threshold} onChange={e=>setThreshold(e.target.value)} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary px-1">
            <span className="material-symbols-outlined">pets</span>
            <h3 className="font-label-md text-[16px] font-bold">함께할 조용한 친구</h3>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
            {CHARACTERS.map(char => (
              <button key={char.id} className={`snap-center flex-shrink-0 flex flex-col items-center gap-2 ${charId === char.id ? 'active' : ''}`} onClick={()=>setCharId(char.id)}>
                <div className={`w-20 h-20 rounded-full p-1 transition-all shadow-sm ${charId === char.id ? 'bg-tertiary-container scale-110' : ''}`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                     <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5ogYWj6cmiv4ORXS63vyT96bp9nL6X0cxUlnZF4DWoqjLeGszNJBBF6TGO_hZhzeQ-IgtqnMDj5GUkyIFH_x931apHTwQEHCuWktMGreyay6mavv8ErO4utibTxZKiqegsc2ktkZHh2gzajpN6vRrCC-IIFTSnOvHrh2WChS47ef5EW9eJ5A_S3WkJkwS3AlyPghFjU7zDlhwMm_iXPkMPevN04VFu5ZitLqZP3DHUWnSgpY9oCv-Nf4I3BVqMx5hA2-I_x-CJw" 
                          className="absolute h-full max-w-none w-[500%]" style={{ left: `-${parseInt(char.imgPos)}%` }} alt={char.name} />
                  </div>
                </div>
                <span className={`font-label-sm text-[12px] ${charId === char.id ? 'text-tertiary font-bold' : 'text-on-surface-variant'}`}>{char.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="w-full py-5 rounded-lg bg-tertiary text-on-tertiary font-headline-md text-[20px] font-bold shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-3" onClick={handleStart}>
          <span className="material-symbols-outlined">rocket_launch</span> 미션 시작!
        </button>
      </div>
    );
  }

  if (missionState === 'active') {
    return (
      <div className="flex flex-col w-full px-container-padding-mobile pb-10 select-none gap-8">
        <div className="flex flex-col items-center justify-center pt-8">
          <div className="bg-secondary-container/50 px-6 py-2 rounded-full mb-2 shadow-sm">
            <span className="font-headline-md text-[32px] font-bold text-on-secondary-container tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-md text-[16px] text-secondary font-bold">{sleepStatus}</span>
          </div>
        </div>

        <div className="relative flex justify-center items-center py-4">
          <div className={`absolute w-64 h-64 rounded-full blur-3xl animate-pulse ${progress > 75 ? 'bg-tertiary-fixed/30' : progress > 25 ? 'bg-primary-fixed-dim/30' : 'bg-secondary-fixed/30'}`}></div>
          <div className="relative z-10 w-64 h-64 bg-surface-container rounded-full shadow-xl flex items-center justify-center overflow-hidden">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5ogYWj6cmiv4ORXS63vyT96bp9nL6X0cxUlnZF4DWoqjLeGszNJBBF6TGO_hZhzeQ-IgtqnMDj5GUkyIFH_x931apHTwQEHCuWktMGreyay6mavv8ErO4utibTxZKiqegsc2ktkZHh2gzajpN6vRrCC-IIFTSnOvHrh2WChS47ef5EW9eJ5A_S3WkJkwS3AlyPghFjU7zDlhwMm_iXPkMPevN04VFu5ZitLqZP3DHUWnSgpY9oCv-Nf4I3BVqMx5hA2-I_x-CJw" 
                  className="absolute h-[110%] max-w-none w-[550%] transition-transform duration-500" 
                  style={{ left: `-${parseInt(CHARACTERS.find(c=>c.id===charId).imgPos)*1.1}%`, transform: isAwake ? 'scale(1.2) rotate(5deg)' : 'scale(1)' }} alt="Character" />
             
             {isAwake && (
               <div className="absolute inset-0 bg-error/20 flex flex-col items-center justify-center transition-opacity duration-300">
                 <span className="material-symbols-outlined text-error text-[48px] mb-2">warning</span>
                 <p className="font-headline-md text-[20px] font-bold text-error">동물이 깼어요!</p>
               </div>
             )}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-white/20">
          <div className="flex justify-between items-end mb-4">
            <div className="flex flex-col">
              <span className="font-label-sm text-[12px] text-outline font-bold">소음 레벨</span>
              <span className="font-headline-md text-[32px] font-bold text-primary">{currentDb} <small className="text-[16px]">dB</small></span>
            </div>
            <div className="flex gap-1 h-12 items-end">
              {dbBars}
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-[14px] text-on-surface-variant font-bold">진행률</span>
              <span className="font-label-md text-[14px] text-primary font-bold">{Math.floor(progress)}%</span>
            </div>
            <div className="w-full h-4 bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <button className="w-full h-16 bg-surface-container-highest text-on-surface-variant font-headline-md text-[20px] font-bold rounded-full shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2" onClick={()=>handleStop(false)}>
          <span className="material-symbols-outlined">stop_circle</span> 정지
        </button>
      </div>
    );
  }

  // Summary
  return (
    <div className="flex flex-col w-full px-container-padding-mobile gap-8 pt-8 pb-10">
      <div className="bg-secondary-container p-8 rounded-xl flex flex-col items-center text-center shadow-lg">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          <span className="material-symbols-outlined text-primary text-[48px] filled">task_alt</span>
        </div>
        <h2 className="font-headline-lg text-[32px] font-bold text-on-secondary-container mb-4">미션 완료!</h2>
        <p className="font-body-lg text-[18px] text-on-secondary-container leading-relaxed">
          {feedback || "결과를 불러오는 중..."}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container p-6 rounded-lg text-center">
          <span className="font-label-sm text-[12px] text-outline block mb-1">총 수면 시간</span>
          <span className="font-headline-md text-[24px] font-bold text-on-surface">{timeStr}</span>
        </div>
        <div className="bg-surface-container p-6 rounded-lg text-center">
          <span className="font-label-sm text-[12px] text-outline block mb-1">최고 소음</span>
          <span className="font-headline-md text-[24px] font-bold text-error">{maxDb} dB</span>
        </div>
      </div>
      
      <button className="h-16 bg-tertiary text-on-tertiary font-headline-md text-[20px] font-bold rounded-full shadow-xl active:scale-95 transition-all" onClick={() => setMissionState('setting')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}
