import { useState } from "react";
import Image from "next/image";
import Avatar from "../Molecules/Avatar";
import Button from "../Atoms/Button";
import Username from "../Atoms/Username";
import EffectsList from "../Molecules/EffectsList";
import LanguagesPicker from "../Molecules/LanguagesPicker";
import Input from "../Atoms/Input";
import ToggleInput from "../Molecules/ToggleInput";
import StatsSmall from "../Atoms/StatsSmall";
import graphicPattern1 from "../../app/images/graphicPattern1.svg";
import graphicPattern2 from "../../app/images/graphicPattern2.svg";
import npcAvatar from "../../app/images/orcIconMale.png";
import { useTranslations } from "next-intl";
type MainCardEffect = {
    id: string;
    name: string;
    description?: string;
    icon?: React.ReactNode;
};

type MainCardProps =
    | {
          isActive: boolean;
          showInitiative: boolean;
          type: "player";
          effects?: MainCardEffect[];
          languages?: string[];
          hp?: number;
          armor?: number;
          isConcentrated?: boolean;
          initiative?: number | null;
          playerName: string;
          characterName: string;
          avatarSrc?: string;
          allEffects?: MainCardEffect[];
          onEffectToggle?: (effectId: string) => void;
          onLanguagesChange?: (languages: string[]) => void;
          onConcentrationChange?: (value: boolean) => void;
          onHpChange?: (value: number) => void;
          onArmorChange?: (value: number) => void;
          onInitiativeChange?: (value: number) => void;
          /** Room: collapse expanded off-turn card when name is clicked */
          onNameClick?: () => void;
      }
    | {
          isActive: boolean;
          showInitiative: boolean;
          type: "NPC";
          effects?: MainCardEffect[];
          hp?: number;
          armor?: number;
          isConcentrated?: boolean;
          initiative?: number | null;
          name?: string;
          allEffects?: MainCardEffect[];
          onEffectToggle?: (effectId: string) => void;
          onConcentrationChange?: (value: boolean) => void;
          onHpChange?: (value: number) => void;
          onArmorChange?: (value: number) => void;
          onInitiativeChange?: (value: number) => void;
          onNameClick?: () => void;
      };

export type Props = MainCardProps;

const MainCard = (props: Props) => {
    const {
        isActive,
        showInitiative,
        effects = [],
        hp,
        armor,
        isConcentrated = false,
        initiative,
    } = props;

    const allEffects = "allEffects" in props ? props.allEffects || [] : [];
    const onEffectToggle =
        "onEffectToggle" in props
            ? props.onEffectToggle || (() => {})
            : () => {};
    const onConcentrationChange =
        "onConcentrationChange" in props
            ? props.onConcentrationChange || (() => {})
            : () => {};

    const tCard = useTranslations("card");

    const selectedEffectIds = effects.map((e) => e.id);

    // Inactive Player Card
    if (props.type === "player" && !isActive) {
        const { characterName, playerName, avatarSrc } = props;
        return (
            <div className='relative w-full  bg-time-stop rounded-[20px] overflow-hidden'>
                {/* Content */}
                <div className='relative z-10 '>
                    {/* Header */}
                    <div className='flex justify-between items-start mb-2 p-4'>
                        <div className='flex flex-col gap-2 w-full'>
                            <Username
                                characterName={characterName}
                                userName={playerName}
                                variant='light'
                            />
                            <div className='flex items-center gap-2 mt-1 flex-wrap'>
                                <StatsSmall
                                    type='hp'
                                    value={hp ?? 0}
                                    size={16}
                                />
                                <StatsSmall
                                    type='armor'
                                    value={armor ?? 0}
                                    size={16}
                                />
                                {showInitiative && (
                                    <StatsSmall
                                        type='initiative'
                                        value={initiative ?? 0}
                                        size={16}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Avatar */}
                    <div className='w-full flex justify-center'>
                        <div className='w-1/2 aspect-square relative'>
                            {/* Pattern overlay */}
                            <Image
                                src={graphicPattern1}
                                alt=''
                                className='absolute translate-x-10 inset-0 w-full h-full object-contain z-0 scale-125'
                            />
                        </div>
                        <div className='w-1/2 aspect-square'>
                            <img
                                src={avatarSrc}
                                alt='avatar'
                                className='object-cover h-full z-20 -translate-x-[10px] scale-125'
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Inactive NPC Card
    if (props.type === "NPC" && !isActive) {
        const name = props.name || tCard("monster");
        return (
            <div className='relative w-full  bg-time-stop rounded-[20px] overflow-hidden'>
                {/* Content */}
                <div className='relative z-10 '>
                    {/* Header */}
                    <div className='flex justify-between items-start mb-2 p-4'>
                        <div className='flex flex-col gap-2 w-full'>
                            <Username
                                characterName={name}
                                userName={"NPC"}
                                variant='light'
                            />
                            <div className='flex items-center gap-2 mt-1 flex-wrap'>
                                <StatsSmall
                                    type='hp'
                                    value={hp ?? 0}
                                    size={16}
                                />
                                <StatsSmall
                                    type='armor'
                                    value={armor ?? 0}
                                    size={16}
                                />
                                {showInitiative && (
                                    <StatsSmall
                                        type='initiative'
                                        value={initiative ?? 0}
                                        size={16}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Avatar */}
                    <div className='w-full flex justify-center'>
                        <div className='w-1/2 aspect-square relative'>
                            {/* Pattern overlay */}
                            <Image
                                src={graphicPattern1}
                                alt=''
                                className='absolute translate-x-10 inset-0 w-full h-full object-contain z-0 scale-125 brightness-0 '
                            />
                        </div>
                        <div className='w-1/2 aspect-square'>
                            <img
                                src={npcAvatar.src}
                                alt='avatar'
                                className='object-cover h-full z-20 -translate-x-[10px] scale-125 brightness-0'
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Active Player Card
    if (props.type === "player" && isActive) {
        const {
            characterName,
            playerName,
            avatarSrc,
            languages = [],
            onLanguagesChange = () => {},
            onHpChange,
            onArmorChange,
            onInitiativeChange,
            onNameClick,
        } = props;

        return (
            <div className='w-full flex flex-col rounded-2xl bg-time-stop p-4'>
                {/* Header: Avatar + Username */}
                <div className='flex items-center'>
                    <Avatar
                        size='small'
                        src={avatarSrc}
                        isSelected={false}
                        withPattern={true}
                    />
                    <div className='flex-1'>
                        <Username
                            characterName={characterName}
                            userName={playerName}
                            variant='dark'
                            onCharacterNameClick={onNameClick}
                        />
                    </div>
                </div>

                <div className='w-full my-3 h-px bg-find-the-path'></div>

                {/* Effects */}
                <EffectsList
                    allEffects={allEffects}
                    selectedEffectIds={selectedEffectIds}
                    onEffectToggle={onEffectToggle}
                />

                {/* Languages */}
                {/* <LanguagesPicker
                    languages={languages}
                    isEditable={false}
                    onLanguagesChange={onLanguagesChange}
                /> */}

                {/* Editable stats when callbacks provided */}
                {(onHpChange || onArmorChange || onInitiativeChange) && (
                    <>
                        <div className='w-full my-3 h-px bg-find-the-path'></div>
                        <div className='w-full flex flex-col gap-[6px]'>
                            {onHpChange && (
                                <Input
                                    key={`hp-${hp}`}
                                    placeholder={tCard("hp")}
                                    defaultValue={hp?.toString() || ""}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value, 10);
                                        if (!Number.isNaN(v)) onHpChange(v);
                                    }}
                                />
                            )}
                            {onArmorChange && (
                                <Input
                                    key={`armor-${armor}`}
                                    placeholder={tCard("armor")}
                                    defaultValue={armor?.toString() || ""}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value, 10);
                                        if (!Number.isNaN(v)) onArmorChange(v);
                                    }}
                                />
                            )}
                            {showInitiative && onInitiativeChange && (
                                <Input
                                    key={`init-${initiative}`}
                                    placeholder={tCard("initiative")}
                                    defaultValue={initiative?.toString() || ""}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value, 10);
                                        if (!Number.isNaN(v))
                                            onInitiativeChange(v);
                                    }}
                                />
                            )}
                            {showInitiative && (
                                <ToggleInput
                                    checked={isConcentrated}
                                    label={tCard("concentration")}
                                    onChange={onConcentrationChange}
                                />
                            )}
                        </div>
                    </>
                )}

                {showInitiative &&
                    !onInitiativeChange &&
                    (initiative !== undefined || isConcentrated !== undefined) && (
                    <>
                        <div className='w-full my-3 h-px bg-find-the-path'></div>
                        <div className='w-full flex flex-col gap-[6px]'>
                            <Input
                                placeholder={tCard("initiative")}
                                defaultValue={initiative?.toString() || ""}
                                onChange={() => {}}
                            />
                            <ToggleInput
                                checked={isConcentrated}
                                label={tCard("concentration")}
                                onChange={onConcentrationChange}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Active NPC Card
    if (props.type === "NPC" && isActive) {
        const name = props.name || tCard("monster");
        const onHpChange = "onHpChange" in props ? props.onHpChange : undefined;
        const onArmorChange =
            "onArmorChange" in props ? props.onArmorChange : undefined;
        const onInitiativeChange =
            "onInitiativeChange" in props
                ? props.onInitiativeChange
                : undefined;
        const onNameClick =
            "onNameClick" in props ? props.onNameClick : undefined;

        return (
            <div className='w-full flex flex-col gap-[6px] bg-time-stop p-2 rounded-2xl'>
                <div className='w-full p-1 py-2'>
                    <Username
                        characterName={name}
                        userName={"NPC"}
                        variant='light'
                        onCharacterNameClick={onNameClick}
                    />
                </div>

                {/* Effects */}
                <EffectsList
                    allEffects={allEffects}
                    selectedEffectIds={selectedEffectIds}
                    onEffectToggle={onEffectToggle}
                />
                <div className='w-full my-3 h-px bg-find-the-path'></div>

                {/* Armor */}
                <Input
                    placeholder={tCard("armor")}
                    displayMode={!onArmorChange}
                    defaultValue={armor?.toString() || ""}
                    onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (onArmorChange && !Number.isNaN(v))
                            onArmorChange(v);
                    }}
                />

                {/* HP */}
                <Input
                    placeholder={tCard("hp")}
                    displayMode={!onHpChange}
                    defaultValue={hp?.toString() || ""}
                    onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (onHpChange && !Number.isNaN(v)) onHpChange(v);
                    }}
                />

                {/* Initiative & Concentration (conditional) */}
                {showInitiative && (
                    <div className='w-full flex flex-col gap-[6px]'>
                        {onInitiativeChange ? (
                            <Input
                                placeholder={tCard("initiative")}
                                defaultValue={initiative?.toString() || ""}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value, 10);
                                    if (!Number.isNaN(v))
                                        onInitiativeChange(v);
                                }}
                            />
                        ) : (
                            <Input
                                placeholder={tCard("initiative")}
                                defaultValue={initiative?.toString() || ""}
                                onChange={() => {}}
                            />
                        )}
                        <ToggleInput
                            checked={isConcentrated}
                            label={tCard("concentration")}
                            onChange={onConcentrationChange}
                        />
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default MainCard;
