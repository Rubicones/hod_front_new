import { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import Tag from "../Atoms/Tag";
import AddBtn from "../Atoms/AddBtn";
import { useTranslations } from "next-intl";

type Effect = {
    id: string;
    name: string;
    withLevel?: boolean;
    level?: number;
};

type Props = {
    /** Title of the effects section */
    title?: string;
    /** Text to show when no effects are applied */
    emptyText?: string;
    /** List of all available effects */
    allEffects: Effect[];
    /** IDs of currently selected/active effects */
    selectedEffectIds: string[];
    /** Callback when an effect is toggled */
    onEffectToggle: (effectId: string) => void;
    /** Callback when the dropdown is closed */
    onClose?: () => void;
    /** If true, shows empty state without add button */
    showEmptyState?: boolean;
};

const EffectsList = ({
    title,
    emptyText,
    allEffects,
    selectedEffectIds,
    onEffectToggle,
    onClose,
    showEmptyState = false,
}: Props) => {
    const tEffects = useTranslations("effects");
    const resolvedTitle = title ?? tEffects("title");
    const resolvedEmptyText = emptyText ?? tEffects("empty");
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [showContent, setShowContent] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const selectedEffects = allEffects.filter((effect) =>
        selectedEffectIds.includes(effect.id)
    );

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [allEffects]);

    useEffect(() => {
        if (isExpanded) {
            // Delay showing content until height animation is partway through
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 150);
            return () => clearTimeout(timer);
        } else {
            // Hide content immediately when collapsing
            const timer = setTimeout(() => {
                setShowContent(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isExpanded]);

    const handleAddClick = () => {
        setIsExpanded(true);
    };

    const handleClose = () => {
        setIsExpanded(false);
        onClose?.();
    };

    const handleEffectClick = (effectId: string) => {
        onEffectToggle(effectId);
    };

    // Show empty state when explicitly set or no effects and no way to add
    if (showEmptyState) {
        return (
            <div className="w-full bg-dark-star rounded-2xl p-4">
                <h3 className="text-settings text-silvery-barbs mb-3">
                    {resolvedTitle}
                </h3>
                <p className="text-body text-beacon-of-hope">
                    {resolvedEmptyText}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-dark-star rounded-2xl p-4">
            {/* Title */}
            <h3 className="text-body text-silvery-barbs mb-3">
                {resolvedTitle}
            </h3>
            {/* Selected effects row with Add button */}
            <div className="flex flex-wrap items-center gap-2">
                {selectedEffects.map((effect) => (
                    <button
                        key={effect.id}
                        type="button"
                        onClick={() => handleEffectClick(effect.id)}
                        className="cursor-pointer"
                    >
                        <Tag
                            text={effect.name}
                            isActive={true}
                            withLevel={effect.withLevel}
                            level={effect.level}
                        />
                    </button>
                ))}

                {/* Add button - fades out when expanded */}
                <div
                    className={classNames(
                        "transition-all duration-300 ease-out",
                        isExpanded
                            ? "opacity-0 scale-75 pointer-events-none w-0 overflow-hidden"
                            : "opacity-100 scale-100"
                    )}
                >
                    <AddBtn onClick={handleAddClick} />
                </div>
            </div>

            {/* Expandable dropdown */}
            <div
                className={classNames(
                    "overflow-hidden transition-all duration-300 ease-out "
                )}
                style={{
                    maxHeight: isExpanded ? `${contentHeight + 60}px` : "0px",
                }}
            >
                <div ref={contentRef}>
                    {/* Available effects grid (excluding already selected) */}
                    <div
                        className={classNames(
                            "mt-3 border-y border-cone-of-cold flex flex-wrap gap-[6px] py-3 transition-opacity duration-200",
                            showContent ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {allEffects
                            .filter((effect) => !selectedEffectIds.includes(effect.id))
                            .map((effect, index) => (
                                <button
                                    key={effect.id}
                                    type="button"
                                    onClick={() => handleEffectClick(effect.id)}
                                    className={classNames(
                                        "transition-all duration-200",
                                        showContent
                                            ? "translate-y-0 opacity-100"
                                            : "translate-y-2 opacity-0"
                                    )}
                                    style={{
                                        transitionDelay: showContent
                                            ? `${index * 20}ms`
                                            : "0ms",
                                    }}
                                >
                                    <Tag
                                        text={effect.name}
                                        isActive={false}
                                        withLevel={effect.withLevel}
                                        level={effect.level}
                                    />
                                </button>
                            ))}
                    </div>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className={classNames(
                            "w-full text-center pt-4 text-body text-find-the-path cursor-pointer",
                            "transition-all duration-200",
                            showContent ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {tEffects("close")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EffectsList;

