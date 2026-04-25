import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UnauthorizedPage() {
  const { isCreator } = useAuth();
  const navigate = useNavigate();
  return (
    <main className="nest-shell flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="nest-panel max-w-md p-8">
        <ShieldOff className="mx-auto mb-5 h-14 w-14 text-red-700" />
        <h1 className="font-display text-4xl font-black text-[var(--nest-ink)]">Access denied</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--nest-muted)]">This page is protected by account role. Return to the right workspace for your account.</p>
        <button onClick={() => navigate(isCreator ? '/creator' : '/feed')} className="nest-btn mt-6 w-full">
          <ArrowLeft className="h-4 w-4" />
          Go to dashboard
        </button>
        <Link to="/" className="mt-4 inline-block text-sm font-black text-[var(--nest-muted)] hover:text-[var(--nest-forest)]">Back to home</Link>
      </div>
    </main>
  );
}
