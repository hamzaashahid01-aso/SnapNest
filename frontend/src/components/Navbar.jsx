import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bookmark, Camera, Grid2X2, LogOut, Menu, Newspaper, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 no-underline">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--nest-ink)] text-[var(--nest-copper-2)] shadow-[var(--nest-shadow-soft)]">
        <Camera className="h-5 w-5" />
      </span>
      <span className="text-lg font-black tracking-normal text-[var(--nest-ink)]">
        Snap<span className="text-[var(--nest-copper)]">Nest</span>
      </span>
    </Link>
  );
}

function NavItem({ to, icon: Icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-extrabold no-underline transition-colors',
          isActive
            ? 'bg-[var(--nest-ink)] text-[var(--nest-paper)]'
            : 'text-[var(--nest-muted)] hover:bg-[var(--nest-panel)] hover:text-[var(--nest-ink)]',
        ].join(' ')
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const links = user?.role === 'creator'
    ? [
        { to: '/creator', label: 'Studio', icon: Grid2X2 },
        { to: '/feed', label: 'Feed', icon: Newspaper },
        { to: '/profile', label: 'Profile', icon: User },
      ]
    : user?.role === 'consumer'
      ? [
          { to: '/feed', label: 'Discover', icon: Newspaper },
          { to: '/bookmarks', label: 'Saved', icon: Bookmark },
          { to: '/profile', label: 'Profile', icon: User },
        ]
      : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--nest-line)] bg-[rgba(255,250,242,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Brand />

        {user ? (
          <>
            <div className="hidden items-center gap-2 md:flex">
              {links.map((link) => (
                <NavItem key={link.to} to={link.to} icon={link.icon}>{link.label}</NavItem>
              ))}
              <button onClick={handleLogout} className="ml-2 flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-extrabold text-[var(--nest-muted)] transition-colors hover:bg-red-50 hover:text-red-700">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
            <button onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--nest-line)] text-[var(--nest-ink)] md:hidden" aria-label="Toggle menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="nest-btn-outline hidden sm:inline-flex">Sign in</Link>
            <Link to="/register" className="nest-btn">Get started</Link>
          </div>
        )}
      </div>

      {user && open && (
        <div className="border-t border-[var(--nest-line)] bg-[var(--nest-paper)] px-4 py-3 md:hidden">
          <div className="grid gap-1">
            {links.map((link) => (
              <NavItem key={link.to} to={link.to} icon={link.icon} onClick={() => setOpen(false)}>{link.label}</NavItem>
            ))}
            <button onClick={handleLogout} className="mt-2 flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-extrabold text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
