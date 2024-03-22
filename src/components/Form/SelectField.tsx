import React from 'react';
import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { FieldErrors, Path, UseFormRegister } from 'react-hook-form';
import { extractFormError } from 'utils/extractFormError';

export type SelectFormFieldOption = {
  value: string;
  label: string;
} | string;

export type SelectFormFieldProps<T extends Record<string, unknown>> = {
  register: UseFormRegister<T>;
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
  formControlProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  name: Path<T>;
  label: string;
  options: SelectFormFieldOption[];
  isDisabled?: boolean;
  isRequired?: boolean;
  errors: FieldErrors<T>;
};

export const SelectFormField = <T extends Record<string, unknown>>({
  // Form Props
  register,
  name,
  errors,
  options,
  // Style Props
  inputProps,
  formControlProps,
  // Component Props
  label,
  isDisabled,
  isRequired,
}: SelectFormFieldProps<T>) => {
  const error = extractFormError(name, errors);

  return (
    <div {...formControlProps}>
      <label htmlFor={name} className=" mb-1 block font-medium leading-6 text-gray-900 dark:text-white">
        {label}
      </label>
      <div className="relative max-w-max">
        <select
          {...register(name)}
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
          {options.map((option) => typeof option === 'string' ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-700 dark:text-white">
          <CaretDown size={14} weight="bold" />
        </div>
      </div>
      <p className={clsx('mt-1 text-sm text-danger-600', error !== undefined ? 'block' : '')}>
        {error?.message as React.ReactNode}
      </p>
    </div>
  );
};
