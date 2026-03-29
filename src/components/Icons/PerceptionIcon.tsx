import perceptionIcon from "../../app/icons/perceptionIcon.svg";
import Image from "next/image";
import classNames from "classnames";
type PerceptionIconProps = {
    state?: string;
    size?: number;
};

export default function PerceptionIcon({ state, size = 35 }: PerceptionIconProps) {
    return <Image src={perceptionIcon} alt="perception icon" width={size} height={size} className={classNames(state === 'active' ? '' : 'brightness-50', 'transition-all duration-200')}/>;
}

