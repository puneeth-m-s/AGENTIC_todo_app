import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'everyday-todos';
const FILTERS = ['All', 'Active', 'Completed'];

export default function TodoPage({ onLogout }) {
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(savedTodos) ? savedTodos : [];
    } catch {
      return [];
    }
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Todos remain usable for this session if browser storage is unavailable.
    }
  }, [todos]);

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  }), [todos, filter]);

  function addTodo(event) {
    event.preventDefault();
    const text = newTodo.trim();
    if (!text) return;
    setTodos((currentTodos) => [...currentTodos, { id: `${Date.now()}-${Math.random()}`, text, completed: false }]);
    setNewTodo('');
  }

  function toggleTodo(id) {
    setTodos((currentTodos) => currentTodos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  return (
    <main className="app-layout">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Everyday home"><span className="brand-mark small" aria-hidden="true">✓</span> everyday</a>
        <button className="text-button" onClick={onLogout}>Log out <span aria-hidden="true">↗</span></button>
      </header>
      <section className="todo-card" aria-labelledby="todo-title">
        <div className="todo-heading">
          <div>
            <p className="eyebrow">Make today count</p>
            <h1 id="todo-title">Your tasks<span className="heading-period">.</span></h1>
          </div>
          <div className="date-chip"><span className="date-dot" /> One thing at a time</div>
        </div>
        <form className="add-form" onSubmit={addTodo}>
          <label className="visually-hidden" htmlFor="new-todo">Add a task</label>
          <span className="add-symbol" aria-hidden="true">＋</span>
          <input id="new-todo" value={newTodo} onChange={(event) => setNewTodo(event.target.value)} placeholder="What needs to get done?" />
          <button className="primary-button add-button" type="submit">Add task</button>
        </form>
        <div className="list-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter tasks">
            {FILTERS.map((item) => <button key={item} className={`filter-tab ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}
          </div>
          <span className="remaining-count"><strong>{remainingCount}</strong> {remainingCount === 1 ? 'task' : 'tasks'} left</span>
        </div>
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li className={`todo-row ${todo.completed ? 'is-completed' : ''}`} key={todo.id}>
              <button className="check-button" aria-label={todo.completed ? `Mark ${todo.text} active` : `Mark ${todo.text} completed`} aria-pressed={todo.completed} onClick={() => toggleTodo(todo.id)}>{todo.completed && <span aria-hidden="true">✓</span>}</button>
              <span className="todo-text">{todo.text}</span>
              <button className="delete-button" aria-label={`Delete ${todo.text}`} onClick={() => deleteTodo(todo.id)}>×</button>
            </li>
          ))}
          {visibleTodos.length === 0 && <li className="empty-state"><span className="empty-icon" aria-hidden="true">✳</span><strong>{todos.length === 0 ? 'A fresh start.' : `No ${filter.toLowerCase()} tasks.`}</strong><span>{todos.length === 0 ? 'Add a task above and make it happen.' : 'Try another filter or add a new task.'}</span></li>}
        </ul>
        <footer className="card-footer">Small steps add up. Keep going <span aria-hidden="true">✦</span></footer>
      </section>
      <p className="page-note">Your list is saved in this browser.</p>
    </main>
  );
}
