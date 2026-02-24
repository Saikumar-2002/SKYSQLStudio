import { useState } from 'react';
import { hintService } from '../../services/api';
import './HintPanel.scss';

export default function HintPanel({ question, userQuery, schemaTables, difficulty }) {
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchHint = async () => {
        setLoading(true);
        try {
            const data = await hintService.getHint(question, userQuery, schemaTables, difficulty);
            setHint(data.hint);
            setIsOpen(true);
        } catch (err) {
            setHint(err.message || 'Could not fetch hint. Try again later.');
            setIsOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hint-panel">
            <button
                className="hint-panel__btn"
                onClick={fetchHint}
                disabled={loading}
            >
                {loading ? (
                    <span className="hint-panel__spinner" />
                ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 1C5.7 1 3 3.7 3 7c0 2.2 1.2 4.1 3 5.1V14a1 1 0 001 1h4a1 1 0 001-1v-1.9c1.8-1 3-2.9 3-5.1 0-3.3-2.7-6-6-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M7 16.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M9 4v1M6.5 5.5l-.7-.7M11.5 5.5l.7-.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                )}
                {loading ? 'Thinking...' : 'Get Hint'}
            </button>

            {isOpen && hint && (
                <div className="hint-panel__content">
                    <div className="hint-panel__content-header">
                        <span>💡 Hint</span>
                        <button className="hint-panel__close" onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    <p className="hint-panel__text">{hint}</p>
                </div>
            )}
        </div>
    );
}
