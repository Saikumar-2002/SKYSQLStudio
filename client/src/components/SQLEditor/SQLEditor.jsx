import Editor from '@monaco-editor/react';
import './SQLEditor.scss';

export default function SQLEditor({ value, onChange, onRun, isRunning }) {
    const handleEditorMount = (editor, monaco) => {
        // Add Ctrl+Enter / Cmd+Enter shortcut to run query
        editor.addAction({
            id: 'run-query',
            label: 'Run Query',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            run: () => onRun && onRun()
        });
    };

    return (
        <div className="sql-editor">
            <div className="sql-editor__header">
                <div className="sql-editor__label">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4l6-2 6 2v3c0 4-3 6-6 7-3-1-6-3-6-7V4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                    SQL Editor
                </div>
                <div className="sql-editor__actions">
                    <span className="sql-editor__shortcut">Ctrl + Enter to run</span>
                    <button
                        className="sql-editor__run-btn"
                        onClick={onRun}
                        disabled={isRunning}
                    >
                        {isRunning ? (
                            <span className="sql-editor__spinner" />
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M3 1.5l9 5.5-9 5.5V1.5z" fill="currentColor" />
                            </svg>
                        )}
                        {isRunning ? 'Running...' : 'Run Query'}
                    </button>
                </div>
            </div>

            <div className="sql-editor__body">
                <Editor
                    height="250px"
                    defaultLanguage="sql"
                    theme="vs-dark"
                    value={value}
                    onChange={onChange}
                    onMount={handleEditorMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        automaticLayout: true,
                        tabSize: 2,
                        padding: { top: 12 },
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: true,
                        renderLineHighlight: 'gutter',
                        folding: false,
                        glyphMargin: false,
                        overviewRulerBorder: false,
                        scrollbar: {
                            verticalScrollbarSize: 6,
                            horizontalScrollbarSize: 6
                        }
                    }}
                />
            </div>
        </div>
    );
}
