import * as React from 'react';

export type UseModalProps = {
  isOpen: boolean;
};

export type UseModalReturn = ReturnType<typeof useModal>;

export const useModal = (props?: UseModalProps) => {
  const [isOpen, setIsOpen] = React.useState(props?.isOpen || false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
};
