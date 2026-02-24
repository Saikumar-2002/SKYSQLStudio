import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.scss';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                <div className="auth-page__header">
                    <h1 className="auth-page__title">Welcome Back</h1>
                    <p className="auth-page__subtitle">Sign in to continue your SQL journey</p>
                </div>

                {error && <div className="auth-page__error">{error}</div>}

                <form className="auth-page__form" onSubmit={handleSubmit}>
                    <div className="auth-page__field">
                        <label htmlFor="email" className="auth-page__label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="auth-page__input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-page__field">
                        <label htmlFor="password" className="auth-page__label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="auth-page__input"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-page__submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-page__footer">
                    Don&apos;t have an account? <Link to="/signup" className="auth-page__link">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
