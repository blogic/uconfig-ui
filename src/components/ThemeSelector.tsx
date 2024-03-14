import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Desktop, Moon, Sun } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';
import { usePreferences } from 'contexts/PreferencesContext/usePreferences';

const activeIcon = (activeIconClassNames?: string) =>
  ({
    light: <Sun size={24} className={`dark:text-white ${activeIconClassNames}`} />,
    dark: <Moon size={24} className={`dark:text-white ${activeIconClassNames}`} />,
    system: <Desktop size={24} className={`dark:text-white ${activeIconClassNames}`} />,
  }) as const;

export type ThemeSelectorProps = {
  activeIconClassNames?: string;
};
export const ThemeSelector = ({ activeIconClassNames }: ThemeSelectorProps) => {
  const { t } = useTranslation();
  const { appTheme, setAppTheme } = usePreferences();

  return (
    <Menu as="div" className="relative">
      <Tooltip label={t('theme')} placement="bottom">
        <Menu.Button className="relative h-10 w-10 rounded-md px-2 py-2 text-sm font-medium hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 dark:hover:bg-black/30">
          {activeIcon(activeIconClassNames)[appTheme]}
        </Menu.Button>
      </Tooltip>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-700">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={clsx('group flex w-full items-center rounded-md px-2 py-2 text-sm dark:text-white', {
                    'bg-gray-400': active,
                    'font-extrabold': appTheme === 'light',
                  })}
                  onClick={() => setAppTheme('light')}
                >
                  <Sun size={24} className="mr-2" />
                  {t('light')}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={clsx('group flex w-full items-center rounded-md px-2 py-2 text-sm dark:text-white', {
                    'bg-gray-400': active,
                    'font-extrabold': appTheme === 'dark',
                  })}
                  onClick={() => setAppTheme('dark')}
                >
                  <Moon size={24} className="mr-2" />
                  {t('dark')}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={clsx('group flex w-full items-center rounded-md px-2 py-2 text-sm dark:text-white', {
                    'bg-gray-400': active,
                    'font-extrabold': appTheme === 'system',
                  })}
                  onClick={() => setAppTheme('system')}
                >
                  <Desktop size={24} className="mr-2" />
                  {t('system')}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
