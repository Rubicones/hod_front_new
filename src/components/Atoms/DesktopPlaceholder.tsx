import Image from "next/image";
import StarIcon from "@/app/icons/A_Star.svg";
import { useTranslations } from "next-intl";

export default function DesktopPlaceholder() {
    const t = useTranslations("desktop");

    return (
        <div className='hidden min-[501px]:flex fixed inset-0 z-50 bg-time-stop flex-col items-center justify-center text-gentle-repose'>
            <Image src={StarIcon} alt="" width={80} height={80} />
            <h1 className='text-3xl font-medium mt-8 text-center px-8'>
                {t("title")}
            </h1>
            <p className='text-lg mt-3 text-center px-8 opacity-60'>
                {t("subtitle")}
            </p>
        </div>
    );
}
