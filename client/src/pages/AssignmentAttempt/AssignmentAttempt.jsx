import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentService, executeService } from '../../services/api';
import SQLEditor from '../../components/SQLEditor/SQLEditor';
import DataViewer from '../../components/DataViewer/DataViewer';
import ResultsTable from '../../components/ResultsTable/ResultsTable';
import HintPanel from '../../components/HintPanel/HintPanel';
import './AssignmentAttempt.scss';

export default function AssignmentAttempt() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('-- Write your SQL query here\nSELECT ');
    const [result, setResult] = useState(null);
    const [queryError, setQueryError] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        assignmentService.getById(id)
            .then(data => {
                setAssignment(data.assignment);
                setQuery(`-- ${data.assignment.title}\n-- Write your SQL query below\n\nSELECT `);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleRunQuery = async () => {
        if (!query.trim() || isRunning) return;
        setIsRunning(true);
        setQueryError('');
        setResult(null);

        try {
            const data = await executeService.run(
                query,
                assignment._id,
                assignment.pgSchemaName
            );
            setResult(data.result);
        } catch (err) {
            setQueryError(err.message);
        } finally {
            setIsRunning(false);
        }
    };

    if (loading) {
        return (
            <div className="attempt-page container">
                <div className="attempt-page__loading">
                    <div className="skeleton" style={{ height: 32, width: 200, marginBottom: 16 }} />
                    <div className="skeleton" style={{ height: 200 }} />
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="attempt-page container">
                <div className="attempt-page__not-found">
                    <h2>Assignment not found</h2>
                    <Link to="/" className="attempt-page__back-link">← Back to Assignments</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="attempt-page container">
            {/* Top Bar */}
            <div className="attempt-page__topbar">
                <Link to="/" className="attempt-page__back">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </Link>
                <div className="attempt-page__info">
                    <h1 className="attempt-page__title">{assignment.title}</h1>
                    <span className={`attempt-page__badge attempt-page__badge--${assignment.difficulty.toLowerCase()}`}>
                        {assignment.difficulty}
                    </span>
                </div>
            </div>

            {/* Main layout */}
            <div className="attempt-page__layout">
                {/* Left Panel: Question + Data */}
                <div className="attempt-page__left">
                    <section className="attempt-page__question">
                        <h3 className="attempt-page__section-title">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                <path d="M6 6a2 2 0 114 0c0 1.1-.9 1.5-1.5 2-.2.2-.5.4-.5.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                                <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
                            </svg>
                            Instructions
                        </h3>
                        <p className="attempt-page__instructions">{assignment.instructions}</p>
                    </section>

                    <DataViewer
                        sampleSchema={assignment.sampleSchema}
                        sampleData={assignment.sampleData}
                    />

                    <div className="attempt-page__hint-wrap">
                        <HintPanel
                            question={assignment.instructions}
                            userQuery={query}
                            schemaTables={assignment.sampleSchema}
                            difficulty={assignment.difficulty}
                        />
                    </div>
                </div>

                {/* Right Panel: Editor + Results */}
                <div className="attempt-page__right">
                    <SQLEditor
                        value={query}
                        onChange={(val) => setQuery(val || '')}
                        onRun={handleRunQuery}
                        isRunning={isRunning}
                    />

                    <ResultsTable
                        result={result}
                        error={queryError}
                    />
                </div>
            </div>
        </div>
    );
}
