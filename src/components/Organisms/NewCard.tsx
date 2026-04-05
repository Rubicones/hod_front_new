import classNames from "classnames";
import { ViewTransition, type ReactNode } from "react";
import Avatar from "../Molecules/Avatar";
import Input from "../Atoms/Input";
import ToggleInput from "../Molecules/ToggleInput";
import Button from "../Atoms/Button";
import { useTranslations } from "next-intl";

type InputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

type NewCardProps =
    | {
          type: "player";
          cardId?: string;
          avatarSrc?: string;
          isMonster?: boolean;
          onAvatarClick?: () => void;
          onDelete?: () => void;
          onCharacterNameChange?: InputChangeHandler;
          onPlayerNameChange?: InputChangeHandler;
          onIsMonsterChange?: (checked: boolean) => void;
          onHpChange?: InputChangeHandler;
          onArmorChange?: InputChangeHandler;
          onInitiativeChange?: (value: number) => void;
          onAddToFight?: () => void;
          canAddToFight?: boolean;
          isAddingToFight?: boolean;
          characterName?: string;
          playerName?: string;
          hp?: number;
          armor?: number;
          initiative?: number;
          /** When false, draft cards skip ViewTransition (e.g. game setup: avoids VT + fixed toolbar issues). */
          enableViewTransition?: boolean;
      }
    | {
          type: "NPC";
          onDelete?: () => void;
          onCharacterNameChange?: InputChangeHandler;
          onHpChange?: InputChangeHandler;
          onArmorChange?: InputChangeHandler;
          characterName?: string;
          hp?: number;
          armor?: number;
      };

export type Props = NewCardProps;

const NewCard = (props: Props) => {
    const tCard = useTranslations("card");
    const tGame = useTranslations("game");
    const { type, onDelete = () => {} } = props;

    // NPC Card
    if (type === "NPC") {
        const {
            onCharacterNameChange = () => {},
            onHpChange = () => {},
            onArmorChange = () => {},
            characterName = "",
            hp,
            armor,
        } = props;

        return (
            <div className="w-full flex flex-col gap-3 bg-time-stop rounded-2xl p-4">
                {/* Character name */}
                <Input
                    placeholder={tCard("characterName")}
                    defaultValue={characterName}
                    onChange={onCharacterNameChange}
                />

                {/* HP */}
                <Input
                    placeholder={tCard("hp")}
                    defaultValue={hp?.toString() || ""}
                    onChange={onHpChange}
                />

                {/* Armor */}
                <Input
                    placeholder={tCard("armor")}
                    defaultValue={armor?.toString() || ""}
                    onChange={onArmorChange}
                />

                {/* Delete button */}
                <Button
                    text={tGame("remove")}
                    variant="tertiary_small"
                    onClick={onDelete}
                />
            </div>
        );
    }

    // Player Card
    if (type === "player") {
        const {
            avatarSrc,
            isMonster = false,
            onAvatarClick = () => {},
            onCharacterNameChange = () => {},
            onPlayerNameChange = () => {},
            onIsMonsterChange = () => {},
            onHpChange = () => {},
            onArmorChange = () => {},
            onInitiativeChange = () => {},
            onAddToFight,
            canAddToFight = false,
            isAddingToFight = false,
            cardId,
            characterName = "",
            playerName = "",
            hp,
            armor,
            initiative,
            enableViewTransition = true,
        } = props;

        const vtNs = `newcard-${cardId ?? "default"}`;
        const Vt = enableViewTransition ? ViewTransition : StaticVt;

        return (
            <div className="w-full flex flex-col gap-[6px] bg-time-stop rounded-2xl p-4">
                {/* Header: Avatar + Names — avatar & player name fade out when monster */}
                <div
                    className={classNames(
                        "flex items-start gap-3",
                        isMonster && "flex-col"
                    )}
                >
                    {!isMonster && (
                        <Vt name={`${vtNs}-avatar`}>
                            <button
                                type="button"
                                onClick={onAvatarClick}
                                className="cursor-pointer shrink-0"
                            >
                                <Avatar
                                    size="medium"
                                    src={avatarSrc}
                                    isSelected={false}
                                    withPattern={false}
                                />
                            </button>
                        </Vt>
                    )}
                    <div
                        className={classNames(
                            "flex flex-col gap-1 min-w-0",
                            isMonster ? "w-full" : "flex-1"
                        )}
                    >
                        <Vt name={`${vtNs}-name`}>
                            <Input
                                placeholder={tCard("characterName")}
                                defaultValue={characterName}
                                onChange={onCharacterNameChange}
                            />
                        </Vt>
                        {!isMonster && (
                            <Vt name={`${vtNs}-player-name`}>
                                <Input
                                    placeholder={tCard("playerName")}
                                    defaultValue={playerName}
                                    onChange={onPlayerNameChange}
                                />
                            </Vt>
                        )}
                    </div>
                </div>

                {/* Body: Monster toggle, HP, Armor, Languages, Remove — moves up into freed space */}
                <Vt name={`${vtNs}-body`}>
                    <div className="flex flex-col gap-2">
                        <ToggleInput
                            label={tCard("monster")}
                            checked={isMonster}
                            onChange={onIsMonsterChange}
                        />
                        <Input
                            placeholder={tCard("hp")}
                            defaultValue={hp?.toString() || ""}
                            onChange={onHpChange}
                        />
                        <Input
                            placeholder={tCard("armor")}
                            defaultValue={armor?.toString() || ""}
                            onChange={onArmorChange}
                        />
                        {onAddToFight && (
                            <Button
                                text={isAddingToFight ? tGame("addToFight") : tGame("addToFight")}
                                variant="primary"
                                onClick={onAddToFight}
                                isDisabled={!canAddToFight || isAddingToFight}
                                className="w-full"
                            />
                        )}
                        <Button
                            text={tGame("remove")}
                            variant="tertiary_small"
                            onClick={onDelete}
                        />
                    </div>
                </Vt>
            </div>
        );
    }

    return null;
};

/** Renders children only — used when ViewTransition would churn the document snapshot. */
function StaticVt({
    name: _name,
    children,
}: {
    name: string;
    children: ReactNode;
}) {
    return <>{children}</>;
}

export default NewCard;

