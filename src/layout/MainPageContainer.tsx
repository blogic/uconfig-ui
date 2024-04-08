import { ConfirmConfigurationChangeBar } from 'contexts/ConfigurationProvider/ConfirmConfigurationBar';

export type MainPageContainerProps = {
  children: React.ReactNode;
};

export const MainPageContainer = ({ children }: MainPageContainerProps) => (
  <main className="z-0 flex w-full flex-1 items-center justify-center overflow-y-auto focus:outline-none">
    <div className="relative w-[600px] px-6 py-6">
      <div className=" mt-8 lg:mt-0">
        <ConfirmConfigurationChangeBar />
        {children}
      </div>
    </div>
  </main>
);
