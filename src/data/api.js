const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

async function call(method, path, body) {
    let res;
    try {
        res = await fetch(`${BASE}${path}`, {
            method,
            credentials: 'include',
            headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    }
    catch {
        throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
        throw new ApiError(res.status, data.error || 'The request failed.');
    return data;
}

export const api = {
    login: (username, password) => call('POST', '/auth/login', { username, password }).then((r) => r.user),
    logout: () => call('POST', '/auth/logout'),
    me: () => call('GET', '/auth/me').then((r) => r.user),
    changePassword: (current, next) => call('POST', '/auth/password', { current, next }),
    state: () => call('GET', '/state'),
    list: (table, filters = {}) => call('GET', `/${table}${Object.keys(filters).length ? `?${new URLSearchParams(filters)}` : ''}`),
    get: (table, id) => call('GET', `/${table}/${id}`),
    create: (table, row) => call('POST', `/${table}`, row),
    update: (table, id, changes) => call('PUT', `/${table}/${id}`, changes),
    remove: (table, id) => call('DELETE', `/${table}/${id}`),
    users: {
        list: () => call('GET', '/users'),
        create: (user) => call('POST', '/users', user),
        resetPassword: (id, password) => call('PUT', `/users/${id}/password`, { password }),
        remove: (id) => call('DELETE', `/users/${id}`),
    },
    payroll: {
        addRecord: (empId, periodId) => call('POST', '/payroll', { empId, periodId }),
        process: (periodId) => call('POST', '/payroll/process', { periodId }),
        finalize: (periodId) => call('POST', '/payroll/finalize', { periodId }),
        remove: (id) => call('DELETE', `/payroll/${id}`),
    },
    decideLeave: (id, decision, remarks = '') => call('POST', `/leaves/${id}/decision`, { decision, remarks }),
};
