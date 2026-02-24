import { useState } from 'react';
import './DataViewer.scss';

export default function DataViewer({ sampleSchema, sampleData }) {
    const [activeTab, setActiveTab] = useState(0);

    if (!sampleSchema || sampleSchema.length === 0) {
        return <div className="data-viewer data-viewer--empty">No schema data available.</div>;
    }

    return (
        <div className="data-viewer">
            <div className="data-viewer__header">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <line x1="1" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="6" y1="5" x2="6" y2="15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span>Sample Data</span>
            </div>

            {sampleSchema.length > 1 && (
                <div className="data-viewer__tabs">
                    {sampleSchema.map((table, idx) => (
                        <button
                            key={table.tableName}
                            className={`data-viewer__tab ${activeTab === idx ? 'data-viewer__tab--active' : ''}`}
                            onClick={() => setActiveTab(idx)}
                        >
                            {table.tableName}
                        </button>
                    ))}
                </div>
            )}

            <div className="data-viewer__content">
                {/* Schema info */}
                <div className="data-viewer__schema">
                    <h4 className="data-viewer__table-name">
                        📋 {sampleSchema[activeTab]?.tableName}
                    </h4>
                    <div className="data-viewer__columns">
                        {sampleSchema[activeTab]?.columns.map(col => (
                            <span key={col.name} className="data-viewer__column">
                                <span className="data-viewer__col-name">{col.name}</span>
                                <span className="data-viewer__col-type">{col.type}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Data preview */}
                {sampleData && sampleData[activeTab] && (
                    <div className="data-viewer__table-wrap">
                        <table className="data-viewer__table">
                            <thead>
                                <tr>
                                    {sampleSchema[activeTab]?.columns.map(col => (
                                        <th key={col.name}>{col.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sampleData[activeTab]?.rows.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx}>{cell !== null && cell !== undefined ? String(cell) : 'NULL'}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
