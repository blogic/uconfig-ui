import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useWebSocketStore } from 'api/useWebSocketStore';
import { Modal } from 'components/Dialogs/Modal';
import { Spinner } from 'components/Spinner';
import debounce from 'utils/debounce';

export const ApiStatusModal = () => {
  const { t } = useTranslation();
  const wsStatus = useWebSocketStore((state) => state.status);
  const [debouncedStatus, setDebouncedStatus] = React.useState(wsStatus);

  const debounceChange = React.useCallback(
    debounce((status: typeof debouncedStatus) => {
      setDebouncedStatus(status);
    }, 300),
    [],
  );

  React.useEffect(() => {
    /** Debouncing websocket status changes as there might be some temporary states that should not be shown to users */
    debounceChange(wsStatus);
  }, [wsStatus, debounceChange]);

  if (debouncedStatus === 'error')
    return (
      <Modal title={t('error')} isOpen onClose={() => {}}>
        <h3>{t('errorConnectingWs')}</h3>
        <div className="flex h-20 w-full flex-col items-center justify-center">
          <Spinner className="h-12 w-12" />
        </div>
      </Modal>
    );

  return null;
};
