import React from 'react';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import clsx from 'clsx';
import { FieldErrors, Path, UseFormRegister } from 'react-hook-form';
import { extractFormError } from 'utils/extractFormError';

export type StringFieldProps<T extends Record<string, unknown>> = {
  register: UseFormRegister<T>;
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  formControlProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  name: Path<T>;
  label: string;
  isDisabled?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  canHide?: boolean;
  errors: FieldErrors<T>;
};

export const StringFormField = <T extends Record<string, unknown>>({
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
  canHide,
}: StringFieldProps<T>) => {
  const [isHidden, setIsHidden] = React.useState(true);
  const error = extractFormError(name, errors);
  return (
    <div {...formControlProps}>
      <label htmlFor={name} className="mb-1 block font-medium leading-6 text-gray-900 dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          id={name}
          name={name}
          type={isHidden && canHide ? 'password' : 'text'}
          placeholder={placeholder}
          required={isRequired}
          className={clsx(
            'block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:bg-gray-700 dark:text-white sm:text-sm sm:leading-6',
            error ? 'ring-2 ring-danger-600' : 'ring-gray-300',
            canHide ? 'pr-10' : 'pr-2',
          )}
          disabled={isDisabled}
          {...inputProps}
        />
        {canHide ? (
          <button
            type="button"
            className="absolute right-0 top-0 flex h-full items-center pr-3"
            onClick={() => setIsHidden((prev) => !prev)}
          >
            {isHidden ? (
              <Eye className="dark:text-white" size={24} />
            ) : (
              <EyeSlash className="dark:text-white" size={24} />
            )}
          </button>
        ) : null}
      </div>
      <p className={clsx('mt-1 text-sm text-danger-600', error !== undefined ? 'block' : '')}>
        {/* {errors[name]?.message as React.ReactNode} */}
        {error?.message as React.ReactNode}
      </p>
    </div>
  );
};
