import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read for 30 mins', done: false },
    { id: 2, text: 'Turn on DND mode', done: true }
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

  return (
    <div className="card" style={{ background: 'transparent', boxShadow: 'none', padding: '0' }}>
      <form style={{ display: 'flex', gap: '12px', marginBottom: '24px' }} onSubmit={addTodo}>
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn" style={{ width: '80px', height: '56px' }}>Add</button>
      </form>
      
      <div className="todo-list">
        {todos.map(todo => (
          <label key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
            <span style={{ fontSize: '18px' }}>{todo.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
