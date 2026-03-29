import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import InsightIcon from "../Icons/InsightIcon";
import PerceptionIcon from "../Icons/PerceptionIcon";
import InvestigationIcon from "../Icons/InvestigationIcon";

type SkillData = {
    name: 'insight' | 'investigation' | 'perception';
    level: number;
};

type Props = {
    skills: [SkillData, SkillData, SkillData];
    className?: string;
};

type GridExpandableSkillProps = {
    isExpanded: boolean;
    name: 'insight' | 'investigation' | 'perception';
    level: number;
};

const GridExpandableSkill = ({ isExpanded, name, level }: GridExpandableSkillProps) => {
    const [showContent, setShowContent] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFadingIn, setIsFadingIn] = useState(false);
    const prevExpandedRef = useRef(isExpanded);

    useEffect(() => {
        const wasExpanded = prevExpandedRef.current;
        prevExpandedRef.current = isExpanded;

        if (isExpanded && !wasExpanded) {
            // Expanding: Show content after grid animation ends (500ms), then fade in
            const timer = setTimeout(() => {
                setShowContent(true);
                setIsFadingOut(false);
                // Start fade-in animation
                requestAnimationFrame(() => {
                    setIsFadingIn(true);
                });
            }, 200);
            return () => clearTimeout(timer);
        } else if (!isExpanded && wasExpanded) {
            // Collapsing: Start fade out, then hide content after 100ms
            if (showContent) {
                requestAnimationFrame(() => {
                    setIsFadingIn(false);
                    setIsFadingOut(true);
                });
                const timer = setTimeout(() => {
                    setShowContent(false);
                    setIsFadingOut(false);
                }, 100);
                return () => clearTimeout(timer);
            }
        } else if (!isExpanded) {
            // Already collapsed, ensure content is hidden
            requestAnimationFrame(() => {
                setShowContent(false);
                setIsFadingOut(false);
                setIsFadingIn(false);
            });
        }
    }, [isExpanded, showContent]);

    // Get the appropriate icon based on skill name
    const getIcon = (size?: number) => {
        const nameLower = name.toLowerCase();
        if (nameLower === "insight")
            return <InsightIcon state="active" size={size} />;
        if (nameLower === "investigation")
            return <InvestigationIcon state="active" size={size} />;
        if (nameLower === "perception")
            return <PerceptionIcon state="active" size={size} />;
        return null;
    };

    // Capitalize the name for display
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);

    return (
        <div
            className={classNames(
                "relative overflow-hidden flex items-center rounded-[25px] justify-end h-full w-full transition-colors duration-200",
                isExpanded ? "bg-gentle-repose px-[10px]" : "bg-dark-star pl-[10px]"
            )}
            style={{ minWidth: 0 }}
        >
            {/* Icon on the left - only show when expanded and content should be visible */}
            {(showContent || isFadingOut) && (
                <div className={classNames(
                    "flex items-center shrink-0 invert transition-opacity duration-200",
                    isFadingOut ? "opacity-0" : isFadingIn ? "opacity-100" : "opacity-0"
                )}>
                    {getIcon(50)}
                </div>
            )}

            {/* Text content in the middle - only show when expanded and content should be visible */}
            {(showContent || isFadingOut) && (
                <div className={classNames(
                    "flex items-center mx-3 flex-1 min-w-0 transition-opacity duration-200",
                    isFadingOut ? "opacity-0" : isFadingIn ? "opacity-100" : "opacity-0"
                )}>
                    <p className="text-[14px] font-medium text-cloudkill truncate">
                        {displayName}
                    </p>
                </div>
            )}

            {/* Level number on the right */}
            <div className="w-15 flex justify-end items-center shrink-0">
                <span className={classNames(
                    "text-[38px] font-medium transition-colors duration-200 px-2",
                    isExpanded ? "text-cloudkill" : "text-gentle-repose"
                )}>
                    {level}
                </span>
            </div>
        </div>
    );
};

const ExpandableSkillsGrid = ({ skills, className }: Props) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleSkillClick = (index: number) => {
        // Toggle: if clicking the same skill, collapse it; otherwise expand the clicked one
        setSelectedIndex(index);
    };

    useEffect(() => {
        if (selectedIndex === null) {
            setSelectedIndex(0);
        }
    }, []);

    return (
        <div className={classNames("expandable-skills-grid", className)}>
            {skills.map((skill, index) => {
                const position = index === 0 ? 'left' : index === 1 ? 'center' : 'right';
                const isExpanded = selectedIndex === index;
                
                return (
                    <div
                        key={index}
                        data-selected={isExpanded ? position : undefined}
                        onClick={() => handleSkillClick(index)}
                        className="expandable-skill-item"
                    >
                        <GridExpandableSkill
                            isExpanded={isExpanded}
                            name={skill.name}
                            level={skill.level}
                        />
                    </div>
                );
            })}

            
        </div>
    );
};

export default ExpandableSkillsGrid;

