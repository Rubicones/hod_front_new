"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/Atoms/LoadingScreen";
import TopToolbar from "@/components/Atoms/TopToolbar";
import { GameStartingScreen, type GameSnapshot, type GameUnit } from "@/components/Tabs";
import type { RoomEntry } from "@/components/Molecules/RoomEntryList";
import { api } from "@/lib/api";
import { getGameIdForCode, setGameIdForCode, setLastGameId } from "@/lib/gameStorage";
import { getUserId, setUserId } from "@/lib/userStorage";
import { useLocale, useTranslations } from "next-intl";

type RawGameUnit = {
    id?: string;
    name?: string;
    is_monster?: boolean;
    hp?: number;
    armor?: number;
    initiative?: number;
    owner_id?: string;
    effects?: Array<{
        id?: string;
        template_key?: string;
        name?: string;
        description?: string;
    }>;
};

type RawRoom = {
    id?: string;
    name?: string;
};

type RawGameMember = {
    user_id?: string;
    nickname?: string;
    role?: string;
    character_ids?: string[];
};

type GameMember = {
    userId: string;
    nickname: string;
    role: string;
    characterIds: string[];
};

function parseRoomsList(roomsRaw: unknown): RoomEntry[] {
    if (!roomsRaw || typeof roomsRaw !== "object") return [];

    const rawRoomsContainer = roomsRaw as
        | { items?: Record<string, RawRoom> }
        | Record<string, RawRoom>;

    let roomsMap: Record<string, RawRoom>;
    if (
        rawRoomsContainer &&
        "items" in rawRoomsContainer &&
        rawRoomsContainer.items &&
        typeof rawRoomsContainer.items === "object"
    ) {
        roomsMap = rawRoomsContainer.items as Record<string, RawRoom>;
    } else {
        roomsMap = rawRoomsContainer as Record<string, RawRoom>;
    }

    return Object.values(roomsMap)
        .filter((r) => r.id)
        .map((r) => ({
            id: r.id as string,
            name: (r.name ?? "").trim() || "Room",
        }));
}

function parseMembersList(membersRaw: unknown): GameMember[] {
    if (!membersRaw || typeof membersRaw !== "object") return [];

    const rawMembersContainer = membersRaw as
        | { items?: Record<string, RawGameMember> }
        | Record<string, RawGameMember>;

    const membersMap =
        "items" in rawMembersContainer &&
        rawMembersContainer.items &&
        typeof rawMembersContainer.items === "object"
            ? (rawMembersContainer.items as Record<string, RawGameMember>)
            : (rawMembersContainer as Record<string, RawGameMember>);

    return Object.values(membersMap)
        .filter((m) => typeof m.user_id === "string" && m.user_id.length > 0)
        .map((m) => ({
            userId: m.user_id as string,
            nickname: m.nickname ?? "",
            role: m.role ?? "",
            characterIds: Array.isArray(m.character_ids) ? m.character_ids : [],
        }));
}

function parseSnapshotResponse(data: {
    units?: Record<string, RawGameUnit>;
    rooms?: unknown;
    members?: unknown;
}): GameSnapshot {
    const rawUnits = data?.units ?? {};
    const units: Record<string, GameUnit> = Object.fromEntries(
        Object.entries(rawUnits).map(([key, u]) => [
            u.id ?? key,
            {
                id: u.id ?? key,
                name: u.name ?? "",
                is_monster: u.is_monster ?? false,
                hp: u.hp ?? 0,
                armor: u.armor ?? 0,
                initiative: u.initiative ?? 0,
                effects: (u.effects ?? []).map((e) => ({
                    id: e.template_key ?? e.id ?? "",
                    name: e.name ?? "",
                    description: e.description ?? "",
                    effectInstanceId: e.id,
                })),
                owner_id: u.owner_id,
            },
        ]),
    );
    return {
        units,
        rooms: parseRoomsList(data?.rooms),
        members: parseMembersList(data?.members),
    };
}

export default function GamePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const gameCode = params.gameId as string; // URL contains code, not id
    const locale = useLocale();
    const tErrors = useTranslations("errors");
    const tNav = useTranslations("nav");
    const tGame = useTranslations("game");

    const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
    const [gameId, setGameId] = useState<string | null>(null); // Resolved id for API calls
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace(`/${locale}/login`);
        }
    }, [status, router, locale]);

    useEffect(() => {
        if (session?.error === "RefreshTokenError") {
            signOut({ callbackUrl: `/${locale}/login` });
        }
    }, [session?.error, locale]);

    useEffect(() => {
        if (!gameCode || !session?.accessToken) return;

        const getCurrentUserId = async () => {
            const stored = getUserId();
            if (stored) return stored;

            const me = await api.get<{ id?: string }>("/user/me", session.accessToken);
            if (me?.id) {
                setUserId(me.id);
                return me.id;
            }
            return null;
        };

        const loadSession = async () => {
            setLoading(true);
            setError(null);
            try {
                const cachedGameId = getGameIdForCode(gameCode);
                let resolvedGameId = cachedGameId;
                let resolvedCode = gameCode;

                if (!resolvedGameId) {
                    const sessions = await api.get<Array<{ id: string; code: string }>>(
                        "/game/all",
                        session.accessToken,
                    );
                    const match = sessions?.find(
                        (s) => s.code?.toUpperCase() === gameCode.toUpperCase(),
                    );
                    if (!match) {
                        setError(tErrors("sessionNotFound"));
                        setLoading(false);
                        return;
                    }
                    resolvedGameId = match.id;
                    resolvedCode = match.code;
                    setGameIdForCode(resolvedCode, resolvedGameId);
                }

                if (!resolvedGameId) {
                    setError(tErrors("sessionNotFound"));
                    setLoading(false);
                    return;
                }

                const fetchSnapshot = () =>
                    api.post<{
                        data?: {
                            units?: Record<string, RawGameUnit>;
                            rooms?: unknown;
                            members?: unknown;
                        };
                    }>(`/game/${resolvedGameId}/get_snapshot`, {}, session.accessToken);

                let snapshotRes = await fetchSnapshot();
                let parsed = parseSnapshotResponse(snapshotRes?.data ?? {});
                const currentUserId = await getCurrentUserId();

                const isCurrentUserMember =
                    !!currentUserId &&
                    (parsed.members ?? []).some(
                        (member) => member.userId === currentUserId,
                    );

                // If user opened by code but is not a member yet, register in this game first.
                if (currentUserId && !isCurrentUserMember) {
                    await api.post(
                        "/game/join",
                        { code: resolvedCode },
                        session.accessToken,
                    );
                    snapshotRes = await fetchSnapshot();
                    parsed = parseSnapshotResponse(snapshotRes?.data ?? {});
                }

                setSnapshot(parsed);
                setGameId(resolvedGameId);
                setLastGameId(gameCode);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : tErrors("failedToLoadSession"),
                );
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, [gameCode, session?.accessToken, tErrors]);

    const handleExit = () => {
        router.push(`/${locale}`);
    };

    if (status === "loading" || !session) {
        return <LoadingScreen />;
    }

    if (loading) {
        return <LoadingScreen />;
    }

    if (error || !snapshot) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center gap-4 px-4">
                <span className="text-white text-center">
                    {error ?? tErrors("sessionNotFound")}
                </span>
                <button
                    onClick={() => router.push(`/${locale}`)}
                    className="text-gentle-repose font-medium underline"
                >
                    {tNav("backHome")}
                </button>
            </div>
        );
    }

    return (
        <div className="hod-game-session min-h-screen">
            <TopToolbar
                showChevron
                showShare
                viewTransitionFixedChrome
                subtitle={tGame("newSession")}
                title={tGame("sessionTitle", { code: gameCode })}
                onChevronClick={handleExit}
                onShareClick={() => {
                    navigator.clipboard.writeText(gameCode);
                }}
            />
            <div className="w-full h-screen pt-[72px]">
                <GameStartingScreen
                    snapshot={snapshot}
                    gameId={gameId!}
                    token={session.accessToken!}
                    onExit={handleExit}
                />
            </div>
        </div>
    );
}
