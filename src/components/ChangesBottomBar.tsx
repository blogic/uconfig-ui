import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export type ChangesBottomBarProps = {
  onSave?: () => void;
  onReset: () => void;
};

export const ChangesBottomBar = ({ onSave, onReset }: ChangesBottomBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 z-10 flex w-screen items-center justify-center space-x-4 border-t-2 py-2">
      <Button buttonType="button" colorScheme="gray" className="w-max" onClick={onReset}>
        {t('reset')}
      </Button>
      <Button buttonType={onSave ? 'button' : 'submit'} className="w-max" onClick={onSave}>
        {t('save')}
      </Button>
    </div>
  );
};
