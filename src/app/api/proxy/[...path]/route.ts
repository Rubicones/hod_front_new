import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://api.issvvv.com";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return handleRequest(request, params, "GET");
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return handleRequest(request, params, "POST");
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return handleRequest(request, params, "PUT");
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return handleRequest(request, params, "DELETE");
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return handleRequest(request, params, "PATCH");
}

async function handleRequest(
    request: NextRequest,
    paramsPromise: Promise<{ path: string[] }>,
    method: string
) {
    const { path } = await paramsPromise;
    const endpoint = "/" + path.join("/");
    const search = request.nextUrl.search; // e.g. "?game_id=xxx" or ""
    const url = `${BACKEND_URL}${endpoint}${search}`;

    const token = request.headers.get("x-access-token");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Cookie"] = `access_token=${token}`;
    }

    try {
        const body = method !== "GET" && method !== "DELETE" 
            ? await request.text() 
            : undefined;

        const response = await fetch(url, {
            method,
            headers,
            body: body || undefined,
        });

        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "application/json",
            },
        });
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json(
            { error: "Failed to proxy request" },
            { status: 500 }
        );
    }
}
