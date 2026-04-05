import classNames from "classnames";

type Props = {
    characterName: string;
    userName: string;
    variant: "light" | "dark";
    /** When set, the character name is clickable (e.g. collapse expanded room card). */
    onCharacterNameClick?: () => void;
};

const Username = ({
    characterName,
    userName,
    variant = "dark",
    onCharacterNameClick,
}: Props) => {
    const nameClass =
        "text-lg font-medium text-genele-repose capitalize leading-tight";

    const nameEl = onCharacterNameClick ? (
        <button
            type="button"
            className={classNames(
                nameClass,
                "w-full bg-transparent border-0 p-0 text-left cursor-pointer hover:opacity-90",
            )}
            onClick={(e) => {
                e.stopPropagation();
                onCharacterNameClick();
            }}
        >
            {characterName}
        </button>
    ) : (
        <p className={nameClass}>{characterName}</p>
    );

    return (
        <div
            className={classNames(
                "w-full text-gentle-repose overflow-hidden flex rounded-[20px] justify-start max-w-full ",
                variant === "light" ? "" : "bg-dark-star py-2 px-3"
            )}
        >
            <div
                className={classNames(
                    "flex w-full h-full",
                    variant === "light"
                        ? "justify-between items-center"
                        : "flex-col items-start"
                )}
            >
                {nameEl}
                <p className='text-lg font-medium text-crusaders-mantle capitalize leading-tight'>
                    {userName}
                </p>
            </div>
        </div>
    );
};

export default Username;
