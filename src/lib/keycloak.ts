const KEYCLOAK_URL = process.env.KEYCLOAK_URL!;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM!;
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID!;
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET!;
const KEYCLOAK_ADMIN_CLIENT_ID = process.env.KEYCLOAK_ADMIN_CLIENT_ID!;
const KEYCLOAK_ADMIN_CLIENT_SECRET = process.env.KEYCLOAK_ADMIN_CLIENT_SECRET!;

export interface KeycloakTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
    token_type: string;
    id_token?: string;
    scope: string;
}

export interface KeycloakUserInfo {
    sub: string;
    email: string;
    email_verified: boolean;
    preferred_username: string;
    name?: string;
}

async function getAdminToken(): Promise<string> {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

    console.log("[Keycloak] Getting admin token from:", tokenUrl);
    console.log("[Keycloak] Using client:", KEYCLOAK_ADMIN_CLIENT_ID);

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: KEYCLOAK_ADMIN_CLIENT_ID,
            client_secret: KEYCLOAK_ADMIN_CLIENT_SECRET,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("[Keycloak] Failed to get admin token:", response.status, error);
        throw new Error(`Failed to get admin token: ${error}`);
    }

    const data = await response.json();
    console.log("[Keycloak] Admin token obtained successfully");
    return data.access_token;
}

export async function authenticateUser(
    email: string,
    password: string
): Promise<KeycloakTokenResponse> {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "password",
            client_id: KEYCLOAK_CLIENT_ID,
            client_secret: KEYCLOAK_CLIENT_SECRET,
            username: email,
            password: password,
            scope: "openid email profile",
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || "Authentication failed");
    }

    return response.json();
}

export async function getUserInfo(
    accessToken: string
): Promise<KeycloakUserInfo> {
    const userInfoUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

    const response = await fetch(userInfoUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to get user info");
    }

    return response.json();
}

export async function registerUser(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
        console.log("[Keycloak] Starting user registration for:", email);
        
        const adminToken = await getAdminToken();
        const usersUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`;

        console.log("[Keycloak] Creating user at:", usersUrl);

        const createResponse = await fetch(usersUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                email,
                username: email,
                enabled: true,
                emailVerified: false,
                firstName: firstName || "",
                lastName: lastName || "",
                credentials: [
                    {
                        type: "password",
                        value: password,
                        temporary: false,
                    },
                ],
            }),
        });

        console.log("[Keycloak] Create user response status:", createResponse.status);

        if (createResponse.status === 201) {
            const locationHeader = createResponse.headers.get("Location");
            const userId = locationHeader?.split("/").pop();
            console.log("[Keycloak] User created successfully, ID:", userId);
            return { success: true, userId };
        }

        if (createResponse.status === 409) {
            return { success: false, error: "User with this email already exists" };
        }

        if (createResponse.status === 403) {
            console.error("[Keycloak] 403 Forbidden - Client lacks manage-users role");
            return { success: false, error: "Server not authorized to create users. Check Keycloak client roles." };
        }

        if (createResponse.status === 401) {
            console.error("[Keycloak] 401 Unauthorized - Invalid or expired token");
            return { success: false, error: "Authentication failed with Keycloak" };
        }

        const errorText = await createResponse.text();
        console.error("[Keycloak] Create user failed:", createResponse.status, errorText);
        
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch {
            errorData = { errorMessage: errorText };
        }
        
        return {
            success: false,
            error: errorData.errorMessage || errorData.error || `Failed to create user (${createResponse.status})`,
        };
    } catch (error) {
        console.error("[Keycloak] Registration error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Registration failed",
        };
    }
}

export async function sendVerificationEmail(userId: string): Promise<boolean> {
    try {
        const adminToken = await getAdminToken();
        const verifyUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}/send-verify-email`;

        const response = await fetch(verifyUrl, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
        });

        return response.ok;
    } catch {
        return false;
    }
}

export async function refreshToken(
    refreshToken: string
): Promise<KeycloakTokenResponse> {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: KEYCLOAK_CLIENT_ID,
            client_secret: KEYCLOAK_CLIENT_SECRET,
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    return response.json();
}
