import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from 'components/Spinner';

// This is a route that shows a loading spinner and the time elapsed since the last status change.
const Component = () => (
  <div className="text-center">
    <Spinner size="lg" className="mt-4" />
  </div>
);

export const Route = createFileRoute('/actions/connecting')({
  component: Component,
});
