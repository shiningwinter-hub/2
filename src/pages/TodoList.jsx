import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '도서관에서 2시간 집중하기', done: false },
    { id: 2, text: '휴대폰 무음 모드 켜기', done: true }
  ]);
  const [inputText, setInputText] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setTodos([{ id: Date.now(), text: inputText, done: false }, ...todos]);
    setInputText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  return (
    <div>
      <div className="card">
        <form className="todo-form" onSubmit={addTodo}>
          <input 
            type="text" 
            placeholder="새로운 할 일을 입력하세요" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="btn">추가</button>
        </form>

        <div className="todo-list">
          {todos.map(todo => (
            <label key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
              <input 
                type="checkbox" 
                checked={todo.done} 
                onChange={() => toggleTodo(todo.id)} 
              />
              <span>{todo.text}</span>
            </label>
          ))}
          {todos.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '20px 0' }}>
              할 일이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
