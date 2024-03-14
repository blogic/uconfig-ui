import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';

const LANGUAGE_LIST = [
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
];
export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <Listbox value={i18n.language} onChange={(v) => i18n.changeLanguage(v.toLowerCase())}>
      {({ open }) => (
        <div className="relative">
          <Tooltip label={i18n.t('common:language')} placement="bottom">
            <Listbox.Button className="relative flex h-10  w-10 cursor-pointer items-center justify-center rounded-md  bg-transparent   px-2 py-2   text-gray-900 hover:bg-black/10 focus:outline-none  dark:text-white dark:hover:bg-black/30 sm:text-sm sm:leading-6">
              <span className="block text-lg">{i18n.language.toUpperCase()}</span>
            </Listbox.Button>
          </Tooltip>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-24 overflow-auto  rounded-md bg-white py-1 text-base  ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 sm:text-sm">
              {LANGUAGE_LIST.map(({ label, value }) => (
                <Listbox.Option
                  key={value}
                  className={({ active }) =>
                    clsx(
                      active ? 'bg-gray-100 dark:bg-gray-400' : 'text-gray-900 dark:text-gray-300',
                      'relative cursor-pointer select-none py-2 pl-3 pr-2 dark:text-white',
                    )
                  }
                  value={value.toLowerCase()}
                >
                  {({ selected }) => (
                    <div className="flex items-center">
                      <span className={clsx(selected ? 'font-extrabold' : 'font-normal', 'ml-3 block truncate')}>
                        {label}
                      </span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
