import { GoBackButton } from 'components/GoBackButton';
import { Heading } from 'components/Heading';

type PageTitleBarProps = {
  title: string | React.ReactNode;
};

export const PageTitleBar = ({ title }: PageTitleBarProps) => (
  <div className="relative mb-4 flex h-[62px] items-center justify-center text-center align-middle">
    <GoBackButton />
    {typeof title === 'string' ? <Heading size="lg">{title}</Heading> : title}
  </div>
);
