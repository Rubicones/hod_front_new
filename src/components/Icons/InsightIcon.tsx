import insightIcon from "../../app/icons/insightIcon.svg";
import Image from "next/image";
import classNames from "classnames";    
type InsightIconProps = {
    state?: string;
    size?: number;
};

export default function InsightIcon({ state, size = 35 }: InsightIconProps) {
    return <Image src={insightIcon} alt="insight icon" width={size} height={size} className={classNames(state === 'active' ? '' : 'brightness-50', 'transition-all duration-200')}/>;
}
