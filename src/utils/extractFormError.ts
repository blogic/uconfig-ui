import { FieldError, FieldErrors } from 'react-hook-form';

const getNestedValueFromStringPath = (path: string, obj: unknown) => {
  try {
    // @ts-expect-error: This is a helper function to extract a nested value from an object using a string path
    return path.split('.').reduce((o, p) => (o ? (o[p] as unknown) : undefined), obj);
  } catch (_) {
    return undefined;
  }
};
export const extractFormError = (name: string, errors: FieldErrors) =>
  getNestedValueFromStringPath(name, errors) as FieldError | undefined;
