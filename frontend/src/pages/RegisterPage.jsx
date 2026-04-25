import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Lock, Mail, User, X } from 'lucide-react';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TRUSTED_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'hotmail.co.uk', 'live.co.uk', 'outlook.co.uk', 'icloud.com', 'me.com', 'mac.com',
  'yahoo.com', 'yahoo.co.uk', 'ymail.com', 'rocketmail.com', 'proton.me', 'protonmail.com',
  'pm.me', 'aol.com', 'zoho.com', 'zohomail.com', 'fastmail.com', 'gmx.com', 'gmx.net',
  'mail.com', 'tutanota.com', 'tuta.io', 'hey.com', 'yandex.com', 'mailfence.com',
]);

function getEmailError(email) {
  if (!email) return null;
  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2 || !parts[1]) return null;
  return TRUSTED_DOMAINS.has(parts[1])
    ? null
    : 'Use a trusted provider such as Gmail, Outlook, iCloud, Yahoo, or ProtonMail.';
}

const PW_CHECKS = [
  { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { key: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
  { key: 'special', label: 'One special character', test: (p) => /[!@#$%^&*()_+\-=[\]{}|;':.,<>?/\\]/.test(p) },
];

export default function RegisterPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const checks = useMemo(() => PW_CHECKS.map((c) => ({ ...c, pass: c.test(form.password) })), [form.password]);
  const score = checks.filter((c) => c.pass).length;
  const emailError = emailTouched ? getEmailError(form.email) : null;
  const pwAllPass = checks.every((c) => c.pass);
  const mismatch = Boolean(form.confirm) && form.password !== form.confirm;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const eErr = getEmailError(form.email);
    if (eErr) { setEmailTouched(true); return setError(eErr); }
    if (!pwAllPass) return setError('Password does not meet all requirements.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      loginUser(res.data.token, res.data.user);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="nest-shell px-4 py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[390px_minmax(0,1fr)]">
        <aside className="nest-dark-card h-fit p-7 text-[var(--nest-paper)] lg:sticky lg:top-24">
          <p className="nest-label text-[var(--nest-copper-2)]">Consumer onboarding</p>
          <h1 className="mt-4 font-display text-5xl font-black leading-tight">Join the gallery without creator permissions.</h1>
          <p className="mt-5 text-sm leading-7 text-white/65">
            Consumer accounts can browse, save, follow, comment, and rate. Upload controls remain reserved for creator accounts.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-2">
            {['Browse', 'Save', 'Rate'].map((item) => (
              <div key={item} className="rounded-2xl bg-white/[0.07] p-3 text-center text-xs font-black">{item}</div>
            ))}
          </div>
        </aside>

        <section className="nest-panel p-5 sm:p-7">
          <div className="mb-7">
            <p className="nest-label text-[var(--nest-copper)]">Create account</p>
            <h2 className="mt-2 text-3xl font-black text-[var(--nest-ink)]">Start discovering visual stories</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="nest-label mb-2 block text-[var(--nest-muted)]">Full name</span>
              <span className="relative block">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--nest-muted)]" />
                <input className="nest-input pl-10" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="nest-label mb-2 block text-[var(--nest-muted)]">Email</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--nest-muted)]" />
                <input className="nest-input pl-10" style={{ borderColor: emailError ? 'var(--nest-danger)' : undefined }} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={() => setEmailTouched(true)} placeholder="you@gmail.com" />
              </span>
              {emailError && <p className="mt-2 flex items-center gap-1 text-xs font-bold text-red-700"><X className="h-3 w-3" /> {emailError}</p>}
            </label>

            <label className="block">
              <span className="nest-label mb-2 block text-[var(--nest-muted)]">Password</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--nest-muted)]" />
                <input className="nest-input pl-10" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password" />
              </span>
            </label>

            <label className="block">
              <span className="nest-label mb-2 block text-[var(--nest-muted)]">Confirm password</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--nest-muted)]" />
                <input className="nest-input pl-10" style={{ borderColor: mismatch ? 'var(--nest-danger)' : undefined }} type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat password" />
              </span>
              {mismatch && <p className="mt-2 flex items-center gap-1 text-xs font-bold text-red-700"><X className="h-3 w-3" /> Passwords do not match.</p>}
            </label>

            {form.password && (
              <div className="rounded-2xl border border-[var(--nest-line)] bg-[var(--nest-bg)] p-4 md:col-span-2">
                <div className="mb-3 flex gap-1">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className="h-1.5 flex-1 rounded-full" style={{ background: index < score ? 'var(--nest-forest)' : 'var(--nest-line)' }} />
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {checks.map((check) => (
                    <span key={check.key} className={`flex items-center gap-2 text-xs font-bold ${check.pass ? 'text-[var(--nest-forest)]' : 'text-[var(--nest-muted)]'}`}>
                      <Check className="h-3.5 w-3.5" />
                      {check.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 md:col-span-2">{error}</div>}

            <button type="submit" disabled={loading} className="nest-btn md:col-span-2 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Creating...' : 'Create account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--nest-muted)]">
            Already have an account? <Link to="/login" className="font-black text-[var(--nest-forest)] no-underline hover:text-[var(--nest-copper)]">Sign in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
