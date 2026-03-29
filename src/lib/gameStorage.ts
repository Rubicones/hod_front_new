export const LAST_GAME_KEY = "lastGameId";

export function getLastGameId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(LAST_GAME_KEY);
}

export function setLastGameId(gameId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(LAST_GAME_KEY, gameId);
}
