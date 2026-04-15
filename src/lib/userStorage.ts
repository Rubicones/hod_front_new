export const USER_ID_KEY = "userId";

export function setUserId(userId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_ID_KEY, userId);
}

export function getUserId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_ID_KEY);
}
