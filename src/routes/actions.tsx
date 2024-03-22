import { Outlet, createFileRoute } from '@tanstack/react-router';

const Component = () => (
  <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:h-1/2 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img className="mx-auto h-20 w-auto" src="/OpenWrt_Logo.png" alt="OpenWrt" />
    </div>
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <Outlet />
    </div>
  </div>
);

export const Route = createFileRoute('/actions')({
  component: Component,
});
