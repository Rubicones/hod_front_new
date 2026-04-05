/** Same-origin proxy — avoids browser CORS issues with dnd5eapi.co */
const DND_BASE = "/api/dnd";

export type MonsterSummary = {
    index: string;
    name: string;
    url: string;
};

type MonstersListResponse = {
    count?: number;
    results?: MonsterSummary[];
};

export type MonsterDetail = {
    index: string;
    name: string;
    hit_points: number;
    dexterity: number;
    armor_class:
        | Array<{ value?: number; type?: string }>
        | { value?: number }
        | number;
    senses?: {
        passive_perception?: string | number;
    };
};

export async function fetchMonstersList(): Promise<MonsterSummary[]> {
    const res = await fetch(`${DND_BASE}/monsters`, {
        headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Monsters list failed: ${res.status}`);
    const data = (await res.json()) as MonstersListResponse;
    return data.results ?? [];
}

export async function fetchMonsterByIndex(index: string): Promise<MonsterDetail> {
    const res = await fetch(`${DND_BASE}/monsters/${encodeURIComponent(index)}`, {
        headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Monster not found: ${res.status}`);
    return (await res.json()) as MonsterDetail;
}

export function armorClassFromMonster(detail: MonsterDetail): number {
    const ac = detail.armor_class;
    if (typeof ac === "number") return ac;
    if (Array.isArray(ac) && ac[0]?.value != null) return ac[0].value;
    if (ac && typeof ac === "object" && "value" in ac && typeof ac.value === "number")
        return ac.value;
    return 0;
}

export function dexModifier(dex: number): number {
    return Math.floor((dex - 10) / 2);
}

function parsePassive(v: string | number | undefined): number {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string") {
        const n = parseInt(v, 10);
        if (!Number.isNaN(n)) return n;
    }
    return 10;
}

export function passivePerceptionFromMonster(detail: MonsterDetail): number {
    return parsePassive(detail.senses?.passive_perception);
}
