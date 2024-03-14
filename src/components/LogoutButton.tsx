import { SignOut } from '@phosphor-icons/react';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';
import { useAuth } from 'contexts/AuthContext/useAuth';

export const LogoutButton = () => {
  const { t } = useTranslation('navigation');
  const { logout } = useAuth();
  const router = useRouter();

  const onLogout = () => {
    logout();
    setTimeout(() => {
      router.invalidate();
    }, 500);
  };

  return (
    <Tooltip label={t('logout')} placement="bottom">
      <button
        type="button"
        aria-label={t('logout')}
        className="relative h-10 w-10 rounded-md px-2 py-2 text-sm font-medium hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 dark:hover:bg-black/30"
      >
        <SignOut size={24} className="dark:text-white" aria-hidden="true" onClick={onLogout} />
      </button>
    </Tooltip>
  );
};
