import './ResultsTable.scss';

export default function ResultsTable({ result, error }) {
    if (error) {
        return (
            <div className="results-table results-table--error">
                <div className="results-table__header">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>Error</span>
                </div>
                <div className="results-table__error-msg">{error}</div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="results-table results-table--empty">
                <div className="results-table__placeholder">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                        <line x1="4" y1="12" x2="36" y2="12" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <line x1="16" y1="12" x2="16" y2="36" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                    </svg>
                    <p>Run a query to see results here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="results-table">
            <div className="results-table__header">
                <div className="results-table__label">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4.5L6 8.5L2 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="8" y1="12.5" x2="14" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>Query Results</span>
                </div>
                <div className="results-table__meta">
                    <span className="results-table__rows">{result.rowCount} row{result.rowCount !== 1 ? 's' : ''}</span>
                    <span className="results-table__time">⚡ {result.executionTime}</span>
                </div>
            </div>

            {result.rows.length === 0 ? (
                <div className="results-table__no-rows">Query executed successfully. No rows returned.</div>
            ) : (
                <div className="results-table__body">
                    <table className="results-table__table">
                        <thead>
                            <tr>
                                <th className="results-table__row-num">#</th>
                                {result.columns.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {result.rows.map((row, rIdx) => (
                                <tr key={rIdx}>
                                    <td className="results-table__row-num">{rIdx + 1}</td>
                                    {row.map((cell, cIdx) => (
                                        <td key={cIdx}>
                                            {cell === null || cell === undefined ? (
                                                <span className="results-table__null">NULL</span>
                                            ) : (
                                                String(cell)
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
