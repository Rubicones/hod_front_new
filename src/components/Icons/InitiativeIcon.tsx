import initiativeIcon from "../../app/icons/initiativeIcon.svg";
import Image from "next/image";
import classNames from "classnames";

type InitiativeIconProps = {
    state?: string;
    size?: number;
};

export default function InitiativeIcon({ state, size = 35 }: InitiativeIconProps) {
    return <Image src={initiativeIcon} alt="initiative icon" width={size} height={size} className={classNames(state === 'active' ? '' : 'brightness-50', 'transition-all duration-200')}/>;
}

