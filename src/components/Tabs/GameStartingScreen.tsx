"use client";

import {
    useState,
    useCallback,
    useEffect,
    useMemo,
    startTransition,
} from "react";
import { useRouter, useParams } from "next/navigation";
import MainCard from "@/components/Organisms/MainCard";
import NewCard from "@/components/Organisms/NewCard";
import MonsterFinderPanel from "@/components/Molecules/MonsterFinderPanel";
import RoomEntryList, {
    type RoomEntry,
} from "@/components/Molecules/RoomEntryList";
import Button from "@/components/Atoms/Button";
import Input from "@/components/Atoms/Input";
import { api } from "@/lib/api";
import {
    fetchMonstersList,
    fetchMonsterByIndex,
    armorClassFromMonster,
    dexModifier,
    passivePerceptionFromMonster,
    type MonsterSummary,
} from "@/lib/dnd5eApi";
import avatarPlaceholder from "@/app/images/elfIconMale.png";
import { conditions } from "@/data/conditions";
import type { Character } from "./CharacterCreation";
import { useLocale, useTranslations } from "next-intl";
import { getUserId } from "@/lib/userStorage";

// Snapshot shape returned by register API
export type GameUnit = {
    id: string;
    name: string;
    is_monster: boolean;
    hp: number;
    armor: number;
    initiative: number;
    effects?: {
        /** effect type id (matches Condition.id / template_key) */
        id: string;
        name: string;
        description?: string;
        /** backend effect instance id for deletion */
        effectInstanceId?: string;
    }[];
    owner_id?: string;
};

export type GameSnapshot = {
    units: Record<string, GameUnit>;
    /** Combat / scene rooms from `get_snapshot` (optional). */
    rooms?: RoomEntry[];
    /** Session members from `get_snapshot` (optional). */
    members?: Array<{
        userId: string;
        nickname: string;
        role: string;
        characterIds: string[];
    }>;
};

type GameStartingScreenProps = {
    snapshot: GameSnapshot;
    gameId: string;
    token: string;
    onExit: () => void;
};

// Next.js image import: use .src for <img> or pass to Next Image
const avatarSrc =
    typeof avatarPlaceholder === "string"
        ? avatarPlaceholder
        : ((avatarPlaceholder as { src: string }).src ?? "");

// Map conditions to EffectsList shape (id, name, description)
const ALL_CONDITIONS_AS_EFFECTS = conditions.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.effects?.join("\n") ?? "",
}));

type DraftCharacter = Omit<Character, "id"> & {
    clientId: number;
};

const createEmptyCharacter = (playerName = ""): DraftCharacter => ({
    clientId: 0,
    playerName,
    characterName: "",
    isMonster: false,
    hp: undefined,
    armor: undefined,
    initiative: undefined,
    languages: [],
});

type RawGameUnit = {
    id?: string;
    name?: string;
    is_monster?: boolean;
    owner_id?: string;
    hp?: number;
    armor?: number;
    initiative?: number;
    effects?: Array<{
        id?: string;
        template_key?: string;
        name?: string;
        description?: string;
    }>;
};

type RawGameMember = {
    user_id?: string;
    nickname?: string;
    role?: string;
    character_ids?: string[];
};

function parseSnapshotMembers(data: {
    members?: { items?: Record<string, RawGameMember> } | Record<string, RawGameMember>;
}): Array<{
    userId: string;
    nickname: string;
    role: string;
    characterIds: string[];
}> {
    if (!data?.members || typeof data.members !== "object") return [];
    const membersContainer = data.members as
        | { items?: Record<string, RawGameMember> }
        | Record<string, RawGameMember>;
    const membersMap =
        "items" in membersContainer &&
        membersContainer.items &&
        typeof membersContainer.items === "object"
            ? membersContainer.items
            : (membersContainer as Record<string, RawGameMember>);

    return Object.values(membersMap)
        .filter((member) => typeof member.user_id === "string" && member.user_id.length > 0)
        .map((member) => ({
            userId: member.user_id as string,
            nickname: member.nickname ?? "",
            role: member.role ?? "",
            characterIds: Array.isArray(member.character_ids) ? member.character_ids : [],
        }));
}

function parseSnapshotUnits(data: {
    units?: Record<string, RawGameUnit>;
}): Record<string, GameUnit> {
    const rawUnits = data?.units ?? {};
    return Object.fromEntries(
        Object.entries(rawUnits).map(([key, u]) => [
            u.id ?? key,
            {
                id: u.id ?? key,
                name: u.name ?? "",
                is_monster: u.is_monster ?? false,
                owner_id: u.owner_id,
                hp: u.hp ?? 0,
                armor: u.armor ?? 0,
                initiative: u.initiative ?? 0,
                effects: (u.effects ?? []).map((e) => ({
                    id: e.template_key ?? e.id ?? "",
                    name: e.name ?? "",
                    description: e.description ?? "",
                    effectInstanceId: e.id,
                })),
            },
        ]),
    );
}

function parseSnapshotPayload(data: {
    units?: Record<string, RawGameUnit>;
    members?: { items?: Record<string, RawGameMember> } | Record<string, RawGameMember>;
}): {
    units: Record<string, GameUnit>;
    members: Array<{
        userId: string;
        nickname: string;
        role: string;
        characterIds: string[];
    }>;
} {
    return {
        units: parseSnapshotUnits(data),
        members: parseSnapshotMembers(data),
    };
}

export default function GameStartingScreen({
    snapshot,
    gameId,
    token,
}: GameStartingScreenProps) {
    const initialCurrentUserId = getUserId();
    const initialMember = (snapshot.members ?? []).find(
        (member) => member.userId === initialCurrentUserId,
    );
    const initialDraftPlayerName =
        initialMember?.role === "player" ? initialMember.nickname ?? "" : "";

    const [units, setUnits] = useState<Record<string, GameUnit>>(
        () => snapshot.units || {},
    );
    const [members, setMembers] = useState<GameSnapshot["members"]>(
        () => snapshot.members ?? [],
    );
    const [newCharacters, setNewCharacters] = useState<DraftCharacter[]>(() => {
        const hasExistingUnits =
            snapshot.units && Object.keys(snapshot.units).length > 0;
        return hasExistingUnits ? [] : [createEmptyCharacter(initialDraftPlayerName)];
    });
    const [addingCharacterId, setAddingCharacterId] = useState<number | null>(
        null,
    );
    const [monsterFinderOpen, setMonsterFinderOpen] = useState(false);
    const [monsterSearch, setMonsterSearch] = useState("");
    const [monsterCatalog, setMonsterCatalog] = useState<MonsterSummary[]>([]);
    const [monsterCatalogLoading, setMonsterCatalogLoading] = useState(false);
    const [monsterCatalogError, setMonsterCatalogError] = useState<
        string | null
    >(null);
    const [addingMonsterIndex, setAddingMonsterIndex] = useState<string | null>(
        null,
    );
    const [fightSceneName, setFightSceneName] = useState("");
    const [isStartingFight, setIsStartingFight] = useState(false);
    const unitList = Object.values(units);
    const router = useRouter();
    const params = useParams();
    const gameCode = (params?.gameId as string) || "";
    const locale = useLocale();
    const tGame = useTranslations("game");
    const tCard = useTranslations("card");
    const currentUserId = useMemo(() => getUserId(), []);
    const currentMember = useMemo(
        () =>
            (members ?? []).find(
                (member) => member.userId === currentUserId,
            ),
        [currentUserId, members],
    );
    const memberNicknameByUserId = useMemo(
        () =>
            Object.fromEntries(
                (members ?? []).map((member) => [
                    member.userId,
                    member.nickname,
                ]),
            ) as Record<string, string>,
        [members],
    );
    const memberNicknameByCharacterId = useMemo(() => {
        const entries = (members ?? []).flatMap((member) =>
            (member.characterIds ?? []).map((characterId) => [
                characterId,
                member.nickname,
            ] as const),
        );
        return Object.fromEntries(entries) as Record<string, string>;
    }, [members]);
    const isMaster = currentMember?.role === "master";
    const isPlayer = currentMember?.role === "player";
    const playerNickname = currentMember?.nickname ?? "";
    const currentMemberCharacterIds = useMemo(
        () => new Set(currentMember?.characterIds ?? []),
        [currentMember?.characterIds],
    );
    const canEditUnitStats = useCallback(
        (unit: GameUnit) =>
            isMaster ||
            currentMemberCharacterIds.has(unit.id) ||
            (!!currentUserId && unit.owner_id === currentUserId),
        [currentMemberCharacterIds, currentUserId, isMaster],
    );
    const canViewUnitStats = useCallback(
        (unit: GameUnit) =>
            isMaster ||
            currentMemberCharacterIds.has(unit.id) ||
            (!!currentUserId && unit.owner_id === currentUserId),
        [currentMemberCharacterIds, currentUserId, isMaster],
    );
    const canPlayerCreateCharacter =
        (currentMember?.characterIds?.length ?? 0) < 1;
    const canShowAddCharacterButton = isMaster || canPlayerCreateCharacter;

    const updateUnit = useCallback((id: string, updates: Partial<GameUnit>) => {
        setUnits((prev) => {
            const next = { ...prev };
            if (next[id]) next[id] = { ...next[id], ...updates };
            return next;
        });
    }, []);

    const setHp = useCallback(
        async (unitId: string, hp: number) => {
            try {
                await api.post(
                    `/game/${gameId}/units/${unitId}/hp/set`,
                    { hp },
                    token,
                );
                updateUnit(unitId, { hp });
            } catch (err) {
                console.error("Set HP failed:", err);
            }
        },
        [gameId, token, updateUnit],
    );

    const setArmor = useCallback(
        async (unitId: string, armor: number) => {
            try {
                await api.post(
                    `/game/${gameId}/units/${unitId}/armor/set`,
                    { armor },
                    token,
                );
                updateUnit(unitId, { armor });
            } catch (err) {
                console.error("Set armor failed:", err);
            }
        },
        [gameId, token, updateUnit],
    );

    const setInitiative = useCallback(
        async (unitId: string, initiative: number) => {
            try {
                await api.post(
                    `/game/${gameId}/units/${unitId}/initiative/set`,
                    { initiative },
                    token,
                );
                updateUnit(unitId, { initiative });
            } catch (err) {
                console.error("Set initiative failed:", err);
            }
        },
        [gameId, token, updateUnit],
    );

    const removeUnit = useCallback(
        async (unitId: string) => {
            try {
                await api.delete(`/game/${gameId}/units/${unitId}`, token);
                setUnits((prev) => {
                    const next = { ...prev };
                    delete next[unitId];
                    return next;
                });
                if (currentUserId) {
                    setMembers((prev) =>
                        (prev ?? []).map((member) =>
                            member.userId === currentUserId
                                ? {
                                      ...member,
                                      characterIds: (member.characterIds ?? []).filter(
                                          (id) => id !== unitId,
                                      ),
                                  }
                                : member,
                        ),
                    );
                }
            } catch (err) {
                console.error("Remove unit failed:", err);
            }
        },
        [currentUserId, gameId, token],
    );

    const addEffect = useCallback(
        async (unitId: string, conditionId: string) => {
            const condition = conditions.find((c) => c.id === conditionId);
            if (!condition || !gameId) return;
            try {
                const res = await api.post<{
                    snapshot?: { units?: Record<string, RawGameUnit> };
                    data?: { units?: Record<string, RawGameUnit> };
                }>(
                    `/game/${gameId}/units/effects`,
                    {
                        unit_id: unitId,
                        template_key: condition.id,
                        room_id: null,
                        name: condition.name,
                        description: condition.effects?.join(" ") ?? "",
                        conditions: [condition.id],
                        modifiers: [],
                        periodic: null,
                        duration: {
                            turns_remaining: 5,
                            rounds_remaining: 2,
                            expires_at: "round_start",
                            anchor_unit_id: unitId,
                            room_id: null,
                        },
                    },
                    token,
                );

                const parsed = parseSnapshotPayload(res.snapshot ?? res.data ?? {});
                setUnits(parsed.units);
                if (parsed.members.length > 0) setMembers(parsed.members);
            } catch (err) {
                console.error("Add effect failed:", err);
            }
        },
        [gameId, token],
    );

    const removeEffect = useCallback(
        async (unitId: string, effectTypeId: string) => {
            const unit = units[unitId];
            if (!unit || !gameId) return;
            const target = (unit.effects ?? []).find(
                (e) => e.id === effectTypeId,
            );
            const effectInstanceId = target?.effectInstanceId;
            if (!effectInstanceId) return;

            try {
                const res = await api.deleteWithBody<{
                    snapshot?: { units?: Record<string, RawGameUnit> };
                    data?: { units?: Record<string, RawGameUnit> };
                }>(
                    `/game/${gameId}/units/effects/${effectInstanceId}`,
                    {
                        unit_id: unitId,
                        effect_id: effectInstanceId,
                    },
                    token,
                );
                const parsed = parseSnapshotPayload(res.snapshot ?? res.data ?? {});
                setUnits(parsed.units);
                if (parsed.members.length > 0) setMembers(parsed.members);
            } catch (err) {
                console.error("Remove effect failed:", err);
            }
        },
        [gameId, token, units],
    );

    const handleEffectToggle = useCallback(
        (unitId: string, effectId: string) => {
            const unit = units[unitId];
            const selectedIds = (unit?.effects ?? []).map((e) => e.id);
            const isSelected = selectedIds.includes(effectId);
            if (isSelected) {
                removeEffect(unitId, effectId);
            } else {
                addEffect(unitId, effectId);
            }
        },
        [units, addEffect, removeEffect],
    );

    const updateNewCharacter = useCallback(
        (clientId: number, updates: Partial<DraftCharacter>) => {
            setNewCharacters((prev) =>
                prev.map((c) =>
                    c.clientId === clientId ? { ...c, ...updates } : c,
                ),
            );
        },
        [],
    );

    const deleteNewCharacter = useCallback((clientId: number) => {
        setNewCharacters((prev) => prev.filter((c) => c.clientId !== clientId));
    }, []);

    const addNewCharacter = useCallback(() => {
        if (!canShowAddCharacterButton) return;
        setNewCharacters((prev) => [
            ...prev,
            createEmptyCharacter(isPlayer ? playerNickname : ""),
        ]);
    }, [canShowAddCharacterButton, isPlayer, playerNickname]);

    useEffect(() => {
        if (!isPlayer || !playerNickname) return;
        setNewCharacters((prev) =>
            prev.map((character) =>
                character.playerName.trim()
                    ? character
                    : { ...character, playerName: playerNickname },
            ),
        );
    }, [isPlayer, playerNickname]);

    // Load catalog when panel opens. Do NOT put `monsterCatalogLoading` in deps — when it flips
    // to true the effect re-runs, cleanup runs with cancelled=true, and loading never clears.
    useEffect(() => {
        if (!monsterFinderOpen) return;
        if (monsterCatalog.length > 0) return;
        if (monsterCatalogError) return;

        let cancelled = false;
        setMonsterCatalogLoading(true);
        setMonsterCatalogError(null);
        fetchMonstersList()
            .then((list) => {
                if (!cancelled) setMonsterCatalog(list);
            })
            .catch((err) => {
                console.error("Monster catalog load failed:", err);
                if (!cancelled)
                    setMonsterCatalogError(
                        err instanceof Error
                            ? err.message
                            : tGame("monsterLoadError"),
                    );
            })
            .finally(() => {
                if (!cancelled) setMonsterCatalogLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [monsterFinderOpen, monsterCatalog.length, monsterCatalogError, tGame]);

    useEffect(() => {
        if (!monsterFinderOpen) setMonsterSearch("");
    }, [monsterFinderOpen]);

    const handleAddMonsterFromApi = useCallback(
        async (index: string) => {
            setAddingMonsterIndex(index);
            try {
                const detail = await fetchMonsterByIndex(index);
                const armor = armorClassFromMonster(detail);
                const hp = detail.hit_points ?? 0;
                const initiative = dexModifier(detail.dexterity ?? 10);
                const passivePerception = passivePerceptionFromMonster(detail);

                const created = await api.post<{ id: string }>(
                    "/character/create",
                    {
                        name: detail.name.trim(),
                        initiative,
                        armor,
                        hp,
                        is_monster: true,
                        languages: [],
                        passive_perception: passivePerception,
                        passive_investigation: 10,
                        passive_insight: 10,
                    },
                    token,
                );
                await api.post(
                    `/game/${gameId}/register`,
                    { character_id: created.id },
                    token,
                );
                const snapshotRes = await api.post<{
                    data?: {
                        units?: Record<string, RawGameUnit>;
                        members?: { items?: Record<string, RawGameMember> } | Record<string, RawGameMember>;
                    };
                }>(`/game/${gameId}/get_snapshot`, {}, token);
                const parsed = parseSnapshotPayload(snapshotRes?.data ?? {});
                startTransition(() => {
                    setUnits(parsed.units);
                    if (parsed.members.length > 0) setMembers(parsed.members);
                });
            } catch (err) {
                console.error("Add monster failed:", err);
                alert(
                    err instanceof Error
                        ? err.message
                        : tGame("monsterAddError"),
                );
            } finally {
                setAddingMonsterIndex(null);
            }
        },
        [gameId, token, tGame],
    );

    const handleAddToFight = useCallback(
        async (character: DraftCharacter) => {
            if (character.characterName.trim() === "") return;

            setAddingCharacterId(character.clientId);
            try {
                const created = await api.post<{ id: string }>(
                    "/character/create",
                    {
                        name: character.characterName.trim(),
                        initiative: character.initiative ?? 0,
                        armor: character.armor ?? 0,
                        hp: character.hp ?? 0,
                        is_monster: isMaster
                            ? character.isMonster ?? false
                            : false,
                        languages: character.languages ?? [],
                        passive_perception: 10,
                        passive_investigation: 10,
                        passive_insight: 10,
                    },
                    token,
                );
                await api.post(
                    `/game/${gameId}/register`,
                    { character_id: created.id },
                    token,
                );
                const snapshotRes = await api.post<{
                    data?: {
                        units?: Record<string, RawGameUnit>;
                        members?: { items?: Record<string, RawGameMember> } | Record<string, RawGameMember>;
                    };
                }>(`/game/${gameId}/get_snapshot`, {}, token);
                const parsed = parseSnapshotPayload(snapshotRes?.data ?? {});
                startTransition(() => {
                    setUnits(parsed.units);
                    if (parsed.members.length > 0) setMembers(parsed.members);
                    setNewCharacters((prev) =>
                        prev.filter((c) => c.clientId !== character.clientId),
                    );
                });
            } catch (err) {
                console.error("Add to fight failed:", err);
                alert(
                    err instanceof Error
                        ? err.message
                        : "Failed to add to fight",
                );
            } finally {
                setAddingCharacterId(null);
            }
        },
        [gameId, isMaster, token],
    );

    const handleStartFight = useCallback(async () => {
        if (isStartingFight || !gameId) return;

        setIsStartingFight(true);
        try {
            const name = fightSceneName.trim() || tGame("fightName");

            // 1) Create combat room
            const createRes = await api.post<{
                room_id?: string;
                id?: string;
                data?: { room_id?: string; id?: string };
            }>(
                `/game/${gameId}/rooms`,
                {
                    room_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    name,
                    type: "combat",
                },
                token,
            );

            const roomId =
                createRes.room_id ??
                createRes.data?.room_id ??
                createRes.data?.id ??
                createRes.id;

            if (!roomId) {
                throw new Error("Room id missing in create-room response");
            }

            // 2) Refresh snapshot and add every unit as participant
            const snapshotRes = await api.post<{
                data?: {
                    units?: Record<string, RawGameUnit>;
                    members?: { items?: Record<string, RawGameMember> } | Record<string, RawGameMember>;
                };
            }>(`/game/${gameId}/get_snapshot`, {}, token);
            const parsed = parseSnapshotPayload(snapshotRes?.data ?? {});
            const latestUnits = parsed.units;
            const unitIds = Object.keys(latestUnits);

            for (const unitId of unitIds) {
                await api.post(
                    `/game/${gameId}/rooms/${roomId}/participants`,
                    { unit_id: unitId, action: "add" },
                    token,
                );
            }

            // 3) Start the room
            await api.post(`/game/${gameId}/rooms/${roomId}/start`, {}, token);

            if (gameCode) {
                router.push(`/${locale}/game/${gameCode}/rooms/${roomId}`);
            }
        } catch (err) {
            console.error("Start fight failed:", err);
            alert(err instanceof Error ? err.message : "Failed to start fight");
        } finally {
            setIsStartingFight(false);
        }
    }, [
        fightSceneName,
        gameCode,
        gameId,
        isStartingFight,
        locale,
        router,
        tGame,
        token,
    ]);

    const handleEnterRoom = useCallback(
        (roomId: string) => {
            if (!gameCode) return;
            router.push(`/${locale}/game/${gameCode}/rooms/${roomId}`);
        },
        [gameCode, locale, router],
    );

    return (
        <div className='w-full h-full flex flex-col pt-4 pb-8 overflow-y-auto'>
            <div className='flex flex-col gap-4 px-4 items-center'>
                {unitList.map((unit) => (
                    // Player sees non-owned units as initiative-only cards.
                    // Master keeps full card details and controls.
                    <MainCard
                        key={unit.id}
                        type={unit.is_monster ? "NPC" : "player"}
                        isActive={isPlayer && !canViewUnitStats(unit) ? false : true}
                        initiativeOnly={isPlayer && !canViewUnitStats(unit)}
                        showInitiative={true}
                        characterName={unit.name}
                        playerName={
                            memberNicknameByCharacterId[unit.id] ||
                            (unit.owner_id
                                ? memberNicknameByUserId[unit.owner_id]
                                : "") || tCard("playerName")
                        }
                        name={unit.name}
                        avatarSrc={avatarSrc || undefined}
                        hp={canViewUnitStats(unit) ? unit.hp : undefined}
                        armor={canViewUnitStats(unit) ? unit.armor : undefined}
                        initiative={unit.initiative}
                        allEffects={
                            isPlayer && !canViewUnitStats(unit)
                                ? []
                                : ALL_CONDITIONS_AS_EFFECTS
                        }
                        effects={
                            isPlayer && !canViewUnitStats(unit)
                                ? []
                                : (unit.effects ?? []).map((e) => ({
                                      id: e.id,
                                      name: e.name,
                                      description: e.description,
                                  }))
                        }
                        onEffectToggle={
                            isMaster
                                ? (effectId) =>
                                      handleEffectToggle(unit.id, effectId)
                                : () => {}
                        }
                        isConcentrated={false}
                        onConcentrationChange={() => {}}
                        onHpChange={
                            canEditUnitStats(unit)
                                ? (value) => setHp(unit.id, value)
                                : undefined
                        }
                        onArmorChange={
                            canEditUnitStats(unit)
                                ? (value) => setArmor(unit.id, value)
                                : undefined
                        }
                        onInitiativeChange={
                            canEditUnitStats(unit)
                                ? (value) => setInitiative(unit.id, value)
                                : undefined
                        }
                        onRemove={canEditUnitStats(unit) ? () => removeUnit(unit.id) : undefined}
                        removeLabel={tGame("remove")}
                    />
                ))}

                {newCharacters.map((character) => (
                    <div key={character.clientId} className='w-full'>
                        <NewCard
                            type='player'
                            enableViewTransition={false}
                            cardId={String(character.clientId)}
                            avatarSrc={character.avatarSrc}
                            playerName={character.playerName}
                            characterName={character.characterName}
                            isMonster={character.isMonster}
                            showMonsterToggle={isMaster}
                            hp={character.hp}
                            armor={character.armor}
                            initiative={character.initiative}
                            onPlayerNameChange={(e) =>
                                updateNewCharacter(character.clientId, {
                                    playerName: e.target.value,
                                })
                            }
                            onCharacterNameChange={(e) =>
                                updateNewCharacter(character.clientId, {
                                    characterName: e.target.value,
                                })
                            }
                            onIsMonsterChange={
                                isMaster
                                    ? (checked) => {
                                          startTransition(() =>
                                              updateNewCharacter(
                                                  character.clientId,
                                                  {
                                                      isMonster: checked,
                                                  },
                                              ),
                                          );
                                      }
                                    : undefined
                            }
                            onHpChange={(e) =>
                                updateNewCharacter(character.clientId, {
                                    hp: e.target.value
                                        ? parseInt(e.target.value, 10)
                                        : undefined,
                                })
                            }
                            onArmorChange={(e) =>
                                updateNewCharacter(character.clientId, {
                                    armor: e.target.value
                                        ? parseInt(e.target.value, 10)
                                        : undefined,
                                })
                            }
                            onInitiativeChange={(value: number) =>
                                updateNewCharacter(character.clientId, {
                                    initiative: value,
                                })
                            }
                            onAddToFight={() => handleAddToFight(character)}
                            canAddToFight={character.characterName.trim() !== ""}
                            isAddingToFight={
                                addingCharacterId === character.clientId
                            }
                            onDelete={() => deleteNewCharacter(character.clientId)}
                        />
                    </div>
                ))}

                {isMaster && (
                    <MonsterFinderPanel
                        findMonsterLabel={tGame("findMonster")}
                        searchPlaceholder={tGame("searchMonstersPlaceholder")}
                        loadingLabel={tGame("monsterLoading")}
                        loadError={monsterCatalogError}
                        retryLabel={tGame("monsterRetry")}
                        noMatchesLabel={tGame("noMonsterMatches")}
                        closeLabel={tGame("closeMonsterFinder")}
                        catalog={monsterCatalog}
                        catalogLoading={monsterCatalogLoading}
                        search={monsterSearch}
                        onSearchChange={setMonsterSearch}
                        onRetryCatalog={() => setMonsterCatalogError(null)}
                        onAddByIndex={handleAddMonsterFromApi}
                        addingIndex={addingMonsterIndex}
                        onOpenChange={setMonsterFinderOpen}
                        compactTrigger
                    />
                )}

                {canShowAddCharacterButton && (
                    <div className='w-full'>
                        <Button
                            text={tGame("addMore")}
                            variant='secondary'
                            onClick={addNewCharacter}
                            className='w-full'
                        />
                    </div>
                )}

                {/* Fight scene name & Start a fight */}
                <div className='w-full mt-6 pt-6 border-t border-find-the-path flex flex-col gap-3'>
                    {snapshot.rooms && snapshot.rooms.length > 0 && (
                        <div className='w-full flex flex-col gap-2'>
                            <h3 className='text-body text-silvery-barbs w-full text-left'>
                                {tGame("existingRooms")}
                            </h3>
                            <RoomEntryList
                                rooms={snapshot.rooms}
                                onEnterRoom={handleEnterRoom}
                            />
                        </div>
                    )}
                    {isMaster && (
                        <>
                            <Input
                                placeholder={tGame("fightName")}
                                defaultValue={fightSceneName}
                                onChange={(e) => setFightSceneName(e.target.value)}
                                className='w-full'
                            />
                            <Button
                                text={
                                    isStartingFight
                                        ? tGame("startingFight")
                                        : tGame("startFight")
                                }
                                variant='primary'
                                onClick={handleStartFight}
                                isDisabled={isStartingFight || unitList.length === 0}
                                className='w-full'
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
