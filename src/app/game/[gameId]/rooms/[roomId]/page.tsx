"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    startTransition,
} from "react";
import { motion } from "motion/react";
import TopToolbar from "@/components/Atoms/TopToolbar";
import LoadingScreen from "@/components/Atoms/LoadingScreen";
import MainCard from "@/components/Organisms/MainCard";
import InitiativeIcon from "@/components/Icons/InitiativeIcon";
import { api } from "@/lib/api";
import { getGameIdForCode, setGameIdForCode } from "@/lib/gameStorage";
import { getUserId } from "@/lib/userStorage";
import avatarPlaceholder from "@/app/images/elfIconMale.png";
import { conditions } from "@/data/conditions";
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

type GameUnit = {
    id: string;
    name: string;
    is_monster: boolean;
    hp: number;
    armor: number;
    initiative: number;
    effects?: {
        /** effect type id (Condition.id / template_key) */
        id: string;
        name: string;
        description?: string;
        /** backend effect instance id for deletion */
        effectInstanceId?: string;
    }[];
    owner_id?: string;
};

type RawRoom = {
    id?: string;
    name?: string;
    type?: string;
    status?: string;
    participants?: string[];
    turn_order?: string[];
    turn_index?: number;
    round_number?: number;
    active_unit_id?: string;
};

type ParsedRoom = {
    id: string;
    name: string;
    round_number: number;
    turn_order: string[];
    active_unit_id: string | null;
};

type SnapshotResponse = {
    snapshot?: {
        units?: Record<string, RawGameUnit>;
        rooms?: { items?: Record<string, RawRoom> } | Record<string, RawRoom>;
        members?: { items?: Record<string, RawGameMember> } | Record<string, RawGameMember>;
    };
    data?: SnapshotResponse["snapshot"];
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

const avatarSrc =
    typeof avatarPlaceholder === "string"
        ? avatarPlaceholder
        : (avatarPlaceholder as { src: string }).src ?? "";

const ALL_CONDITIONS_AS_EFFECTS = conditions.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.effects?.join("\n") ?? "",
}));

function parseUnits(rawUnits: Record<string, RawGameUnit> = {}): Record<string, GameUnit> {
    return Object.fromEntries(
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
}

function parseRoomSnapshot(
    raw: SnapshotResponse | unknown,
    roomIdParam: string,
): { units: Record<string, GameUnit>; room: ParsedRoom | null; members: GameMember[] } {
    const rawObj = (raw ?? {}) as {
        snapshot?: SnapshotResponse["snapshot"];
        data?:
            | SnapshotResponse["snapshot"]
            | {
                  snapshot?: SnapshotResponse["snapshot"];
              };
    };
    const data =
        rawObj.data && typeof rawObj.data === "object" ? rawObj.data : undefined;
    const dataSnapshot =
        data && "snapshot" in data ? data.snapshot : undefined;
    const snapshot = (rawObj.snapshot ??
        dataSnapshot ??
        data) as SnapshotResponse["snapshot"] | undefined;

    const units = parseUnits(snapshot?.units ?? {});
    const rawMembersContainer = snapshot?.members as
        | { items?: Record<string, RawGameMember> }
        | Record<string, RawGameMember>
        | undefined;
    const membersMap =
        rawMembersContainer && "items" in rawMembersContainer
            ? rawMembersContainer.items ?? {}
            : rawMembersContainer ?? {};
    const members: GameMember[] = Object.values(membersMap)
        .filter((m) => typeof m.user_id === "string" && m.user_id.length > 0)
        .map((m) => ({
            userId: m.user_id as string,
            nickname: m.nickname ?? "",
            role: m.role ?? "",
            characterIds: Array.isArray(m.character_ids) ? m.character_ids : [],
        }));

    const rawRoomsContainer = snapshot?.rooms as
        | { items?: Record<string, RawRoom> }
        | Record<string, RawRoom>
        | undefined;

    let roomsMap: Record<string, RawRoom> = {};
    if (!rawRoomsContainer) {
        roomsMap = {};
    } else if ((rawRoomsContainer as { items?: Record<string, RawRoom> }).items) {
        roomsMap = (rawRoomsContainer as { items?: Record<string, RawRoom> }).items ?? {};
    } else {
        roomsMap = rawRoomsContainer ?? {};
    }

    const rooms = Object.values(roomsMap);
    const rawRoom =
        rooms.find((r) => r.id === roomIdParam) ??
        rooms[0] ??
        null;

    if (!rawRoom) {
        return {
            units,
            room: null,
            members,
        };
    }

    const turnOrder = rawRoom.turn_order ?? Object.keys(units);
    const activeFromIndex =
        rawRoom.turn_order?.[rawRoom.turn_index ?? 0] ?? null;
    const active_unit_id =
        rawRoom.active_unit_id ?? activeFromIndex ?? turnOrder[0] ?? null;

    return {
        units,
        members,
        room: {
            id: rawRoom.id ?? roomIdParam,
            name: rawRoom.name ?? "Room",
            round_number: rawRoom.round_number ?? 1,
            turn_order: turnOrder,
            active_unit_id,
        },
    };
}

export default function RoomPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const gameCode = params.gameId as string;
    const roomIdParam = params.roomId as string;
    const locale = useLocale();
    const tErrors = useTranslations("errors");
    const tNav = useTranslations("nav");
    const tCard = useTranslations("card");

    const [units, setUnits] = useState<Record<string, GameUnit>>({});
    const [room, setRoom] = useState<ParsedRoom | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdvancingTurn, setIsAdvancingTurn] = useState(false);
    const [isTogglingEffect, setIsTogglingEffect] = useState(false);
    /** Off-turn unit opened for editing (HP, etc.); cleared on name click or turn change */
    const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
    const [members, setMembers] = useState<GameMember[]>([]);
    const currentUserId = useMemo(() => getUserId(), []);
    const currentMember = useMemo(
        () => members.find((m) => m.userId === currentUserId),
        [currentUserId, members],
    );
    const isMaster = currentMember?.role === "master";
    const currentMemberCharacterIds = useMemo(
        () => new Set(currentMember?.characterIds ?? []),
        [currentMember?.characterIds],
    );
    const memberNicknameByCharacterId = useMemo(() => {
        const entries = members.flatMap((member) =>
            member.characterIds.map((characterId) => [characterId, member.nickname] as const),
        );
        return Object.fromEntries(entries) as Record<string, string>;
    }, [members]);

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
        if (!gameCode || !roomIdParam || !session?.accessToken) return;

        const loadRoom = async () => {
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

                const snapshotRes = await api.post<SnapshotResponse>(
                    `/game/${resolvedGameId}/get_snapshot`,
                    {},
                    session.accessToken,
                );

                const parsed = parseRoomSnapshot(snapshotRes, roomIdParam);
                setUnits(parsed.units);
                setRoom(parsed.room);
                setMembers(parsed.members);
                setGameId(resolvedGameId);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : tErrors("failedToLoadRoom"),
                );
            } finally {
                setLoading(false);
            }
        };

        loadRoom();
    }, [gameCode, roomIdParam, session?.accessToken, tErrors]);

    useEffect(() => {
        setExpandedUnitId(null);
    }, [room?.active_unit_id]);

    const orderedUnits = useMemo(() => {
        const baseIds = room?.turn_order?.length
            ? room.turn_order
            : Object.keys(units);

        if (!room) {
            return baseIds
                .map((id) => units[id])
                .filter((u): u is GameUnit => Boolean(u));
        }

        const activeId = room.active_unit_id;
        const startIndex =
            activeId != null ? baseIds.indexOf(activeId) : -1;

        const rotatedIds =
            startIndex > 0
                ? [...baseIds.slice(startIndex), ...baseIds.slice(0, startIndex)]
                : baseIds;

        return rotatedIds
            .map((id) => units[id])
            .filter((u): u is GameUnit => Boolean(u));
    }, [room, units]);

    const handleExit = () => {
        router.push(`/${locale}/game/${gameCode}`);
    };

    const updateUnit = useCallback((id: string, updates: Partial<GameUnit>) => {
        setUnits((prev) => {
            const next = { ...prev };
            if (next[id]) next[id] = { ...next[id], ...updates };
            return next;
        });
    }, []);

    const setHp = useCallback(
        async (unitId: string, hp: number) => {
            if (!gameId || !session?.accessToken) return;
            try {
                await api.post(
                    `/game/${gameId}/units/${unitId}/hp/set`,
                    { hp },
                    session.accessToken,
                );
                updateUnit(unitId, { hp });
            } catch (err) {
                console.error("Set HP failed:", err);
            }
        },
        [gameId, session?.accessToken, updateUnit],
    );

    const setArmor = useCallback(
        async (unitId: string, armor: number) => {
            if (!gameId || !session?.accessToken) return;
            try {
                await api.post(
                    `/game/${gameId}/units/${unitId}/armor/set`,
                    { armor },
                    session.accessToken,
                );
                updateUnit(unitId, { armor });
            } catch (err) {
                console.error("Set armor failed:", err);
            }
        },
        [gameId, session?.accessToken, updateUnit],
    );

    const setInitiative = useCallback(
        async (unitId: string, initiative: number) => {
            if (!gameId || !session?.accessToken) return;
            try {
                await api.post(
                    `/game/${gameId}/units/${unitId}/initiative/set`,
                    { initiative },
                    session.accessToken,
                );
                updateUnit(unitId, { initiative });
            } catch (err) {
                console.error("Set initiative failed:", err);
            }
        },
        [gameId, session?.accessToken, updateUnit],
    );

    const addEffect = async (unitId: string, effectTypeId: string) => {
        if (!gameId || !session?.accessToken || isTogglingEffect || !room) return;
        const condition = conditions.find((c) => c.id === effectTypeId);
        if (!condition) return;

        setIsTogglingEffect(true);
        try {
            const res = await api.post<SnapshotResponse>(
                `/game/${gameId}/units/${unitId}/effects`,
                {
                    unit_id: unitId,
                    template_key: condition.id,
                    room_id: room.id,
                    name: condition.name,
                    description: condition.effects?.join(" ") ?? "",
                    conditions: [condition.id],
                    modifiers: [],
                    periodic: null,
                    duration: {
                        turns_remaining: 5,
                        rounds_remaining: 0,
                        expires_at: "turn_start",
                        anchor_unit_id: unitId,
                        room_id: room.id,
                    },
                },
                session.accessToken,
            );
            const parsed = parseRoomSnapshot(res, roomIdParam);
            setUnits(parsed.units);
            setRoom(parsed.room);
            setMembers(parsed.members);
        } catch (err) {
            console.error("Add effect failed:", err);
        } finally {
            setIsTogglingEffect(false);
        }
    };

    const removeEffect = async (unitId: string, effectTypeId: string) => {
        if (!gameId || !session?.accessToken || isTogglingEffect) return;
        const unit = units[unitId];
        if (!unit) return;
        const target = (unit.effects ?? []).find((e) => e.id === effectTypeId);
        const effectInstanceId = target?.effectInstanceId;
        if (!effectInstanceId) return;

        setIsTogglingEffect(true);
        try {
            const res = await api.deleteWithBody<SnapshotResponse>(
                `/game/${gameId}/units/effects/${effectInstanceId}`,
                {
                    unit_id: unitId,
                    effect_id: effectInstanceId,
                },
                session.accessToken,
            );
            const parsed = parseRoomSnapshot(res, roomIdParam);
            setUnits(parsed.units);
            setRoom(parsed.room);
            setMembers(parsed.members);
        } catch (err) {
            console.error("Remove effect failed:", err);
        } finally {
            setIsTogglingEffect(false);
        }
    };

    const handleEffectToggle = async (unitId: string, effectId: string) => {
        const unit = units[unitId];
        const selectedIds = (unit?.effects ?? []).map((e) => e.id);
        const isSelected = selectedIds.includes(effectId);
        if (isSelected) {
            await removeEffect(unitId, effectId);
        } else {
            await addEffect(unitId, effectId);
        }
    };

    const handleNextTurn = async () => {
        if (!gameId || !session?.accessToken || isAdvancingTurn) return;
        setIsAdvancingTurn(true);
        try {
            const res = await api.post<SnapshotResponse>(
                `/game/${gameId}/rooms/${roomIdParam}/next-turn`,
                {},
                session.accessToken,
            );
            const parsed = parseRoomSnapshot(res, roomIdParam);
            startTransition(() => {
                setUnits(parsed.units);
                setRoom(parsed.room);
                setMembers(parsed.members);
            });
        } catch (err) {
            console.error("Next turn failed:", err);
            alert(err instanceof Error ? err.message : "Failed to advance turn");
        } finally {
            setIsAdvancingTurn(false);
        }
    };

    if (status === "loading" || !session) {
        return <LoadingScreen />;
    }

    if (loading) {
        return <LoadingScreen />;
    }

    if (error || !room) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center gap-4 px-4">
                <span className="text-white text-center">
                    {error ?? tErrors("roomNotFound")}
                </span>
                <button
                    onClick={handleExit}
                    className="text-gentle-repose font-medium underline"
                >
                    {tNav("backToSession")}
                </button>
            </div>
        );
    }

    return (
        <>
            <TopToolbar
                showChevron
                showDone={isMaster}
                roundNumber={room.round_number}
                title={gameCode}
                doneLabel={tNav("end")}
                onChevronClick={handleExit}
                onDoneClick={async () => {
                    if (!gameId || !session?.accessToken) {
                        handleExit();
                        return;
                    }
                    try {
                        await api.post(
                            `/game/${gameId}/rooms/${roomIdParam}/end`,
                            {},
                            session.accessToken,
                        );
                    } catch (err) {
                        console.error("End room failed:", err);
                    } finally {
                        handleExit();
                    }
                }}
            />
            <div className="w-full h-screen pt-[72px] pb-20 overflow-y-auto">
                <div className="flex flex-col gap-4 px-4 items-center">
                    {orderedUnits.map((unit) => {
                        const isTheirTurn = room.active_unit_id === unit.id;
                        const isOwnUnit =
                            currentMemberCharacterIds.has(unit.id) ||
                            (!!currentUserId && unit.owner_id === currentUserId);
                        const showCompactForPlayer = !isMaster && !isOwnUnit;
                        const isPeekExpanded = expandedUnitId === unit.id;
                        const showExpanded = isMaster
                            ? isTheirTurn || isPeekExpanded
                            : isOwnUnit;
                        const canEditStats = isMaster ? showExpanded : isOwnUnit;

                        return (
                            <div
                                key={unit.id}
                                className={
                                    isMaster && !showExpanded && !isTheirTurn
                                        ? "w-full cursor-pointer"
                                        : "w-full"
                                }
                                role={
                                    isMaster && !showExpanded && !isTheirTurn
                                        ? "button"
                                        : undefined
                                }
                                tabIndex={
                                    isMaster && !showExpanded && !isTheirTurn ? 0 : undefined
                                }
                                onClick={
                                    isMaster && !showExpanded && !isTheirTurn
                                        ? () => setExpandedUnitId(unit.id)
                                        : undefined
                                }
                                onKeyDown={
                                    isMaster && !showExpanded && !isTheirTurn
                                        ? (e) => {
                                              if (
                                                  e.key === "Enter" ||
                                                  e.key === " "
                                              ) {
                                                  e.preventDefault();
                                                  setExpandedUnitId(unit.id);
                                              }
                                          }
                                        : undefined
                                }
                            >
                                <motion.div
                                    layout
                                    transition={{
                                        layout: {
                                            duration: 0.1,
                                            ease: "linear",
                                        },
                                    }}
                                >
                                    <MainCard
                                        type={
                                            unit.is_monster ? "NPC" : "player"
                                        }
                                        isActive={showCompactForPlayer ? false : showExpanded}
                                        initiativeOnly={showCompactForPlayer}
                                        showInitiative={true}
                                        characterName={
                                            unit.is_monster ? "" : unit.name
                                        }
                                        playerName={
                                            unit.is_monster
                                                ? ""
                                                : memberNicknameByCharacterId[unit.id] ||
                                                  tCard("playerName")
                                        }
                                        name={
                                            unit.is_monster
                                                ? unit.name
                                                : undefined
                                        }
                                        avatarSrc={avatarSrc || undefined}
                                        hp={unit.hp}
                                        armor={unit.armor}
                                        initiative={unit.initiative}
                                        allEffects={ALL_CONDITIONS_AS_EFFECTS}
                                        effects={(
                                            unit.effects ?? []
                                        ).map((e) => ({
                                            id: e.id,
                                            name: e.name,
                                            description: e.description,
                                        }))}
                                        onEffectToggle={
                                            isMaster
                                                ? (effectId) =>
                                                      handleEffectToggle(
                                                          unit.id,
                                                          effectId,
                                                      )
                                                : () => {}
                                        }
                                        isConcentrated={false}
                                        onConcentrationChange={
                                            canEditStats
                                                ? () => {}
                                                : undefined
                                        }
                                        onHpChange={
                                            canEditStats
                                                ? (value) =>
                                                      setHp(unit.id, value)
                                                : undefined
                                        }
                                        onArmorChange={
                                            canEditStats
                                                ? (value) =>
                                                      setArmor(unit.id, value)
                                                : undefined
                                        }
                                        onInitiativeChange={
                                            canEditStats
                                                ? (value) =>
                                                      setInitiative(
                                                          unit.id,
                                                          value,
                                                      )
                                                : undefined
                                        }
                                        onNameClick={
                                            isMaster && isPeekExpanded && !isTheirTurn
                                                ? () =>
                                                      setExpandedUnitId(null)
                                                : undefined
                                        }
                                    />
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom battle controls */}
                {isMaster && (
                    <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
                        <div className="w-full px-4 pointer-events-auto">
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    className="flex-1 py-2 rounded-full bg-find-the-path/70 flex items-center justify-center text-beacon-of-hope text-5xl"
                                >
                                    +
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 py-2 rounded-full bg-find-the-path/70 flex items-center justify-center"
                                >
                                    <InitiativeIcon size={32} state="active" />
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 py-2 rounded-full bg-find-the-path/70 flex items-center justify-center disabled:bg-find-the-path/40 disabled:opacity-60"
                                    onClick={handleNextTurn}
                                    disabled={isAdvancingTurn}
                                >
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8 4L16 12L8 20"
                                            stroke="white"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

