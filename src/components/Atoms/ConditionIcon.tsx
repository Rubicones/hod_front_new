import Image from "next/image";

import BlindedIcon from "@/app/icons/A_BlindedIcon.svg";
import CharmedIcon from "@/app/icons/A_CharmedIcon.svg";
import DeafenedIcon from "@/app/icons/A_DeafenedIcon.svg";
import ExhaustionIcon from "@/app/icons/A_ExhaustionIcon.svg";
import FrightenedIcon from "@/app/icons/A_FrightenedIcon.svg";
import GrappledIcon from "@/app/icons/A_GrappledIcon.svg";
import IncapacitatedIcon from "@/app/icons/A_IncapacitatedIcon.svg";
import InvisibleIcon from "@/app/icons/A_InvisibleIcon.svg";
import ParalyzedIcon from "@/app/icons/A_ParalyzedIcon.svg";
import PetrifiedIcon from "@/app/icons/A_PetrifiedIcon.svg";
import PoisonedIcon from "@/app/icons/A_PoisonedIcon.svg";
import RestrainedIcon from "@/app/icons/A_RestrainedIcon.svg";
import StunnedIcon from "@/app/icons/A_StunnedIcon.svg";
import UnconsciousIcon from "@/app/icons/A_UnconsciousIcon.svg";

const iconMap: Record<string, string> = {
    A_BlindedIcon: BlindedIcon,
    A_CharmedIcon: CharmedIcon,
    A_DeafenedIcon: DeafenedIcon,
    A_ExhaustionIcon: ExhaustionIcon,
    A_FrightenedIcon: FrightenedIcon,
    A_GrappledIcon: GrappledIcon,
    A_IncapacitatedIcon: IncapacitatedIcon,
    A_InvisibleIcon: InvisibleIcon,
    A_ParalyzedIcon: ParalyzedIcon,
    A_PetrifiedIcon: PetrifiedIcon,
    A_PoisonedIcon: PoisonedIcon,
    A_RestrainedIcon: RestrainedIcon,
    A_StunnedIcon: StunnedIcon,
    A_UnconsciousIcon: UnconsciousIcon,
};

type Props = {
    iconName: string;
    size?: number;
    className?: string;
};

const ConditionIcon = ({ iconName, size = 24, className = "" }: Props) => {
    const iconSrc = iconMap[iconName];
    
    if (!iconSrc) {
        return null;
    }
    
    return (
        <Image
            src={iconSrc}
            alt=""
            width={size}
            height={size}
            className={className}
        />
    );
};

export default ConditionIcon;
