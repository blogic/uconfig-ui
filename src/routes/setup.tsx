import React from 'react';
import { Check, Devices, HandWaving, WifiHigh } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import clsx from 'clsx';
import { SetupConfirmStep } from './-setup/ConfirmStep';
import { SetupDeviceStep } from './-setup/DeviceStep';
import { SetupLanStep } from './-setup/LanStep';
import { SetupWanStep } from './-setup/WanStep';
import { SetupWelcomeStep } from './-setup/WelcomeStep';
import { SetupWifiStep } from './-setup/WifiStep';
import { ThemeSelector } from 'components/ThemeSelector';

const STEPS = ['welcome', 'deviceDetails', 'wan', 'lan', 'wifi', 'confirm'] as const;

type Step = (typeof STEPS)[number];

const STEP_TO_ICON = {
  welcome: <HandWaving className="h-6 w-6" />,
  deviceDetails: <Devices className="h-6 w-6" />,
  wan: 'WAN',
  lan: 'LAN',
  wifi: <WifiHigh className="h-6 w-6" />,
  confirm: <Check className="h-6 w-6" />,
} as const;

const stepToForm = (
  step: Step,
  updateData: (data: Record<string, unknown>) => void,
  state: Record<string, unknown>,
) => {
  switch (step) {
    case 'welcome':
      return <SetupWelcomeStep submitForm={updateData} />;
    case 'deviceDetails':
      return <SetupDeviceStep submitForm={updateData} />;
    case 'wan':
      return <SetupWanStep submitForm={updateData} />;
    case 'lan':
      return <SetupLanStep submitForm={updateData} />;
    case 'wifi':
      return <SetupWifiStep submitForm={updateData} />;
    case 'confirm':
      return <SetupConfirmStep submitForm={updateData} state={state} />;
    default:
      return null;
  }
};

const Component = () => {
  const [step, setStep] = React.useState<Step>('welcome');
  const [cumulativeData, setCumulativeData] = React.useState<Record<string, unknown>>({});

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-20 w-auto" src="/OpenWrt_Logo.png" alt="OpenWrt" />
        </div>
        <div className="mt-10 sm:mx-auto sm:max-w-lg">
          <ol className="flex w-full items-center justify-center space-x-4 sm:space-x-8">
            {STEPS.map((s) => (
              <li
                key={s}
                className={clsx(
                  'flex items-center space-x-2.5 text-gray-500 dark:text-gray-400 rtl:space-x-reverse',
                  s === step && 'text-primary-600 dark:text-primary-500',
                )}
              >
                <span
                  className={clsx(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400',
                    s === step && 'bg-primary-600 text-white dark:bg-primary-500',
                  )}
                >
                  {STEP_TO_ICON[s]}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex h-96 w-full justify-center">
            {stepToForm(
              step,
              (data) => {
                setCumulativeData((prev) => ({ ...prev, ...data }));
                setStep(STEPS[STEPS.indexOf(step) + 1] || step);
              },
              cumulativeData,
            )}
          </div>
        </div>
      </div>
      <div className="absolute right-4 top-4">
        <ThemeSelector />
      </div>
    </>
  );
};

export const Route = createFileRoute('/setup')({
  component: Component,
});
