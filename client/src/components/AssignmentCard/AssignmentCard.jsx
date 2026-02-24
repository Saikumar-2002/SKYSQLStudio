import { Link } from 'react-router-dom';
import './AssignmentCard.scss';

const difficultyIcons = {
    Easy: '🟢',
    Medium: '🟡',
    Hard: '🔴'
};

export default function AssignmentCard({ assignment, index }) {
    return (
        <Link
            to={`/assignment/${assignment._id}`}
            className="assignment-card"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="assignment-card__header">
                <span className="assignment-card__number">#{assignment.order || index + 1}</span>
                <span className={`assignment-card__badge assignment-card__badge--${assignment.difficulty.toLowerCase()}`}>
                    {difficultyIcons[assignment.difficulty]} {assignment.difficulty}
                </span>
            </div>

            <h3 className="assignment-card__title">{assignment.title}</h3>
            <p className="assignment-card__desc">{assignment.description}</p>

            <div className="assignment-card__footer">
                <span className="assignment-card__cta">
                    Start Solving
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}
