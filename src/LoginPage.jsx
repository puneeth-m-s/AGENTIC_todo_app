import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError(onLogin(email, password));
  }

  return (
    <main className="login-layout">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark" aria-hidden="true">✓</div>
        <p className="eyebrow">A little more focus</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="muted">Sign in to pick up where you left off.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p className="error-message" role="alert">{error}</p>}
          <button className="primary-button login-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
        </form>
        <p className="demo-hint">Demo: <strong>student@example.com</strong><br />Password: <strong>password123</strong></p>
      </section>
    </main>
  );
}
