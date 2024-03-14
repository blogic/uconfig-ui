import { useTranslation } from 'react-i18next';
import { useWebSocketStore } from 'api/useWebSocketStore';
import { Modal } from 'components/Dialogs/Modal';
import { Spinner } from 'components/Spinner';

export const ApiStatusModal = () => {
  const { t } = useTranslation();
  const wsStatus = useWebSocketStore.use.status();

  if (wsStatus === 'connecting')
    return (
      <Modal title={t('connecting')} isOpen onClose={() => {}}>
        <div className="flex h-20 w-full flex-col items-center justify-center">
          <Spinner className="h-12 w-12" />
        </div>
      </Modal>
    );

  if (wsStatus === 'error')
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
