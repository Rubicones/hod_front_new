import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
};

const FilterList = ({ children, className = "" }: Props) => {
    return (
        <div className={`w-full ${className}`}>
            {children}
        </div>
    );
};

export default FilterList;

