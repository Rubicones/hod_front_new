import classNames from "classnames";

import Toggle from "../Atoms/Toggle";

type Props = {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
};

const Input = ({
   checked,
   label,
   onChange = () => {},
}: Props) => {
 

    return (
        <div
            className={classNames(
                "relative w-full h-[55px] text-genele-repose overflow-hidden flex items-center py-[10px] rounded-[25px] transition-all ease-linear duration-300 justify-end bg-dark-star max-w-full px-[10px]"
            )}
        >
            <div className='flex items-center mx-3 flex-1'>
                <p className='text-body font-medium capitalize'>{label}</p>
            </div>

             <Toggle checked={checked} onChange={onChange} />
        </div>
    );
};

export default Input;
