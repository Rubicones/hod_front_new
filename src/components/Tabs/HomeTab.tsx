import Button from "@/components/Atoms/Button";
import { useTranslations } from "next-intl";

const StarIcon = () => (
    <svg
        width='40'
        height='40'
        viewBox='0 0 28 28'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M15 0C15 4.90137 15.9863 8.07226 17.957 10.043C19.9277 12.0137 23.0986 13 28 13V15C23.0986 15 19.9277 15.9863 17.957 17.957C15.9863 19.9277 15 23.0986 15 28H13C13 23.0986 12.0137 19.9277 10.043 17.957C8.07226 15.9863 4.90137 15 0 15V13C4.90137 13 8.07226 12.0137 10.043 10.043C12.0137 8.07226 13 4.90137 13 0H15Z'
            stroke='white'
            strokeWidth='2'
        />
    </svg>
);

type HomeTabProps = {
    userName: string;
    onCreateGame: () => void;
    onJoinGame: () => void;
    onRejoinLastSession: () => void;
    lastGameId: string | null;
    isCreatingGame?: boolean;
};

export default function HomeTab({ userName, onCreateGame, onJoinGame, onRejoinLastSession, lastGameId, isCreatingGame = false }: HomeTabProps) {
    const t = useTranslations("home");

    return (
        <div className='w-full h-full flex flex-col items-center justify-center px-4'>
            <StarIcon />
            <h1 className='text-2xl font-medium text-white text-center mt-6'>
                {t("hello", { name: userName })}
            </h1>
            <p className='text-2xl font-medium text-white text-center'>
                {t("subtitle")}
            </p>

            <div className='w-full flex flex-col gap-3 mt-10'>
                <Button
                    text={isCreatingGame ? t("creatingGame") : t("create")}
                    variant='primary'
                    onClick={onCreateGame}
                    isDisabled={isCreatingGame}
                    className='w-full'
                />
                <Button
                    text={t("join")}
                    variant='secondary'
                    onClick={onJoinGame}
                    isDisabled={isCreatingGame}
                    className='w-full'
                />
                {lastGameId && (
                    <button
                        onClick={onRejoinLastSession}
                        className="text-gentle-repose text-tag mt-2 underline decoration-gentle-repose/60 hover:decoration-gentle-repose transition-colors"
                    >
                        {t("rejoin")}
                    </button>
                )}
            </div>
        </div>
    );
}
