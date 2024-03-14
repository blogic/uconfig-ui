import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  footer?: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, title, footer, children }: React.PropsWithChildren<ModalProps>) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-95 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full  items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg text-left shadow-xl transition-all  sm:my-8 sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 dark:bg-gray-800 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                      {typeof title === 'string' ? (
                        <Dialog.Title as="h2" className="text-lg font-semibold leading-6 text-gray-900">
                          {title}
                        </Dialog.Title>
                      ) : (
                        <Dialog.Title as="div">{title}</Dialog.Title>
                      )}
                      <div className="mt-2 w-full">{children}</div>
                    </div>
                  </div>
                </div>
                {footer ? (
                  <div className={clsx('bg-gray-50 px-4 py-3 dark:bg-gray-700 sm:flex sm:flex-row-reverse')}>
                    {footer}
                  </div>
                ) : null}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
