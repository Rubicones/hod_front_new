import armorIcon from "../../app/icons/armorIcon.svg";
import Image from "next/image";
import classNames from "classnames";

type ArmorIconProps = {
    state?: string;
    size?: number;
};

export default function ArmorIcon({ state, size = 35 }: ArmorIconProps) {
    return <Image src={armorIcon} alt="armor icon" width={size} height={size} className={classNames(state === 'active' ? '' : 'brightness-50', 'transition-all duration-200')}/>;
}

