type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    headers?: Record<string, string>;
    token?: string;
};

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<T> {
    const { method = "GET", body, headers = {}, token } = options;

    const baseHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
    };

    const buildHeaders = (tok?: string) => {
        const h = { ...baseHeaders };
        if (tok) {
            h["x-access-token"] = tok;
        }
        return h;
    };

    const url = `/api/proxy${endpoint}`;

    const doFetch = (tok?: string) =>
        fetch(url, {
            method,
            headers: buildHeaders(tok),
            body: body ? JSON.stringify(body) : undefined,
        });

    let response = await doFetch(token);

    // Access token expired on API but NextAuth session can still refresh — retry once
    if (
        response.status === 401 &&
        token &&
        typeof window !== "undefined"
    ) {
        const errBody = await response.text().catch(() => "");
        const { getSession } = await import("next-auth/react");
        await getSession();
        const session = await getSession();

        if (!session?.accessToken || session.error === "RefreshTokenError") {
            throw new Error(errBody || "Session expired");
        }

        const newToken = session.accessToken;
        response = await doFetch(newToken);
    }

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

    patch: <T>(endpoint: string, body: unknown, token?: string) =>
        apiRequest<T>(endpoint, { method: "PATCH", body, token }),

    delete: <T>(endpoint: string, token?: string) =>
        apiRequest<T>(endpoint, { method: "DELETE", token }),

    deleteWithBody: <T>(endpoint: string, body: unknown, token?: string) =>
        apiRequest<T>(endpoint, { method: "DELETE", body, token }),
};
