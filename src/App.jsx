import React, { useState } from 'react';
import DecibelTest from './pages/DecibelTest';
import MissionStart from './pages/MissionStart';
import TodoList from './pages/TodoList';

function App() {
  const [activeTab, setActiveTab] = useState('mission');

  const getTitle = () => {
    if (activeTab === 'test') return '데시벨 테스트 🎙️';
    if (activeTab === 'mission') return '조용한 친구들 🐰';
    if (activeTab === 'todo') return '오늘의 할 일 📝';
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>{getTitle()}</h1>
      </div>

      <div className="content">
        <div style={{ display: activeTab === 'test' ? 'block' : 'none' }}>
          <DecibelTest />
        </div>
        <div style={{ display: activeTab === 'mission' ? 'block' : 'none' }}>
          <MissionStart />
        </div>
        <div style={{ display: activeTab === 'todo' ? 'block' : 'none' }}>
          <TodoList />
        </div>
      </div>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'test' ? 'active' : ''}`} 
          onClick={() => setActiveTab('test')}
        >
          <span className="icon">🎙️</span>
          <span>테스트</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'mission' ? 'active' : ''}`} 
          onClick={() => setActiveTab('mission')}
        >
          <span className="icon">⏱️</span>
          <span>타이머</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'todo' ? 'active' : ''}`} 
          onClick={() => setActiveTab('todo')}
        >
          <span className="icon">📝</span>
          <span>할 일</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
