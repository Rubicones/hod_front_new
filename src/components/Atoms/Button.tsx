import classNames from "classnames";

type Props = {
    text: string;
    variant:
        | "primary"
        | "secondary"
        | "tertiary_big"
        | "tertiary_small"
        | "error_big"
        | "error_small";
    onClick: () => void;
    isDisabled?: boolean;
    className?: string;
};

const Button = ({ text, onClick, variant, isDisabled, className }: Props) => {
    let buttonVariantClass = "bg-cone-of-cold text-alter-self";

    if (!isDisabled) {
        switch (variant) {
            case "primary":
                buttonVariantClass =
                    "bg-acid-arrow text-cloudkill [box-shadow:0_0_20px_#F0FF0065] active:bg-key-lime-pie active:text-cloudkill";
                break;
            case "secondary":
                buttonVariantClass =
                    "bg-mine-shaft/70 text-beacon-of-hope active:bg-eerie-black/80 active:text-beacon-of-hope";
                break;
            case "tertiary_big":
            case "tertiary_small":
                buttonVariantClass =
                    "bg-gentle-repose text-cloudkill active:bg-wet-sand active:text-cloudkill";
                break;
            case "error_big":
            case "error_small":
                buttonVariantClass =
                    "bg-fire-storm text-gentle-repose active:bg-incandescent-red active:text-gentle-repose";
                break;
            default:
                buttonVariantClass = "";
        }
    }

    return (
        <button
            className={classNames(
                className,
                buttonVariantClass,
                (variant.includes("big") || variant === 'primary' || variant === 'secondary') ? "py-12 px-12" : "py-4 px-20",
                "rounded-xl text-button transition-all duration-300 text-center",
                
            )}
            onClick={onClick}
            disabled={isDisabled}
        >
            {text}
        </button>
    );
};

export default Button;
