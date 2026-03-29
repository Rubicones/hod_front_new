import investigationIcon from "../../app/icons/investigationIcon.svg";
import Image from "next/image";
import classNames from "classnames";
type InvestigationIconProps = {
    state?: string;
    size?: number;
};

export default function InvestigationIcon({
    state,
    size = 35,
}: InvestigationIconProps) {
    return (
        <Image
            src={investigationIcon}
            alt='investigation icon'
            width={size}
            height={size}
            className={classNames(state === "active" ? "" : "brightness-50", 'transition-all duration-200')}
        />
    );
}
