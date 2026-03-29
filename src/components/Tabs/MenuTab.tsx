import { startTransition } from "react";
import { addTransitionType } from "react";
import ConditionIcon from "@/components/Atoms/ConditionIcon";
import { conditions, Condition } from "@/data/conditions";

type MenuTabProps = {
    selectedCondition: Condition | null;
    onConditionSelect: (condition: Condition | null) => void;
};

export default function MenuTab({ selectedCondition, onConditionSelect }: MenuTabProps) {
    const handleConditionClick = (condition: Condition) => {
        startTransition(() => {
            addTransitionType("nav-forward");
            onConditionSelect(condition);
        });
    };

    if (selectedCondition) {
        return <ConditionDetail condition={selectedCondition} />;
    }

    return <ConditionsList onConditionClick={handleConditionClick} />;
}

type ConditionsListProps = {
    onConditionClick: (condition: Condition) => void;
};

function ConditionsList({ onConditionClick }: ConditionsListProps) {
    return (
        <div className='w-full h-full flex flex-col px-4 pt-16 pb-24 overflow-y-auto'>
            {conditions.map((condition, index) => (
                <button
                    key={condition.id}
                    onClick={() => onConditionClick(condition)}
                    className='flex items-center gap-3 py-1 text-left hover:opacity-70 transition-opacity'
                >
                    <ConditionIcon iconName={condition.icon} size={24} />
                    <span className='text-white text-lg'>
                        {condition.name}
                        <sup className='text-white/50 text-xs ml-0.5'>({index + 1})</sup>
                    </span>
                </button>
            ))}
        </div>
    );
}

type ConditionDetailProps = {
    condition: Condition;
};

function ConditionDetail({ condition }: ConditionDetailProps) {
    const conditionIndex = conditions.findIndex(c => c.id === condition.id) + 1;

    return (
        <div className='w-full h-full flex flex-col px-4 pt-16 pb-24 overflow-y-auto'>
            <div className='flex items-center gap-3 mb-6'>
                <ConditionIcon iconName={condition.icon} size={28} />
                <span className='text-white text-2xl font-medium'>
                    {condition.name}
                    <sup className='text-white/50 text-sm ml-0.5'>({conditionIndex})</sup>
                </span>
            </div>

            <div className='flex flex-col gap-4'>
                {condition.effects.map((effect, index) => (
                    <div key={index} className='flex gap-4'>
                        <span className='text-white/50 text-base min-w-[24px]'>({index + 1})</span>
                        <p className='text-white text-base leading-relaxed'>{effect}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { ConditionsList, ConditionDetail };
