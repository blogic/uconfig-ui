import { HTMLAttributes } from 'react';

export type PinPadKeyProps = {
    onClick: (value: number) => void;
    value: number;
    className?: HTMLAttributes<HTMLDivElement>['className'];
};

export const PinPadKey = ({ onClick, value }: PinPadKeyProps) => (
    <button onClick={() => onClick(value)} className='w-20 h-20 rounded-full inline-flex items-center justify-center bg-primary-500 dark:bg-primary-300 text-gray-700 text-xl font-bold'>
        {value}
    </button>
);