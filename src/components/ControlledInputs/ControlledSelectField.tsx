import React from 'react';
import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { Path } from 'react-hook-form';

export type ControlledSelectFormFieldOption = {
  value: string;
  label: string;
};

export type ControlledSelectFormFieldProps<T extends Record<string, unknown>> = {
  value: string;
  onChange: (v: string) => void;
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
  formControlProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  name: Path<T>;
  label: string;
  options: ControlledSelectFormFieldOption[];
  isDisabled?: boolean;
  isRequired?: boolean;
  error?: string;
};

export const ControlledSelectFormField = <T extends Record<string, unknown>>({
  // Form Props
  value,
  onChange,
  name,
  error,
  options,
  // Style Props
  inputProps,
  formControlProps,
  // Component Props
  label,
  isDisabled,
  isRequired,
}: ControlledSelectFormFieldProps<T>) => (
  <div {...formControlProps}>
    <label htmlFor={name} className=" mb-1 block text-sm font-medium leading-6 text-gray-900 dark:text-white">
      {label}
    </label>
    <div className="relative max-w-max">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={name}
        name={name}
        required={isRequired}
        className={clsx(
          'block rounded-md border py-1 pe-7 ps-2.5 text-gray-900 shadow-sm  focus:ring-1 focus:ring-inset focus:ring-primary-600 dark:bg-gray-700 dark:text-white sm:text-sm sm:leading-6',
          error ? 'ring-2 ring-danger-600' : 'ring-gray-300',
        )}
        style={{
          WebkitAppearance: 'none',
        }}
        disabled={isDisabled}
        {...inputProps}
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-700 dark:text-white">
        <CaretDown size={14} weight="bold" />
      </div>
    </div>
    <p className={clsx('mt-1 text-sm text-danger-600', error !== undefined ? 'block' : '')}>{error}</p>
  </div>
);
