import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser, getUserInfo } from "@/lib/keycloak";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        error?: string;
    }

    interface User {
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
        error?: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Keycloak",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                try {
                    const tokenResponse = await authenticateUser(
                        credentials.email,
                        credentials.password
                    );

                    const userInfo = await getUserInfo(tokenResponse.access_token);

                    return {
                        id: userInfo.sub,
                        email: userInfo.email,
                        name: userInfo.name || userInfo.preferred_username,
                        accessToken: tokenResponse.access_token,
                        refreshToken: tokenResponse.refresh_token,
                        expiresAt: Date.now() + tokenResponse.expires_in * 1000,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    throw new Error(
                        error instanceof Error ? error.message : "Authentication failed"
                    );
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.expiresAt = user.expiresAt;
                token.error = undefined;
                return token;
            }

            // Already failed — avoid hammering Keycloak; client should sign out
            if (token.error === "RefreshTokenError") {
                return token;
            }

            const BUFFER_MS = 90 * 1000;
            const shouldRefresh = token.expiresAt
                ? Date.now() >= token.expiresAt - BUFFER_MS
                : true;

            if (!shouldRefresh) {
                return token;
            }

            if (token.refreshToken) {
                try {
                    const { refreshToken } = await import("@/lib/keycloak");
                    const refreshed = await refreshToken(token.refreshToken);

                    token.accessToken = refreshed.access_token;
                    token.refreshToken =
                        refreshed.refresh_token ?? token.refreshToken;
                    token.expiresAt =
                        Date.now() + (refreshed.expires_in ?? 300) * 1000;
                    token.error = undefined;
                } catch (error) {
                    console.error("[Auth] Token refresh failed:", error);
                    token.error = "RefreshTokenError";
                }
            } else {
                token.error = "RefreshTokenError";
            }

            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.error = token.error;
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
