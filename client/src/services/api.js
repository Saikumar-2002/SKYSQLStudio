const API_BASE = '/api';

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    };

    if (options.token) {
        config.headers['Authorization'] = `Bearer ${options.token}`;
        delete config.token;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
}

// --- Auth ---
export const authService = {
    login: (email, password) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

    signup: (username, email, password) =>
        request('/auth/signup', { method: 'POST', body: JSON.stringify({ username, email, password }) }),

    getMe: (token) =>
        request('/auth/me', { token })
};

// --- Assignments ---
export const assignmentService = {
    getAll: () => request('/assignments'),

    getById: (id) => request(`/assignments/${id}`)
};

// --- SQL Execution ---
export const executeService = {
    run: (query, assignmentId, schemaName) =>
        request('/execute', {
            method: 'POST',
            body: JSON.stringify({ query, assignmentId, schemaName })
        })
};

// --- Hints ---
export const hintService = {
    getHint: (question, userQuery, schemaTables, difficulty) =>
        request('/hints', {
            method: 'POST',
            body: JSON.stringify({ question, userQuery, schemaTables, difficulty })
        })
};
