import * as React from 'react';
import { Transition } from '@headlessui/react';
import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { Heading } from 'components/Heading';

export type AccordionProps = {
  defaultIndex?: number;
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  entries: {
    title: string | React.ReactNode;
    content: React.ReactNode;
  }[];
};

export const Accordion = ({ defaultIndex = 0, entries, className }: AccordionProps) => {
  const [activeIndex, setActiveIndex] = React.useState(defaultIndex ?? 0);

  return (
    <div className={className}>
      {entries.map(({ title, content }, i) => {
        let position: 'first' | 'middle' | 'last' = 'middle';
        if (i === 0) position = 'first';
        else if (i === entries.length - 1) position = 'last';

        const isActive = activeIndex === i;

        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>
            <Heading size="md">
              <button
                type="button"
                className={clsx(
                  'flex w-full items-center justify-between gap-3  border-gray-200 p-2 font-medium  hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:border-gray-700  dark:hover:bg-gray-800 dark:focus:ring-gray-800',
                  position === 'first' && 'rounded-t-lg',
                  position !== 'last' && !isActive && 'border-b',
                )}
                onClick={() => (isActive ? setActiveIndex(-1) : setActiveIndex(i))}
              >
                {title}
                <CaretDown className={clsx('h-4 w-4 shrink-0', isActive && '-rotate-180 transition-transform')} />
              </button>
            </Heading>
            <Transition
              show={isActive}
              enter="transition-all duration-150"
              enterFrom="opacity-0 max-h-0"
              enterTo="opacity-100 max-h-auto"
              leave="transition-all duration-150"
              leaveFrom="opacity-100 max-h-auto"
              leaveTo="opacity-0 max-h-0"
            >
              <div
                className={clsx(
                  // 'border border-gray-200 p-4 dark:border-gray-700',
                  'pb-4 pt-1',
                  isActive && position === 'last' && 'rounded-b-lg',
                )}
              >
                {content}
              </div>
            </Transition>
          </div>
        );
      })}
    </div>
  );
};
