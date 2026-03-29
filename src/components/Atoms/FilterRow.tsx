import { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import Image from "next/image";
import checkIcon from "../../app/icons/check.svg";
import chevronIcon from "../../app/icons/chevron.svg";
import FilterOption from "./FilterOption";

type FilterOptionType = {
    id: string;
    label: string;
};

type Props = {
    /** The main label text */
    label: string;
    /** Whether this filter is selected (shows checkmark) */
    isSelected?: boolean;
    /** Shows a right chevron for navigation */
    hasNavigation?: boolean;
    /** Makes the filter expandable with options */
    options?: FilterOptionType[];
    /** Currently selected option ID (for expandable filters), undefined means no filter applied */
    selectedOptionId?: string | undefined;
    /** Callback when the filter row is clicked */
    onClick?: () => void;
    /** Callback when an option is selected/deselected (undefined = deselected) */
    onOptionSelect?: (optionId: string | undefined) => void;
    /** Whether the filter is a title/header (centered, no interactions) */
    isTitle?: boolean;
    /** Whether a divider should be shown below */
    showDivider?: boolean;
};

const FilterRow = ({
    label,
    isSelected = false,
    hasNavigation = false,
    options,
    selectedOptionId,
    onClick,
    onOptionSelect,
    isTitle = false,
    showDivider = true,
}: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const isExpandable = options && options.length > 0;
    
    // For expandable filters, show checkmark if any option is selected
    const showCheckmark = isExpandable ? !!selectedOptionId : isSelected;

    const handleOptionClick = (optionId: string) => {
        // Toggle: if clicking the same option, deselect it (pass undefined)
        if (selectedOptionId === optionId) {
            onOptionSelect?.(undefined);
        } else {
            onOptionSelect?.(optionId);
        }
    };

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [options]);

    const handleClick = () => {
        if (isTitle) return;

        if (isExpandable) {
            setIsExpanded(!isExpanded);
        }
        onClick?.();
    };

    // Title variant - centered text, no interactions
    if (isTitle) {
        return (
            <div className="py-4">
                <span className="text-body text-beacon-of-hope block text-center">
                    {label}
                </span>
            </div>
        );
    }

    return (
        <div className={classNames(showDivider && "border-b border-find-the-path")}>
            <button
                type="button"
                onClick={handleClick}
                className="w-full flex items-center py-3 transition-all duration-200 hover:opacity-90 active:scale-[0.995] focus:outline-none"
            >
                {/* Checkmark indicator - fixed width container */}
                <div className="w-[24px] flex items-center justify-center shrink-0">
                    <Image
                        src={checkIcon}
                        alt=""
                        width={15}
                        height={13}
                        className={classNames(
                            "transition-all duration-200 ease-out",
                            showCheckmark
                                ? "opacity-100"
                                : "opacity-0"
                        )}
                    />
                </div>

                {/* Label */}
                <span className="text-body text-settings text-beacon-of-hope text-left flex-1 ml-6">
                    {label}
                </span>

                {/* Right side icon */}
                {(isExpandable || hasNavigation) && (
                    <div className="flex items-center shrink-0">
                        <Image
                            src={chevronIcon}
                            alt=""
                            width={13}
                            height={18}
                            className={classNames(
                                "transition-transform duration-300 ease-out",
                                isExpandable && isExpanded && "rotate-90"
                            )}
                        />
                    </div>
                )}
            </button>

            {/* Expandable options */}
            {isExpandable && (
                <div
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{
                        maxHeight: isExpanded ? `${contentHeight}px` : "0px",
                    }}
                >
                    <div ref={contentRef} className="pb-1">
                        {options.map((option, index) => (
                            <div
                                key={option.id}
                                className={classNames(
                                    "transition-all duration-300 ease-out",
                                    isExpanded
                                        ? "translate-y-0 opacity-100"
                                        : "-translate-y-2 opacity-0"
                                )}
                                style={{
                                    transitionDelay: isExpanded
                                        ? `${index * 50}ms`
                                        : "0ms",
                                }}
                            >
                                <FilterOption
                                    label={option.label}
                                    isSelected={selectedOptionId === option.id}
                                    onClick={() => handleOptionClick(option.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterRow;

