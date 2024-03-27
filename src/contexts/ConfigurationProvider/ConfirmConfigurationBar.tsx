import { useConfiguration } from './useConfiguration';

export const ConfirmConfigurationChangeBar = () => {
  const { changes } = useConfiguration();
  const isDirty = changes.length > 0;

  if (!isDirty) return null;

  return (
    <div className="bg-red-500 p-4 text-center text-white">
      <p>You have unsaved changes</p>
    </div>
  );
};
