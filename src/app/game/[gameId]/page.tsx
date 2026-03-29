"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/Atoms/LoadingScreen";
import TopToolbar from "@/components/Atoms/TopToolbar";
import { GameStartingScreen, type GameSnapshot, type GameUnit } from "@/components/Tabs";
import { api } from "@/lib/api";
import { setLastGameId } from "@/lib/gameStorage";
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

function parseSnapshotResponse(data: { units?: Record<string, RawGameUnit> }): GameSnapshot {
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
                    id: e.id ?? e.template_key ?? "",
                    name: e.name ?? "",
                    description: e.description ?? "",
                })),
                owner_id: u.owner_id,
            },
        ]),
    );
    return { units };
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
            router.push(`/${locale}/signup`);
            return;
        }
    }, [status, router, locale]);

    useEffect(() => {
        if (!gameCode || !session?.accessToken) return;

        const loadSession = async () => {
            setLoading(true);
            setError(null);
            try {
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
                const snapshotRes = await api.post<{ data?: { units?: Record<string, RawGameUnit> } }>(
                    `/game/${match.id}/get_snapshot`,
                    {},
                    session.accessToken,
                );
                const parsed = parseSnapshotResponse(snapshotRes?.data ?? {});
                setSnapshot(parsed);
                setGameId(match.id);
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
        <>
            <TopToolbar
                showChevron
                showShare
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
        </>
    );
}
