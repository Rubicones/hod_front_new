import classNames from "classnames";
import InsightIcon from "../Icons/InsightIcon";
import PerceptionIcon from "../Icons/PerceptionIcon";
import InvestigationIcon from "../Icons/InvestigationIcon";
import { useEffect, useState } from "react";
type Props = {
    isExpanded: boolean;
    name: 'insight' | 'investigation' | 'perception';
    level: number;
};

const ExpandableSkill = ({ isExpanded, name, level }: Props) => {
    const [showContent, setShowContent] = useState(false);
    useEffect(() => {
        if (isExpanded) {
            setTimeout(() => {
                setShowContent(true);
            }, 300);
        }
        else {
            requestAnimationFrame(() => {
                setShowContent(false);
            });
        }
    }, [isExpanded]);
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
                "relative overflow-hidden flex items-center py-[10px] rounded-[25px] transition-all ease-linear duration-300 justify-end",
                isExpanded ? "bg-gentle-repose max-w-full px-[10px]" : "bg-dark-star max-w-[76px] px-[10px]"
            )}
        >
            {/* Icon on the left - only show when expanded */}
            {showContent && (
                <div className="flex items-center shrink-0 invert">
                    {getIcon(55)}
                </div>
            )}

            {/* Text content in the middle - only show when expanded */}
            {showContent && (
                <div className="flex items-center mx-3 flex-1">
                    <p className="text-body font-medium text-cloudkill">
                        {displayName}
                    </p>
                </div>
            )}

            {/* Level number on the right */}
            <div className="w-15 flex justify-center items-center">
                <span className={classNames(
                    "text-stats-profile font-medium transition-colors duration-300",
                    isExpanded ? "text-cloudkill" : "text-gentle-repose"
                )}>
                    {level}
                </span>
            </div>
        </div>
    );
};

export default ExpandableSkill;
