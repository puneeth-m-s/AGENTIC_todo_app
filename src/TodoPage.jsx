import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'everyday-todos';
const FILTERS = ['All', 'Active', 'Completed'];
const PROGRESS_STEPS = [0, 25, 50, 75, 100];

function normalizeTodos(todos) {
  return todos.map((todo) => {
    const progress = PROGRESS_STEPS.includes(todo.progress)
      ? todo.progress
      : todo.completed ? 100 : 0;
    return { ...todo, progress, completed: progress === 100 };
  });
}

export default function TodoPage({ onLogout }) {
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(savedTodos) ? normalizeTodos(savedTodos) : [];
    } catch {
      return [];
    }
  });
  const [newTodo, setNewTodo] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Todos remain usable for this session if browser storage is unavailable.
    }
  }, [todos]);

  const remainingCount = todos.filter((todo) => todo.progress < 100).length;
  const visibleTodos = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return todos.filter((todo) => {
      const matchesFilter = filter === 'All'
        || (filter === 'Active' && todo.progress < 100)
        || (filter === 'Completed' && todo.progress === 100);
      const matchesSearch = !searchText || todo.text.toLowerCase().includes(searchText);
      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, search]);

  function addTodo(event) {
    event.preventDefault();
    const text = newTodo.trim();
    if (!text) return;
    setTodos((currentTodos) => [...currentTodos, {
      id: `${Date.now()}-${Math.random()}`,
      text,
      progress: 0,
      completed: false,
    }]);
    setNewTodo('');
  }

  function updateProgress(id, progress) {
    const nextProgress = Number(progress);
    setTodos((currentTodos) => currentTodos.map((todo) => todo.id === id
      ? { ...todo, progress: nextProgress, completed: nextProgress === 100 }
      : todo));
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  const emptyTitle = todos.length === 0
    ? 'A fresh start.'
    : search.trim()
      ? 'No matching tasks.'
      : `No ${filter.toLowerCase()} tasks.`;
  const emptyMessage = todos.length === 0
    ? 'Add a task above and make it happen.'
    : search.trim()
      ? 'Try another search term.'
      : 'Try another filter or add a new task.';

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
        <div className="search-box">
          <label className="visually-hidden" htmlFor="search-todos">Search tasks</label>
          <span className="search-symbol" aria-hidden="true">⌕</span>
          <input id="search-todos" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your tasks" />
          {search && <button className="clear-search" type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
        </div>
        <div className="list-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter tasks">
            {FILTERS.map((item) => <button key={item} className={`filter-tab ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}
          </div>
          <span className="remaining-count"><strong>{remainingCount}</strong> {remainingCount === 1 ? 'task' : 'tasks'} left</span>
        </div>
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li className={`todo-row ${todo.progress === 100 ? 'is-completed' : ''}`} key={todo.id}>
              <span className="todo-text">{todo.text}</span>
              <div className="progress-control">
                <div className="progress-track" role="progressbar" aria-label={`${todo.text} progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={todo.progress}>
                  <span style={{ width: `${todo.progress}%` }} />
                </div>
                <label className="visually-hidden" htmlFor={`progress-${todo.id}`}>Progress for {todo.text}</label>
                <select id={`progress-${todo.id}`} className="progress-select" value={todo.progress} onChange={(event) => updateProgress(todo.id, event.target.value)}>
                  {PROGRESS_STEPS.map((step) => <option key={step} value={step}>{step === 100 ? 'Completed' : `${step}%`}</option>)}
                </select>
              </div>
              <button className="delete-button" aria-label={`Delete ${todo.text}`} onClick={() => deleteTodo(todo.id)}>×</button>
            </li>
          ))}
          {visibleTodos.length === 0 && <li className="empty-state"><span className="empty-icon" aria-hidden="true">✳</span><strong>{emptyTitle}</strong><span>{emptyMessage}</span></li>}
        </ul>
        <footer className="card-footer">Small steps add up. Keep going <span aria-hidden="true">✦</span></footer>
      </section>
      <p className="page-note">Your list is saved in this browser.</p>
    </main>
  );
}
