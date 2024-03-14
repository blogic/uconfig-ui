import React from 'react';
import clsx from 'clsx';
import { FieldErrors, Path, UseFormRegister } from 'react-hook-form';
import { extractFormError } from 'utils/extractFormError';

export type ToggleFieldProps<T extends Record<string, unknown>> = {
  register: UseFormRegister<T>;
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  formControlProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  name: Path<T>;
  label: string;
  isDisabled?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  errors: FieldErrors<T>;
};

export const ToggleFormField = <T extends Record<string, unknown>>({
  // Form Props
  register,
  name,
  errors,
  // Style Props
  inputProps,
  formControlProps,
  // Component Props
  label,
  isDisabled,
  placeholder,
  isRequired,
}: ToggleFieldProps<T>) => {
  const error = extractFormError(name, errors);
  return (
    <div {...formControlProps}>
      <label htmlFor={name} className="mb-1 block font-medium leading-6 text-gray-900 dark:text-white">
        {label}
      </label>
      <label htmlFor={name}>
        <input
          {...register(name)}
          id={name}
          name={name}
          type="checkbox"
          placeholder={placeholder}
          required={isRequired}
          className={clsx(
            'peer sr-only block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:bg-gray-700 dark:text-white sm:text-sm sm:leading-6',
            error ? 'ring-2 ring-danger-600' : 'ring-gray-300',
          )}
          disabled={isDisabled}
          {...inputProps}
        />
        <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-primary-800 rtl:peer-checked:after:-translate-x-full" />
      </label>
      <p className={clsx('mt-1 text-sm text-danger-600', error !== undefined ? 'block' : '')}>
        {/* {errors[name]?.message as React.ReactNode} */}
        {error?.message as React.ReactNode}
      </p>
    </div>
  );
};
