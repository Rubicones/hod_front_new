type Props = {
    title?: string;
    value?: number;
};

const StarIcon = () => (
    <svg width="48" height="48" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C15 4.90137 15.9863 8.07226 17.957 10.043C19.9277 12.0137 23.0986 13 28 13V15C23.0986 15 19.9277 15.9863 17.957 17.957C15.9863 19.9277 15 23.0986 15 28H13C13 23.0986 12.0137 19.9277 10.043 17.957C8.07226 15.9863 4.90137 15 0 15V13C4.90137 13 8.07226 12.0137 10.043 10.043C12.0137 8.07226 13 4.90137 13 0H15Z" stroke="white" strokeWidth="2"/>
    </svg>
);

const StatCircle = ({ title, value }: Props) => {
    const isEmpty = value === undefined;
    
    const getFontSize = () => {
        if (isEmpty) return "";
        const digits = String(value).length;
        if (digits <= 2) return "text-[35vw] sm:text-[100px]";
        if (digits === 3) return "text-[34vw] sm:text-[80px]";
        return "text-[16vw] sm:text-[60px]";
    };

    const formatValue = () => {
        if (value === undefined) return "";
        if (value < 10) return String(value).padStart(2, '0');
        return String(value);
    };

    return (
        <div className="w-full aspect-square rounded-full bg-[#1C1C1C] flex flex-col items-center justify-center">
            {isEmpty ? (
                <StarIcon />
            ) : (
                <>
                    {title && (
                        <span className="text-white/60 text-xl">{title}</span>
                    )}
                    <span className={`text-white ${getFontSize()} font-light leading-none mt-1`}>
                        {formatValue()}
                    </span>
                </>
            )}
        </div>
    );
};

export default StatCircle;
