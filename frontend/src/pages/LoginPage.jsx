import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Lock, Mail, ShieldCheck } from 'lucide-react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate(res.data.user.role === 'creator' ? '/creator' : '/feed');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="nest-shell grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_430px]">
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <p className="nest-label text-[var(--nest-copper)]">Workspace sign in</p>
          <h1 className="mt-3 font-display text-5xl font-black leading-tight text-[var(--nest-ink)]">
            Return to your SnapNest workspace.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--nest-muted)]">
            The same sign-in flow routes creators to the studio and consumers to discovery.
          </p>

          <form onSubmit={handleSubmit} className="nest-panel mt-7 space-y-5 p-6">
            <label className="block">
              <span className="nest-label mb-2 block text-[var(--nest-muted)]">Email</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--nest-muted)]" />
                <input className="nest-input pl-10" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </span>
            </label>

            <label className="block">
              <span className="nest-label mb-2 block text-[var(--nest-muted)]">Password</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--nest-muted)]" />
                <input className="nest-input pl-10" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
              </span>
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>
            )}

            <button type="submit" disabled={loading} className="nest-btn w-full py-4 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--nest-muted)]">
            New to SnapNest?{' '}
            <Link to="/register" className="font-black text-[var(--nest-forest)] no-underline hover:text-[var(--nest-copper)]">
              Create a consumer account
            </Link>
          </p>
        </div>
      </section>

      <aside className="hidden bg-[var(--nest-ink)] p-8 text-[var(--nest-paper)] lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--nest-copper-2)] text-[var(--nest-ink)]">
            <Camera className="h-7 w-7" />
          </div>
          <p className="nest-label text-[var(--nest-copper-2)]">Protected routes</p>
          <h2 className="mt-4 font-display text-4xl font-black leading-tight">Creator studio and consumer discovery stay separated.</h2>
        </div>
        <div className="space-y-3">
          {['JWT authentication', 'Role-based navigation', 'Cloud coursework demonstration'].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-bold text-white/80">
              <ShieldCheck className="h-4 w-4 text-[var(--nest-copper-2)]" />
              {item}
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
