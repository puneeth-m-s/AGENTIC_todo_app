import React, { useState } from 'react';
import LoginPage from './LoginPage.jsx';
import TodoPage from './TodoPage.jsx';

const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return localStorage.getItem('todo-user');
    } catch {
      return null;
    }
  });

  function logIn(email, password) {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return 'The email or password is incorrect.';
    }
    try {
      localStorage.setItem('todo-user', DEMO_EMAIL);
    } catch {
      // Keep the login usable if browser storage is disabled.
    }
    setUser(DEMO_EMAIL);
    return '';
  }

  function logOut() {
    try {
      localStorage.removeItem('todo-user');
    } catch {
      // Logging out should work even if browser storage is unavailable.
    }
    setUser(null);
  }

  return user ? <TodoPage onLogout={logOut} /> : <LoginPage onLogin={logIn} />;
}
