import { NextRequest, NextResponse } from "next/server";

const DND_UPSTREAM = "https://www.dnd5eapi.co/api/2014";

/**
 * Proxies the D&D 5e SRD API so the client avoids CORS and stuck fetches on mobile / embedded WebViews.
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path } = await params;
    const subpath = path.join("/");
    const url = `${DND_UPSTREAM}/${subpath}`;

    try {
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            next: { revalidate: 86_400 },
        });
        const text = await res.text();
        return new NextResponse(text, {
            status: res.status,
            headers: {
                "Content-Type": res.headers.get("Content-Type") || "application/json",
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
            },
        });
    } catch (err) {
        console.error("D&D proxy error:", err);
        return NextResponse.json(
            { error: "Failed to reach D&D API" },
            { status: 502 },
        );
    }
}
