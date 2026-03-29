type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    headers?: Record<string, string>;
    token?: string;
};

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { method = "GET", body, headers = {}, token } = options;

    const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (token) {
        requestHeaders["x-access-token"] = token;
    }

    const response = await fetch(`/api/proxy${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `API error: ${response.status}`);
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, token?: string) =>
        apiRequest<T>(endpoint, { method: "GET", token }),

    post: <T>(endpoint: string, body: unknown, token?: string) =>
        apiRequest<T>(endpoint, { method: "POST", body, token }),

    put: <T>(endpoint: string, body: unknown, token?: string) =>
        apiRequest<T>(endpoint, { method: "PUT", body, token }),

    delete: <T>(endpoint: string, token?: string) =>
        apiRequest<T>(endpoint, { method: "DELETE", token }),
};
