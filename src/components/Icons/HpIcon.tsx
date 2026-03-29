import hpIcon from "../../app/icons/hpIcon.svg";
import Image from "next/image";
import classNames from "classnames";

type HpIconProps = {
    state?: string;
    size?: number;
};

export default function HpIcon({ state, size = 35 }: HpIconProps) {
    return <Image src={hpIcon} alt="hp icon" width={size} height={size} className={classNames(state === 'active' ? '' : 'brightness-50', 'transition-all duration-200')}/>;
}

