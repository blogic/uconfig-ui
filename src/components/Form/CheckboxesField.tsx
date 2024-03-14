import React from 'react';
import clsx from 'clsx';
import { FieldErrors, Path } from 'react-hook-form';
import { extractFormError } from 'utils/extractFormError';

type CheckboxesOptions = {
  value: string;
  label: string;
  explanation?: string;
};

export type CheckboxesFormFieldProps<T extends Record<string, unknown>> = {
  value: (string | number)[];
  setValue: (value: (string | number)[]) => void;
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  formControlProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  name: Path<T>;
  label: string;
  options: CheckboxesOptions[];
  isDisabled?: boolean;
  errors: FieldErrors<T>;
};

export const CheckboxesFormField = <T extends Record<string, unknown>>({
  // Form Props
  value,
  setValue,
  name,
  errors,
  options,
  // Style Props
  inputProps,
  formControlProps,
  // Component Props
  label,
  isDisabled,
}: CheckboxesFormFieldProps<T>) => {
  const error = extractFormError(name, errors);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setValue([...value, e.target.value]);
    } else {
      setValue(value.filter((v) => v !== e.target.value));
    }
  };
  return (
    <div {...formControlProps}>
      <label htmlFor={name} className=" mb-1 block font-medium leading-6 text-gray-900 dark:text-white">
        {label}
      </label>
      <div className="relative" {...inputProps}>
        {options.map((option) => {
          const checkboxId = `${name}-${option.value}-${option.label}`;
          return (
            <div key={option.label} className="flex">
              <div className="flex h-5 items-center">
                <input
                  id={checkboxId}
                  aria-describedby="helper-checkbox-text"
                  type="checkbox"
                  value={option.value}
                  checked={value.includes(option.value)}
                  onChange={onChange}
                  disabled={isDisabled}
                  className="text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                />
              </div>
              <div className="ms-2 text-sm">
                <label htmlFor={checkboxId} className="font-medium text-gray-900 dark:text-gray-300">
                  {option.label}
                </label>
                <p id={`${checkboxId}-helper`} className="text-xs font-normal text-gray-500 dark:text-gray-300">
                  {option.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <p className={clsx('mt-1 text-sm text-danger-600', error !== undefined ? 'block' : '')}>
        {error?.message as React.ReactNode}
      </p>
    </div>
  );
};
