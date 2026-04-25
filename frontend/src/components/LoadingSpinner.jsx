import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-11 w-11 rounded-full border-4 border-[var(--nest-line)] border-t-[var(--nest-copper)]" style={{ animation: 'nestSpin 0.8s linear infinite' }} />
      <p className="text-sm font-bold text-[var(--nest-muted)]">{message}</p>
    </div>
  );
}
