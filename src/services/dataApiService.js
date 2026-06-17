const dataApiBaseUrl = process.env.DATA_API_BASE_URL;

if (!dataApiBaseUrl) {
    throw new Error('DATA_API_BASE_URL is not configured. Example: http://10.0.0.6:4010/data');
}

function buildUrl(endpoint) {
    return `${dataApiBaseUrl}${endpoint}`;
}

async function requestDataApi(endpoint, options = {}) {
    const response = await fetch(buildUrl(endpoint), {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.message || `Data backend error with status ${response.status}`);
        error.statusCode = response.status;
        throw error;
    }

    return data;
}

module.exports = {
    requestDataApi
};
