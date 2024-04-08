import clsx from 'clsx';
import { FieldErrors, Path } from 'react-hook-form';
import { extractFormError } from 'utils/extractFormError';

const CLASS = {
  isValue:
    'bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600 disabled:bg-primary-400 text-white dark:bg-primary-500 dark:hover:bg-primary-400 dark:focus-visible:outline-primary-500 dark:disabled:bg-primary-300 dark:text-white',
  isNotValue:
    'bg-gray-200 hover:bg-gray-300 focus-visible:outline-gray-200 disabled:bg-gray-100  text-gray-500 disabled:text-gray-300 ',
} as const;

type Value = string | number;

export type ButtonSelectFieldOption = {
  value: Value;
  label: string;
};

export type ButtonSelectFieldProps<T extends Record<string, unknown>> = {
  value: Value;
  onChange: (value: Value) => void;
  buttonProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
  formControlProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  name: Path<T>;
  label: string;
  options: ButtonSelectFieldOption[];
  isDisabled?: boolean;
  errors: FieldErrors<T>;
};

export const ButtonSelectField = <T extends Record<string, unknown>>({
  // Form Props
  value,
  onChange,
  name,
  errors,
  options,
  // Style Props
  buttonProps,
  formControlProps,
  // Component Props
  label,
  isDisabled,
}: ButtonSelectFieldProps<T>) => {
  const error = extractFormError(name, errors);

  return (
    <div {...formControlProps}>
      <label htmlFor={name} className=" mb-1 block font-medium leading-6 text-gray-900 dark:text-white">
        {label}
      </label>
      <div className="flex max-w-max">
        {options.map((option, i) => {
          const isFirst = i === 0;
          const isLast = i === options.length - 1;
          return (
            <button
              {...buttonProps}
              key={option.value}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(option.value)}
              className={clsx(
                'flex w-full items-center justify-center rounded-md  border-gray-500 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2 disabled:cursor-not-allowed',
                isFirst && ' border-r-1 rounded-l-md rounded-r-none',
                isLast && ' border-l-1 rounded-l-none rounded-r-md',
                !isFirst && !isLast && ' border-x-1 rounded-none',
                value === option.value ? CLASS.isValue : CLASS.isNotValue,
                buttonProps?.className,
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className={clsx('mt-1 text-sm text-danger-600', error !== undefined ? 'block' : '')}>
        {error?.message as React.ReactNode}
      </p>
    </div>
  );
};
