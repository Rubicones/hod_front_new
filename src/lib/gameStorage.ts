export const LAST_GAME_KEY = "lastGameId";
export const GAME_ID_BY_CODE_KEY = "gameIdByCode";

export function getLastGameId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(LAST_GAME_KEY);
}

export function setLastGameId(gameId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(LAST_GAME_KEY, gameId);
}

type GameIdByCodeMap = Record<string, string>;

function getGameIdMap(): GameIdByCodeMap {
    if (typeof window === "undefined") return {};
    const raw = localStorage.getItem(GAME_ID_BY_CODE_KEY);
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object"
            ? (parsed as GameIdByCodeMap)
            : {};
    } catch {
        return {};
    }
}

export function getGameIdForCode(code: string): string | null {
    if (typeof window === "undefined") return null;
    const normalizedCode = code.trim().toUpperCase();
    return getGameIdMap()[normalizedCode] ?? null;
}

export function setGameIdForCode(code: string, gameId: string): void {
    if (typeof window === "undefined") return;
    const normalizedCode = code.trim().toUpperCase();
    const map = getGameIdMap();
    map[normalizedCode] = gameId;
    localStorage.setItem(GAME_ID_BY_CODE_KEY, JSON.stringify(map));
}
