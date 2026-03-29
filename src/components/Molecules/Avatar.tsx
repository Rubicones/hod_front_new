import classNames from "classnames";
import Image from "next/image";
import avatarPlaceholder from "../../app/icons/avatarPlaceholder.svg";
import graphicPattern from "../../app/images/graphicPattern1.svg";

type Props = {
    size: "small" | "medium" | "large";
    src?: string;
    isSelected?: boolean;
    withPattern?: boolean;
    isMonster?: boolean;
};

const Avatar = ({
    size,
    src = "",
    isSelected = false,
    withPattern = false,
    isMonster = false,
}: Props) => {
    const sizeClass = {
        small: "size-[57px]",
        medium: "size-[117px]",
        large: "size-[130px]",
    };

    return (
        <div
            className={classNames(
                sizeClass[size],
                size === "small" || src ? "justify-start" : "justify-center",
                src
                    ? withPattern
                        ? "bg-dark-star"
                        : "bg-gentle-repose"
                    : "bg-teleport",
                "relative flex rounded-[20px] aspect-square overflow-hidden",
                isSelected && "ring-2 ring-acid-arrow"
            )}
        >
            {src ? (
                <>
                    {withPattern && (
                        <Image
                            src={graphicPattern}
                            alt='graphic pattern'
                            className={classNames(
                                'absolute bottom-[25%] left-0 w-full h-full object-cover z-10',
                                isMonster && 'brightness-0'
                            )}
                        />
                    )}
                    <img
                        src={src}
                        alt='player-avatar'
                        className={classNames('object-cover z-20', isMonster && 'brightness-0')}
                    />
                </>
            ) : (
                <div className={classNames('flex flex-col w-full justify-center items-center', isMonster && 'brightness-0')}>
                    <Image
                        src={avatarPlaceholder}
                        alt='avatar placeholder'
                        className='opacity-60 self-center'
                    />
                    {size !== "small" && (
                        <span className='font-medium text-illusory-script opacity-60'>
                            Avatar
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default Avatar;
