import { useState, startTransition } from "react";
import NewCard from "@/components/Organisms/NewCard";
import Button from "@/components/Atoms/Button";
import { useTranslations } from "next-intl";

type Character = {
    id: string;
    playerName: string;
    characterName: string;
    isMonster: boolean;
    hp: number | undefined;
    armor: number | undefined;
    initiative: number | undefined;
    languages: string[];
    avatarSrc?: string;
};

type CharacterCreationProps = {
    onStartGame: (characters: Character[]) => void;
    isStartingGame?: boolean;
};

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

export default function CharacterCreation({
    onStartGame,
    isStartingGame = false,
}: CharacterCreationProps) {
    const tGame = useTranslations("game");
    const [characters, setCharacters] = useState<Character[]>([createEmptyCharacter()]);

    const updateCharacter = (id: string, updates: Partial<Character>) => {
        setCharacters(prev =>
            prev.map(char => (char.id === id ? { ...char, ...updates } : char))
        );
    };

    const deleteCharacter = (id: string) => {
        setCharacters(prev => prev.filter(char => char.id !== id));
    };

    const addCharacter = () => {
        setCharacters(prev => [...prev, createEmptyCharacter()]);
    };

    const handleStartGame = () => {
        onStartGame(characters);
    };

    const canStartGame =
        !isStartingGame &&
        characters.length > 0 &&
        characters.some((c) => c.characterName.trim() !== "");

    return (
        <div className='w-full h-full flex flex-col pt-20 pb-8 overflow-y-auto'>
            {/* Character cards */}
            <div className='w-full flex flex-col items-center gap-4 px-4'>
                {characters.map(character => (
                    <NewCard
                        key={character.id}
                        cardId={character.id}
                        type='player'
                        avatarSrc={character.avatarSrc}
                        playerName={character.playerName}
                        characterName={character.characterName}
                        isMonster={character.isMonster}
                        hp={character.hp}
                        armor={character.armor}
                        initiative={character.initiative}
                        onPlayerNameChange={e =>
                            updateCharacter(character.id, { playerName: e.target.value })
                        }
                        onCharacterNameChange={e =>
                            updateCharacter(character.id, { characterName: e.target.value })
                        }
                        onIsMonsterChange={checked =>
                            startTransition(() =>
                                updateCharacter(character.id, { isMonster: checked })
                            )
                        }
                        onHpChange={e =>
                            updateCharacter(character.id, {
                                hp: e.target.value ? parseInt(e.target.value) : undefined,
                            })
                        }
                        onArmorChange={e =>
                            updateCharacter(character.id, {
                                armor: e.target.value ? parseInt(e.target.value) : undefined,
                            })
                        }
                        onInitiativeChange={(value) =>
                            updateCharacter(character.id, { initiative: value })
                        }
                        onDelete={() => deleteCharacter(character.id)}
                    />
                ))}
            </div>

            {/* Add more button */}
            <div className='px-4 mt-4'>
                <Button
                    text={tGame("addMore")}
                    variant='secondary'
                    onClick={addCharacter}
                    className='w-full'
                />
            </div>

            {/* Start game button */}
            <div className='px-4 mt-4'>
                <Button
                    text={isStartingGame ? tGame("startingFight") : tGame("startGame")}
                    variant='primary'
                    onClick={handleStartGame}
                    isDisabled={!canStartGame}
                    className='w-full'
                />
            </div>
        </div>
    );
}

export type { Character };
