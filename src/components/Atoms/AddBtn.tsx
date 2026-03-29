import classNames from "classnames";

type Props = {
    onClick: () => void;
};

const AddBtn = ({ onClick }: Props) => {
 

    return (
        <button
            className={classNames(
                "bg-gentle-repose text-circle-of-power px-5 text-2xl rounded-full cursor-pointer"
            )}
            onClick={onClick}
        >
            +
        </button>
    );
};

export default AddBtn;
