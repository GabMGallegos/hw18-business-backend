const dataApiBaseUrl = process.env.DATA_API_BASE_URL;

async function requestDataApi(endpoint, options = {}) {
    const response = await fetch(`${dataApiBaseUrl}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.message || 'Data backend error');
        error.statusCode = response.status;
        throw error;
    }

    return data;
}

module.exports = {
    requestDataApi
};