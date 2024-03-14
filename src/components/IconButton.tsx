import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { Tooltip, TooltipProps } from './Tooltip';

export type IconButtonProps = {
  label: string;
  onClick: () => void;
  tooltipPlacement: TooltipProps['placement'];
  icon: React.ReactNode;
  className?: HTMLAttributes<HTMLButtonElement>['className'];
  tooltipClassName?: HTMLAttributes<HTMLDivElement>['className'];
};

export const IconButton = ({
  label,
  onClick,
  tooltipPlacement,
  icon,
  className,
  tooltipClassName,
}: IconButtonProps) => (
  <Tooltip label={label} placement={tooltipPlacement} className={tooltipClassName}>
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={clsx(
        'h-10 w-10 rounded-md px-2 py-2 text-sm font-medium hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 dark:hover:bg-black/30',
        className,
      )}
    >
      {icon}
    </button>
  </Tooltip>
);
