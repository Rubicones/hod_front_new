import Image from "next/image";
import chevronIcon from "../../app/icons/chevron.svg";
import { useTranslations } from "next-intl";

type Props = {
    title?: string;
    subtitle?: string;
    roundNumber?: number;
    showCancel?: boolean;
    showChevron?: boolean;
    showDone?: boolean;
    showShare?: boolean;
    showInitiativeIcon?: boolean;
    onCancelClick?: () => void;
    onChevronClick?: () => void;
    onDoneClick?: () => void;
    onShareClick?: () => void;
    doneDisabled?: boolean;
    doneLabel?: string;
};

const TopToolbar = ({
    title,
    subtitle,
    roundNumber,
    showCancel = false,
    showChevron = false,
    showDone = false,
    showShare = false,
    showInitiativeIcon = false,
    onCancelClick,
    onChevronClick,
    onDoneClick,
    onShareClick,
    doneDisabled = false,
    doneLabel,
}: Props) => {
    const tNav = useTranslations("nav");
    const effectiveDoneLabel = doneLabel ?? tNav("done");

    return (
        <div
            className='fixed top-0 left-0 right-0 z-50'
          
        >
            <div className='flex items-center justify-between w-full px-4 py-3 min-h-[56px]'>
                {/* Left Section */}
                <div className='flex items-center gap-2 min-w-[80px]'>
                    {showChevron && (
                        <button
                            onClick={onChevronClick}
                            className='p-2 -ml-2 transition-opacity hover:opacity-70'
                            aria-label={tNav("back")}
                        >
                            <Image
                                src={chevronIcon}
                                alt={tNav("back")}
                                width={12}
                                height={12}
                                className='rotate-180'
                            />
                        </button>
                    )}
                    {showCancel && (
                        <button
                            onClick={onCancelClick}
                            className='text-base text-gentle-repose transition-opacity hover:opacity-70 font-semibold'
                        >
                            {tNav("cancel")}
                        </button>
                    )}
                </div>

                {/* Center Section */}
                <div className='flex flex-col items-center justify-center flex-1 text-gentle-repose'>
                    {roundNumber !== undefined && (
                        <span className='text-sm text-silent-image'>
                            {tNav("round", { number: roundNumber })}
                        </span>
                    )}
                    {subtitle && !roundNumber && (
                        <span className='text-sm text-silent-image'>
                            {subtitle}
                        </span>
                    )}
                    {title && (
                        <span className='text-xl font-medium'>
                            {title}
                        </span>
                    )}
                    {showInitiativeIcon && (
                        <svg
                            width='24'
                            height='24'
                            viewBox='0 0 35 35'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                            className='mt-1'
                        >
                            <path
                                d='M26.2627 5C26.1867 6.902 25.8833 9.55279 25.0234 11.8457C23.9962 14.5847 22.3235 16.5 19.5713 16.5V18.5C21.0234 18.5 22.1183 18.9592 22.9746 19.6914C23.8498 20.4398 24.5234 21.5164 25.0283 22.8066C25.9075 25.0535 26.206 27.7711 26.2705 30H9.01562C9.08014 27.7711 9.37771 25.0535 10.2568 22.8066C10.7617 21.5163 11.4363 20.4398 12.3115 19.6914C13.1677 18.9594 14.2621 18.5001 15.7139 18.5V16.5C12.9619 16.4998 11.2899 14.5845 10.2627 11.8457C9.40285 9.55279 9.0994 6.902 9.02344 5H26.2627Z'
                                stroke='white'
                                strokeWidth='2'
                            />
                        </svg>
                    )}
                </div>

                {/* Right Section */}
                <div className='flex items-center justify-end min-w-[80px]'>
                    {showShare && (
                        <button
                            onClick={onShareClick}
                            className='text-base transition-opacity hover:opacity-70 text-gentle-repose font-semibold'
                        >
                            {tNav("share")}
                        </button>
                    )}
                    {showDone && (
                        <button
                            onClick={onDoneClick}
                            disabled={doneDisabled}
                            className={`px-3 py-1.5 text-base font-medium rounded-lg transition-all ${
                                doneDisabled
                                    ? "cursor-not-allowed text-gentle-repose"
                                    : "bg-gentle-repose text-background hover:opacity-90"
                            }`}
                        >
                            {effectiveDoneLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopToolbar;
