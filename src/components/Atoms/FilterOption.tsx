import classNames from "classnames";

type Props = {
    label: string;
    isSelected?: boolean;
    onClick?: () => void;
};

const FilterOption = ({ label, isSelected = false, onClick }: Props) => {
    return (
        <button
            type='button'
            onClick={onClick}
            className={classNames(
                "w-full text-left self-left py-1 text-body transition-all duration-300 pl-[47px]",
                isSelected ? "text-beacon-of-hope" : "text-after-self"
            )}
        >
            {label}
        </button>
    );
};

export default FilterOption;
