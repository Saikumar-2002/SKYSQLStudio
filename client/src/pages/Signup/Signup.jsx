import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Login/Login.scss'; // Reuses auth page styles

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await signup(username, email, password);
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
                    <h1 className="auth-page__title">Create Account</h1>
                    <p className="auth-page__subtitle">Start your SQL learning journey today</p>
                </div>

                {error && <div className="auth-page__error">{error}</div>}

                <form className="auth-page__form" onSubmit={handleSubmit}>
                    <div className="auth-page__field">
                        <label htmlFor="username" className="auth-page__label">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="auth-page__input"
                            placeholder="Your username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            minLength={3}
                        />
                    </div>

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
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="auth-page__submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-page__footer">
                    Already have an account? <Link to="/login" className="auth-page__link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
