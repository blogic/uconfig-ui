import React from 'react';
import clsx from 'clsx';
import { FieldErrors, Path, UseFormRegister } from 'react-hook-form';
import { extractFormError } from 'utils/extractFormError';

export type SliderFieldProps<T extends Record<string, unknown>> = {
  register: UseFormRegister<T>;
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  formControlProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  name: Path<T>;
  label: string;
  isDisabled?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  errors: FieldErrors<T>;
  min: number;
  max: number;
  step?: number;
  startLabel?: string;
  oneThirdLabel?: string;
  middleLabel?: string;
  twoThirdLabel?: string;
  endLabel?: string;
};

export const SliderField = <T extends Record<string, unknown>>({
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
  // Slider Props
  min,
  max,
  step = 1,
  startLabel,
  oneThirdLabel,
  middleLabel,
  twoThirdLabel,
  endLabel,
}: SliderFieldProps<T>) => {
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
          type="range"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          required={isRequired}
          className={clsx(
            'h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700',
            error ? 'ring-2 ring-danger-600' : 'ring-gray-300',
          )}
          disabled={isDisabled}
          {...inputProps}
        />
        <span className="absolute -bottom-6 start-0 text-sm text-gray-500 dark:text-gray-400">{startLabel}</span>
        <span className="absolute -bottom-6 start-1/3 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 rtl:translate-x-1/2">
          {oneThirdLabel}
        </span>
        <span className="absolute -bottom-6 start-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 rtl:translate-x-1/2">
          {middleLabel}
        </span>
        <span className="absolute -bottom-6 start-2/3 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 rtl:translate-x-1/2">
          {twoThirdLabel}
        </span>
        <span className="absolute -bottom-6 end-0 text-sm text-gray-500 dark:text-gray-400">{endLabel}</span>
      </div>
      <p className={clsx('mt-5 text-sm text-danger-600', error !== undefined ? 'block' : '')}>
        {/* {errors[name]?.message as React.ReactNode} */}
        {error?.message as React.ReactNode}
      </p>
    </div>
  );
};
