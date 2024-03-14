import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type TooltipProps = {
  label: string;
  placement?: 'top' | 'bottom';
  className?: HTMLAttributes<HTMLDivElement>['className'];
};

const placementStyles = {
  top: '-top-5 -translate-y-1/4',
  bottom: '-bottom-5 translate-y-1/4',
};

const arrowBasedOnPlacement = {
  top: 'bottom-[-6px]',
  bottom: 'top-[-6px] rotate-180',
};

export const Tooltip = ({ children, label, placement = 'top', className }: React.PropsWithChildren<TooltipProps>) => (
  <div className={className}>
    <div className="group relative">
      {children}
      <div
        className={clsx(
          'absolute left-1/2 z-50 mx-auto  -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-1 text-sm text-gray-100 opacity-0 transition-opacity group-hover:opacity-100',
          placementStyles[placement],
        )}
      >
        <span>{label}</span>
        <svg
          className={clsx('absolute left-1/2 z-10 -translate-x-1/2', arrowBasedOnPlacement[placement])}
          width="16"
          height="6"
          viewBox="0 0 16 10"
          fill="none"
        >
          <path d="M8 10L0 0L16 1.41326e-06L8 10Z" fill="rgb(31 41 55)" />
        </svg>
      </div>
    </div>
  </div>
);
