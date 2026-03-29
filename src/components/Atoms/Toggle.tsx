type Props = {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
};

const Toggle = ({ checked, onChange, disabled = false }: Props) => {
    const handleClick = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    return (
        <div
            className='relative inline-block w-[76px] h-[36px] cursor-pointer'
            onClick={handleClick}
        >
            <input
                checked={checked}
                onChange={(e) => !disabled && onChange?.(e.target.checked)}
                id='toggle'
                type='checkbox'
                className='peer appearance-none w-[76px] h-[36px] bg-teleport rounded-[30px] checked:bg-acid-arrow  transition-colors duration-300'
            />
            <label
                htmlFor={"toggle"}
                className='pointer-events-none absolute top-[2px] left-[2px] size-[32px] bg-gentle-repose rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-[40px] peer-checked:bg-cloudkill cursor-pointer'
            ></label>
        </div>
    );
};

export default Toggle;
