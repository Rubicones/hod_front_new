import classNames from "classnames";

type Props = {
    withLevel?: boolean;
    level?: number;
    text: string;
    isActive: boolean;
};

const Tag = ({ withLevel, level, text, isActive }: Props) => {
    return (
        <div
            className={classNames(
                "py-1 rounded-full flex items-center justify-end w-min gap-3",
                isActive
                    ? "bg-find-the-path text-genele-repose"
                    : "bg-cone-of-cold text-crusaders-mantle",
                withLevel ? "pr-1 pl-4" : "px-4"
            )}
        >
            <p className='text-tag font-medium text-nowrap'>{text}</p>
            {withLevel && (
                <div
                    className={classNames(
                        "rounded-full aspect-square flex items-center justify-center size-6 bg-forbiddance p-2"
                    )}
                >
                    {level}
                </div>
            )}
        </div>
    );
};

export default Tag;
