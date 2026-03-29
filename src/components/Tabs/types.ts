export type ProfileDisplayType = "games" | "hours" | "nothing";
export type TimePeriod = "month" | "halfyear" | "year" | "alltime";
export type TabType = "menu" | "home" | "profile";
export type AppLanguage = "en" | "ru";

export type ProfilePreference = {
    type: ProfileDisplayType;
    timePeriod?: TimePeriod;
};

export const TAB_INDEX: Record<TabType, number> = {
    menu: 0,
    home: 1,
    profile: 2,
};

export const STORAGE_KEY = "profile_display_preference";
const LANGUAGE_STORAGE_KEY = "preferred_language";

export const getStoredPreference = (): ProfilePreference => {
    if (typeof window === "undefined")
        return { type: "games", timePeriod: "alltime" };
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { type: "games", timePeriod: "alltime" };
        }
    }
    return { type: "games", timePeriod: "alltime" };
};

export const savePreference = (pref: ProfilePreference) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
    }
};

export const getStoredLanguage = (): AppLanguage => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "ru" ? "ru" : "en";
};

export const saveLanguage = (lang: AppLanguage) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
};
