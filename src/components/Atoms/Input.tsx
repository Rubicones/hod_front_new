import classNames from "classnames";
import { useState, useRef } from "react";
import InsightIcon from "../Icons/InsightIcon";
import PerceptionIcon from "../Icons/PerceptionIcon";
import ArmorIcon from "../Icons/ArmorIcon";
import InvestigationIcon from "../Icons/InvestigationIcon";
import InitiativeIcon from "../Icons/InitiativeIcon";
import HpIcon from "../Icons/HpIcon";

type Props = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    isError?: boolean;
    errorMessage?: string;
    displayMode?: boolean;
    defaultValue?: string;
    type?: string;
    className?: string;
    name?: string;
    inputMode?: "email" | "search" | "text" | "tel" | "url" | "none" | "numeric" | "decimal" | undefined;
    iconType?: "insight" | "investigation" | "perception" | "armor" | "initiative" | "hp";
};

const DEFAULT_PLACEHOLDERS = [
    "insight",
    "investigation",
    "perception",
    "armor",
    "initiative",
    "hp",
];

const Input = ({
    onChange,
    placeholder,
    isError = false,
    errorMessage,
    displayMode = false,
    defaultValue = "",
    type = "text",
    className,
    name,
    inputMode = "text",
    iconType,
}: Props) => {
    const [value, setValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const resolvedIconType = iconType ?? placeholder.toLowerCase();

    // Get the appropriate icon based on explicit iconType or placeholder fallback.
    const getIcon = (state?: string, size?: number) => {
        if (resolvedIconType === "insight")
            return <InsightIcon state={state} size={size} />;
        if (resolvedIconType === "investigation")
            return <InvestigationIcon state={state} size={size} />;
        if (resolvedIconType === "perception")
            return <PerceptionIcon state={state} size={size} />;
        if (resolvedIconType === "armor")
            return <ArmorIcon state={state} size={size} />;
        if (resolvedIconType === "initiative")
            return <InitiativeIcon state={state} size={size} />;
        if (resolvedIconType === "hp")
            return <HpIcon state={state} size={size} />;
    };

    if (displayMode) {
        return (
            <div
                className={classNames(
                    "relative w-full h-[55px] text-gentle-repose overflow-hidden flex items-center py-[10px] rounded-[25px] transition-all ease-linear duration-300 justify-end bg-dark-star max-w-full px-[10px]",
                )}
            >
                <div className='flex items-center shrink-0'>
                    {getIcon("active", 37)}
                </div>
                <div className='flex items-center mx-3 flex-1'>
                    <p className='text-body font-medium capitalize'>
                        {placeholder}
                    </p>
                </div>

                {/* Level number on the right */}
                <div className='w-15 flex justify-center items-center'>
                    <span
                        className={classNames(
                            "text-stats-profile font-medium transition-colors duration-300",
                        )}
                    >
                        {defaultValue}
                    </span>
                </div>
            </div>
        );
    }

    // Active state is derived from focus or having a value
    const isActive = isFocused || value.length > 0;

    const handleFocus = () => {
        setIsFocused(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e);
    };

    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            setIsFocused(true);
        }
    };

    let inputClasses = "border-find-the-path bg-teleport";

    if (isError) {
        inputClasses = "border-fire-storm bg-hellish-rebuke";
    }

    return (
        <div className={classNames("relative w-full", className)}>
            <div
                ref={containerRef}
                onClick={handleContainerClick}
                className={classNames(
                    "rounded-xl  border border-px  h-14 w-full relative cursor-text flex justify-between transition-all duration-200",
                    inputClasses,
                    isActive ? "text-beacon-of-hope" : "text-silent-image",
                )}
            >
                <input
                    ref={inputRef}
                    type={type}
                    inputMode={inputMode}
                    value={value}
                    autoComplete='off'
                    name={name}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={classNames(
                        "absolute inset-0 w-full h-full border-none outline-none bg-transparent  pl-4 pr-14 z-10",
                        isActive
                            ? "text-body -translate-y-[2px] pb-4"
                            : "text-transparent",
                    )}
                />
                <span
                    className={classNames(
                        "absolute pointer-events-none transition-all duration-200 capitalize left-4",
                        isActive
                            ? "text-label bottom-1"
                            : "text-body top-1/2 -translate-y-1/2",
                    )}
                >
                    {placeholder}
                </span>
                {DEFAULT_PLACEHOLDERS.includes(resolvedIconType) && (
                    <div className='absolute top-[10px] right-4 z-20 pointer-events-none flex items-center'>
                        {getIcon(isActive ? "active" : "inactive")}
                    </div>
                )}
            </div>
            {isError && errorMessage && (
                <span className='absolute text-label top-full left-0 mt-1 text-label text-fire-storm'>
                    {errorMessage}
                </span>
            )}
        </div>
    );
};

export default Input;
