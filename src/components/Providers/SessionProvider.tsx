"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/** Refetch session on an interval so the JWT callback runs and refreshes Keycloak tokens before expiry. */
const REFETCH_INTERVAL_SEC = 120;

export default function SessionProvider({ children }: { children: ReactNode }) {
    return (
        <NextAuthSessionProvider
            refetchInterval={REFETCH_INTERVAL_SEC}
            refetchOnWindowFocus={true}
        >
            {children}
        </NextAuthSessionProvider>
    );
}
