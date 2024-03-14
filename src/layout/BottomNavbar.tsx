import { Link, LinkProps } from '@tanstack/react-router';
import { Tooltip } from 'components/Tooltip';

export type BottomNavbarProps = {
  navigation: {
    label: string;
    navigateOptions: LinkProps & { preload?: 'intent' };
    icon: React.ReactNode;
  }[];
};

export const BottomNavbar = ({ navigation }: BottomNavbarProps) => (
  <nav className="items-center justify-center">
    <div className="relative flex w-[400px] items-center justify-center rounded-xl bg-gray-800 dark:bg-gray-600">
      <div className=" mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    activeProps={{
                      className: 'rounded-md px-3 py-2 text-sm font-medium text-white bg-gray-600 dark:bg-gray-800',
                    }}
                    {...item.navigateOptions}
                  >
                    <Tooltip key={item.label} label={item.label}>
                      {item.icon}
                    </Tooltip>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
);
