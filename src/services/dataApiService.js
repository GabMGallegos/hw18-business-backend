const dataApiBaseUrl = process.env.DATA_API_BASE_URL;
const dataApiTimeoutMs = Number(process.env.DATA_API_TIMEOUT_MS || 10000);

if (!dataApiBaseUrl) {
    throw new Error('DATA_API_BASE_URL is not configured');
}

async function requestDataApi(endpoint, options = {}) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, dataApiTimeoutMs);

    try {
        const response = await fetch(`${dataApiBaseUrl}${endpoint}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
            signal: controller.signal
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const error = new Error(data?.message || 'Data backend error');
            error.statusCode = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            const timeoutError = new Error('Data backend request timeout');
            timeoutError.statusCode = 504;
            throw timeoutError;
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

module.exports = {
    requestDataApi
};