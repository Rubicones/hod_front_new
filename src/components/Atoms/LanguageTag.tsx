import classNames from "classnames";
import X from "../../app/icons/X.svg";
import Image from "next/image";
type Props = {
    isEditable: boolean;
    onDelete?: () => void;
    text: string;
};

const LanguageTag = ({ isEditable = false, onDelete, text }: Props) => {
    return (
        <div
            className={classNames(
                "py-2 px-3 rounded-[10px] flex items-center justify-center gap-3 w-fit",
                isEditable
                    ? "bg-find-the-path text-beacon-of-hope"
                    : "bg-find-the-path text-genele-repose"
            )}
        >
            <span className='text-tag font-medium text-nowrap -translate-y-[1px]'>{text}</span>
            {isEditable && (
                <Image src={X} alt="delete" width={12} height={12}
                    onClick={onDelete}
                    className="cursor-pointer"
                />
            )}
        </div>
    );
};

export default LanguageTag;
