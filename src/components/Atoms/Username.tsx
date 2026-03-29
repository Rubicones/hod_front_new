import classNames from "classnames";

type Props = {
    characterName: string;
    userName: string;
    variant: "light" | "dark";
};

const Username = ({ characterName, userName, variant = "dark" }: Props) => {
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
                <p className='text-lg font-medium text-genele-repose capitalize leading-tight'>
                    {characterName}
                </p>
                <p className='text-lg font-medium text-crusaders-mantle capitalize leading-tight'>
                    {userName}
                </p>
            </div>
        </div>
    );
};

export default Username;
