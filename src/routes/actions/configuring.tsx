import * as React from 'react';
import { GearSix } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useWebSocketStore } from 'api/useWebSocketStore';
import { Heading } from 'components/Heading';
import { Text } from 'components/Text';

// This is a route that shows a loading spinner and the time elapsed since the last status change.
const Component = () => {
  const { t } = useTranslation('actions');
  const statusChange = useWebSocketStore((state) => state.statusLastChanged);
  const [secondsSince, setSecondsSince] = React.useState(new Date().getTime() - statusChange.getTime());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSince(new Date().getTime() - statusChange.getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [statusChange]);

  return (
    <div className="text-center">
      <GearSix className="mx-auto h-16 w-16 animate-spin-slow dark:text-white" />
      <Heading size="lg" className="mt-4">
        {t('configuringTitle')}
      </Heading>
      <Text className="mt-2" variant="explanation">
        {t('configuringExplanation', { seconds: Math.floor(secondsSince / 1000) })}
      </Text>
    </div>
  );
};

export const Route = createFileRoute('/actions/configuring')({
  component: Component,
});
