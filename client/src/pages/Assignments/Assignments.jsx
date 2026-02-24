import { useState, useEffect } from 'react';
import { assignmentService } from '../../services/api';
import AssignmentCard from '../../components/AssignmentCard/AssignmentCard';
import './Assignments.scss';

export default function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        assignmentService.getAll()
            .then(data => setAssignments(data.assignments))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'All'
        ? assignments
        : assignments.filter(a => a.difficulty === filter);

    return (
        <div className="assignments-page container">
            <header className="assignments-page__header">
                <div className="assignments-page__hero">
                    <h1 className="assignments-page__title">
                        Master SQL with <span className="text-gradient">Practice</span>
                    </h1>
                    <p className="assignments-page__subtitle">
                        Solve interactive SQL assignments, execute queries in real-time, and get intelligent hints when you're stuck.
                    </p>
                </div>

                <div className="assignments-page__filters">
                    {['All', 'Easy', 'Medium', 'Hard'].map(level => (
                        <button
                            key={level}
                            className={`assignments-page__filter ${filter === level ? 'assignments-page__filter--active' : ''} ${level !== 'All' ? `assignments-page__filter--${level.toLowerCase()}` : ''}`}
                            onClick={() => setFilter(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </header>

            {loading && (
                <div className="assignments-page__grid">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="skeleton" style={{ height: 180, borderRadius: 10 }} />
                    ))}
                </div>
            )}

            {error && (
                <div className="assignments-page__error">
                    <p>⚠️ {error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="assignments-page__grid">
                    {filtered.map((a, idx) => (
                        <AssignmentCard key={a._id} assignment={a} index={idx} />
                    ))}
                    {filtered.length === 0 && (
                        <p className="assignments-page__empty">No assignments found for "{filter}" difficulty.</p>
                    )}
                </div>
            )}
        </div>
    );
}
