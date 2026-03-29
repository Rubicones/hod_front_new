import { ReactNode } from "react";
import classNames from "classnames";

type Props = {
    /** Stats components to display in a row */
    children: ReactNode;
    /** Additional class name */
    className?: string;
};

const StatsRow = ({ children, className }: Props) => {
    return (
        <div
            className={classNames(
                "w-full flex items-center justify-between",
                className
            )}
        >
            {children}
        </div>
    );
};

export default StatsRow;

