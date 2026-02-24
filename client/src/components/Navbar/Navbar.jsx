import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import './Navbar.scss';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar__inner container">
                <Link to="/" className="navbar__brand">
                    <span className="navbar__logo">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="6" fill="url(#logo-grad)" />
                            <path d="M8 10h12M8 14h8M8 18h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                    <span className="navbar__title">SKY SQL<span className="navbar__title-accent">Studio</span></span>
                </Link>

                <button
                    className={`navbar__toggle ${menuOpen ? 'navbar__toggle--active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span /><span /><span />
                </button>

                <div className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
                    <Link
                        to="/"
                        className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Assignments
                    </Link>

                    {user ? (
                        <div className="navbar__user">
                            <span className="navbar__avatar">{user.username?.charAt(0).toUpperCase()}</span>
                            <span className="navbar__username">{user.username}</span>
                            <button className="navbar__logout" onClick={logout}>Log out</button>
                        </div>
                    ) : (
                        <div className="navbar__auth">
                            <Link
                                to="/login"
                                className="navbar__link"
                                onClick={() => setMenuOpen(false)}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="navbar__btn-signup"
                                onClick={() => setMenuOpen(false)}
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
