import React, { useState } from 'react';
import DecibelTest from './pages/DecibelTest';
import MissionStart from './pages/MissionStart';
import TodoList from './pages/TodoList';

function App() {
  const [activeTab, setActiveTab] = useState('mission');

  const getTitle = () => {
    if (activeTab === 'test') return '데시벨 테스트';
    if (activeTab === 'mission') return '조용한 친구들';
    if (activeTab === 'todo') return '오늘의 할 일';
  };

  return (
    <div className="app-frame text-on-background font-body-md">
      
      {/* Header (Absolute relative to app-frame) */}
      <header className="absolute top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 px-container-padding-mobile flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-headline-md text-[24px] font-bold text-primary">{getTitle()}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="scroll-area bg-background">
        <div style={{ display: activeTab === 'test' ? 'block' : 'none' }}>
          <DecibelTest />
        </div>
        <div style={{ display: activeTab === 'mission' ? 'block' : 'none' }}>
          <MissionStart />
        </div>
        <div style={{ display: activeTab === 'todo' ? 'block' : 'none' }}>
          <TodoList />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full z-50 bg-surface/80 backdrop-blur-xl pb-2 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-20">
          <button 
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${activeTab === 'test' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
            onClick={() => setActiveTab('test')}
          >
            <span className="material-symbols-outlined text-[28px]">graphic_eq</span>
            <span className="font-label-sm text-[12px]">데시벨 테스트</span>
          </button>
          
          <button 
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${activeTab === 'mission' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
            onClick={() => setActiveTab('mission')}
          >
            <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
            <span className="font-label-sm text-[12px]">미션 시작</span>
          </button>
          
          <button 
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${activeTab === 'todo' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
            onClick={() => setActiveTab('todo')}
          >
            <span className="material-symbols-outlined text-[28px]">checklist</span>
            <span className="font-label-sm text-[12px]">할 일</span>
          </button>
        </div>
      </nav>

    </div>
  );
}

export default App;
