 "use client";

import { useState, useCallback, startTransition, ViewTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import MainCard from "@/components/Organisms/MainCard";
import NewCard from "@/components/Organisms/NewCard";
import Button from "@/components/Atoms/Button";
import Input from "@/components/Atoms/Input";
import { api } from "@/lib/api";
import avatarPlaceholder from "@/app/images/elfIconMale.png";
import { conditions } from "@/data/conditions";
import type { Character } from "./CharacterCreation";
import { useLocale, useTranslations } from "next-intl";

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
    rooms?: Record<string, unknown>;
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
        : (avatarPlaceholder as { src: string }).src ?? "";

// Map conditions to EffectsList shape (id, name, description)
const ALL_CONDITIONS_AS_EFFECTS = conditions.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.effects?.join("\n") ?? "",
}));

const createEmptyCharacter = (): Character => ({
    id: crypto.randomUUID(),
    playerName: "",
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

function parseSnapshotUnits(data: { units?: Record<string, RawGameUnit> }): Record<string, GameUnit> {
    const rawUnits = data?.units ?? {};
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
            },
        ]),
    );
}

export default function GameStartingScreen({
    snapshot,
    gameId,
    token,
}: GameStartingScreenProps) {
    const [units, setUnits] = useState<Record<string, GameUnit>>(
        () => snapshot.units || {}
    );
    const [newCharacters, setNewCharacters] = useState<Character[]>(() => {
        const hasExistingUnits =
            snapshot.units && Object.keys(snapshot.units).length > 0;
        return hasExistingUnits ? [] : [createEmptyCharacter()];
    });
    const [addingCharacterId, setAddingCharacterId] = useState<string | null>(null);
    const [fightSceneName, setFightSceneName] = useState("");
    const [isStartingFight, setIsStartingFight] = useState(false);
    const unitList = Object.values(units);
    const router = useRouter();
    const params = useParams();
    const gameCode = (params?.gameId as string) || "";
    const locale = useLocale();
    const tGame = useTranslations("game");
    const tCard = useTranslations("card");

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
                    token
                );
                updateUnit(unitId, { hp });
            } catch (err) {
                console.error("Set HP failed:", err);
            }
        },
        [gameId, token, updateUnit]
    );

    const setArmor = useCallback(
        async (unitId: string, armor: number) => {
            try {
                await api.post(
                    `/game/${gameId}/units/${unitId}/armor/set`,
                    { armor },
                    token
                );
                updateUnit(unitId, { armor });
            } catch (err) {
                console.error("Set armor failed:", err);
            }
        },
        [gameId, token, updateUnit]
    );

    const setInitiative = useCallback(
        async (unitId: string, initiative: number) => {
            try {
                await api.post(
                    `/game/${gameId}/units/${unitId}/initiative/set`,
                    { initiative },
                    token
                );
                updateUnit(unitId, { initiative });
            } catch (err) {
                console.error("Set initiative failed:", err);
            }
        },
        [gameId, token, updateUnit]
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
                    `/game/${gameId}/units/${unitId}/effects`,
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
                    token
                );

                const parsedUnits = parseSnapshotUnits(
                    res.snapshot ?? res.data ?? {},
                );
                setUnits(parsedUnits);
            } catch (err) {
                console.error("Add effect failed:", err);
            }
        },
        [gameId, token]
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
                const res = await api.delete<{
                    snapshot?: { units?: Record<string, RawGameUnit> };
                    data?: { units?: Record<string, RawGameUnit> };
                }>(
                    `/game/${gameId}/units/${unitId}/effects/${effectInstanceId}`,
                    token
                );
                const parsedUnits = parseSnapshotUnits(
                    res.snapshot ?? res.data ?? {},
                );
                setUnits(parsedUnits);
            } catch (err) {
                console.error("Remove effect failed:", err);
            }
        },
        [gameId, token, units]
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
        [units, addEffect, removeEffect]
    );

    const updateNewCharacter = useCallback((id: string, updates: Partial<Character>) => {
        setNewCharacters((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
    }, []);

    const deleteNewCharacter = useCallback((id: string) => {
        startTransition(() => {
            setNewCharacters((prev) => prev.filter((c) => c.id !== id));
        });
    }, []);

    const addNewCharacter = useCallback(() => {
        startTransition(() => {
            setNewCharacters((prev) => [...prev, createEmptyCharacter()]);
        });
    }, []);

    const handleAddToFight = useCallback(
        async (character: Character) => {
            if (character.characterName.trim() === "") return;

            setAddingCharacterId(character.id);
            try {
                const created = await api.post<{ id: string }>(
                    "/character/create",
                    {
                        name: character.characterName.trim(),
                        initiative: character.initiative ?? 0,
                        armor: character.armor ?? 0,
                        hp: character.hp ?? 0,
                        is_monster: character.isMonster ?? false,
                        languages: character.languages ?? [],
                        passive_perception: 10,
                        passive_investigation: 10,
                        passive_insight: 10,
                    },
                    token
                );
                await api.post(
                    `/game/register?game_id=${gameId}`,
                    { character_id: created.id },
                    token
                );
                const snapshotRes = await api.post<{
                    data?: { units?: Record<string, RawGameUnit> };
                }>(`/game/${gameId}/get_snapshot`, {}, token);
                const freshUnits = parseSnapshotUnits(snapshotRes?.data ?? {});
                startTransition(() => {
                    setUnits(freshUnits);
                    setNewCharacters((prev) => prev.filter((c) => c.id !== character.id));
                });
            } catch (err) {
                console.error("Add to fight failed:", err);
                alert(err instanceof Error ? err.message : "Failed to add to fight");
            } finally {
                setAddingCharacterId(null);
            }
        },
        [gameId, token]
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
                token
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
                data?: { units?: Record<string, RawGameUnit> };
            }>(`/game/${gameId}/get_snapshot`, {}, token);
            const latestUnits = parseSnapshotUnits(snapshotRes?.data ?? {});
            const unitIds = Object.keys(latestUnits);

            for (const unitId of unitIds) {
                await api.post(
                    `/game/${gameId}/rooms/${roomId}/participants`,
                    { unit_id: unitId, action: "add" },
                    token
                );
            }

            // 3) Start the room
            await api.post(
                `/game/${gameId}/rooms/${roomId}/start`,
                {},
                token
            );

            if (gameCode) {
                router.push(`/${locale}/game/${gameCode}/rooms/${roomId}`);
            }
        } catch (err) {
            console.error("Start fight failed:", err);
            alert(err instanceof Error ? err.message : "Failed to start fight");
        } finally {
            setIsStartingFight(false);
        }
    }, [fightSceneName, gameCode, gameId, isStartingFight, router, token]);

    return (
        <div className="w-full h-full flex flex-col pt-4 pb-8 overflow-y-auto">
            <div className="flex flex-col gap-4 px-4 items-center">
                {unitList.map((unit) => (
                    <ViewTransition key={unit.id} name={`unit-${unit.id}`}>
                        <MainCard
                            key={unit.id}
                            type={unit.is_monster ? "NPC" : "player"}
                            isActive={true}
                            showInitiative={true}
                            characterName={unit.name}
                            playerName={tCard("playerName")}
                            name={unit.name}
                            avatarSrc={avatarSrc || undefined}
                            hp={unit.hp}
                            armor={unit.armor}
                            initiative={unit.initiative}
                            allEffects={ALL_CONDITIONS_AS_EFFECTS}
                            effects={(unit.effects ?? []).map((e) => ({
                                id: e.id,
                                name: e.name,
                                description: e.description,
                            }))}
                            onEffectToggle={(effectId) =>
                                handleEffectToggle(unit.id, effectId)
                            }
                            isConcentrated={false}
                            onConcentrationChange={() => {}}
                            onHpChange={(value) => setHp(unit.id, value)}
                            onArmorChange={(value) => setArmor(unit.id, value)}
                            onInitiativeChange={(value) =>
                                setInitiative(unit.id, value)
                            }
                        />
                    </ViewTransition>
                ))}

                {newCharacters.map((character) => (
                    <NewCard
                        key={character.id}
                        type="player"
                        cardId={character.id}
                        avatarSrc={character.avatarSrc}
                        playerName={character.playerName}
                        characterName={character.characterName}
                        isMonster={character.isMonster}
                        hp={character.hp}
                        armor={character.armor}
                        initiative={character.initiative}
                        onPlayerNameChange={(e) =>
                            updateNewCharacter(character.id, { playerName: e.target.value })
                        }
                        onCharacterNameChange={(e) =>
                            updateNewCharacter(character.id, { characterName: e.target.value })
                        }
                        onIsMonsterChange={(checked) => {
                            startTransition(() =>
                                updateNewCharacter(character.id, { isMonster: checked })
                            );
                        }}
                        onHpChange={(e) =>
                            updateNewCharacter(character.id, {
                                hp: e.target.value ? parseInt(e.target.value, 10) : undefined,
                            })
                        }
                        onArmorChange={(e) =>
                            updateNewCharacter(character.id, {
                                armor: e.target.value ? parseInt(e.target.value, 10) : undefined,
                            })
                        }
                        onInitiativeChange={(value: number) =>
                            updateNewCharacter(character.id, { initiative: value })
                        }
                        onAddToFight={() => handleAddToFight(character)}
                        canAddToFight={character.characterName.trim() !== ""}
                        isAddingToFight={addingCharacterId === character.id}
                        onDelete={() => deleteNewCharacter(character.id)}
                    />
                ))}

                <div className="w-full">
                    <Button
                        text={tGame("addMore")}
                        variant="secondary"
                        onClick={addNewCharacter}
                        className="w-full"
                    />
                </div>

                {/* Fight scene name & Start a fight */}
                <div className="w-full mt-6 pt-6 border-t border-find-the-path flex flex-col gap-3">
                    <Input
                        placeholder={tGame("fightName")}
                        defaultValue={fightSceneName}
                        onChange={(e) => setFightSceneName(e.target.value)}
                        className="w-full"
                    />
                    <Button
                        text={isStartingFight ? tGame("startingFight") : tGame("startFight")}
                        variant="primary"
                        onClick={handleStartFight}
                        isDisabled={isStartingFight || unitList.length === 0}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}
