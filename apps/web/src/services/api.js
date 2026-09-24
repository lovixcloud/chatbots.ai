const API_BASE = '/api';
export async function request(endpoint, options = {}) {
    const token = localStorage.getItem('chatbots_token');
    const workspaceId = localStorage.getItem('chatbots_workspace_id');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (workspaceId) {
        headers['X-Workspace-Id'] = workspaceId;
    }
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });
        const result = await response.json();
        return result;
    }
    catch (err) {
        return {
            success: false,
            error: { code: 'NETWORK_ERROR', message: err.message || 'Failed to connect to server' }
        };
    }
}
