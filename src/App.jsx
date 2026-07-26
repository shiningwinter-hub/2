import React, { useState } from 'react';
import DecibelTest from './pages/DecibelTest';
import MissionStart from './pages/MissionStart';
import TodoList from './pages/TodoList';

function App() {
  const [activeTab, setActiveTab] = useState('mission');

  const getTitle = () => {
    if (activeTab === 'test') return 'Noise Test';
    if (activeTab === 'mission') return 'Focus Time';
    if (activeTab === 'todo') return 'Cozy Tasks';
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
        <button className={`nav-item ${activeTab === 'test' ? 'active' : ''}`} onClick={() => setActiveTab('test')}>
          <span>🎙️</span><span>Test</span>
        </button>
        <button className={`nav-item ${activeTab === 'mission' ? 'active' : ''}`} onClick={() => setActiveTab('mission')}>
          <span>🐰</span><span>Focus</span>
        </button>
        <button className={`nav-item ${activeTab === 'todo' ? 'active' : ''}`} onClick={() => setActiveTab('todo')}>
          <span>📝</span><span>Tasks</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
