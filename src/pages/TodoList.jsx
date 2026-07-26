import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '수학 숙제 하기', done: false },
    { id: 2, text: '도서관에서 정숙하기', done: false },
    { id: 3, text: '회의록 작성', done: false }
  ]);
  const [inputText, setInputText] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setTodos([{ id: Date.now(), text: inputText, done: false }, ...todos]);
    setInputText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const completed = todos.filter(t => t.done).length;
  const total = todos.length;
  const percentage = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="flex flex-col w-full gap-6 pb-8 px-container-padding-mobile pt-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center shadow-sm rotate-3">
          <span className="material-symbols-outlined text-on-tertiary-container text-[28px]">edit_note</span>
        </div>
        <div>
          <h1 className="font-headline-lg-mobile text-[28px] font-bold text-on-background">오늘의 할 일</h1>
          <p className="font-body-md text-[16px] text-on-surface-variant">조용히 하나씩 채워가요</p>
        </div>
      </div>

      <div className="relative group mt-4">
        <div className="absolute inset-0 bg-primary/5 blur-xl rounded-xl transition-all duration-500"></div>
        <form className="relative flex items-center bg-surface-container-low rounded-lg p-2 shadow-sm" onSubmit={addTodo}>
          <input className="flex-1 bg-transparent border-none outline-none px-4 py-3 font-body-lg text-[18px] text-on-surface placeholder:text-outline-variant" placeholder="새로운 할 일을 입력하세요..." value={inputText} onChange={e=>setInputText(e.target.value)} />
          <button type="submit" className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-2">모든 일을 마쳤나요?</h3>
            <p className="font-body-md text-[16px] text-on-surface-variant">새로운 할 일을 추가하고<br/>오늘의 성취감을 느껴보세요!</p>
          </div>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className="group flex items-center gap-4 bg-surface-container-high p-5 rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer" onClick={() => toggleTodo(todo.id)}>
              <div className="relative w-7 h-7 flex-shrink-0">
                <div className={`w-full h-full rounded-full border-2 flex items-center justify-center transition-colors ${todo.done ? 'bg-primary border-primary' : 'border-primary-fixed-dim bg-surface'}`}>
                  {todo.done && <span className="material-symbols-outlined text-on-primary text-[18px]">check</span>}
                </div>
              </div>
              <span className={`flex-1 font-body-lg text-[18px] transition-all duration-300 ${todo.done ? 'line-through opacity-50 text-on-surface' : 'text-on-surface'}`}>{todo.text}</span>
              <button className="opacity-0 group-hover:opacity-100 text-outline-variant hover:text-error transition-opacity" onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}>
                <span className="material-symbols-outlined">delete_outline</span>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-6 bg-secondary-container rounded-lg flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="font-label-sm text-[12px] font-bold text-on-secondary-container opacity-70">진행률</span>
          <div className="flex items-end gap-1">
            <span className="font-headline-md text-[24px] font-bold text-on-secondary-container">{completed}</span>
            <span className="font-body-md text-[16px] text-on-secondary-container mb-1">/ {total}</span>
          </div>
        </div>
        <div className="w-16 h-16 relative">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle className="stroke-on-secondary-container/10" cx="18" cy="18" r="16" fill="none" strokeWidth="3"></circle>
            <circle className="stroke-primary" cx="18" cy="18" r="16" fill="none" strokeWidth="3" strokeDasharray={`${percentage} 100`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }}></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px] filled">stars</span>
          </div>
        </div>
      </div>
    </div>
  );
}
