import Image from "next/image";
import classNames from "classnames";

// Import all stat icons
import insightIcon from "../../app/icons/insightIcon.svg";
import investigationIcon from "../../app/icons/investigationIcon.svg";
import perceptionIcon from "../../app/icons/perceptionIcon.svg";
import armorIcon from "../../app/icons/armorIcon.svg";
import hpIcon from "../../app/icons/hpIcon.svg";
import initiativeIcon from "../../app/icons/initiativeIcon.svg";

export type StatType = "insight" | "investigation" | "perception" | "armor" | "hp" | "initiative";

type Props = {
    /** The type of stat to display */
    type: StatType;
    /** The value to display */
    value: number;
    /** Size of the icon in pixels */
    size?: number;
    /** Additional class name */
    className?: string;
};

const iconMap = {
    insight: insightIcon,
    investigation: investigationIcon,
    perception: perceptionIcon,
    armor: armorIcon,
    hp: hpIcon,
    initiative: initiativeIcon,
};

const StatsSmall = ({ type, value, size = 28, className }: Props) => {
    const icon = iconMap[type];

    return (
        <div
            className={classNames(
                "flex items-center gap-[6px]",
                className
            )}
        >
            <Image
                src={icon}
                alt={`${type} icon`}
                width={size}
            />
            <span className="text-body font-medium text-gentle-repose">
                {value}
            </span>
        </div>
    );
};

export default StatsSmall;

