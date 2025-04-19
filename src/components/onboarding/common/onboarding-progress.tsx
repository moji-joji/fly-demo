import { cn } from '@/lib/utils';

type Props = {
  step: number;
  className?: string;
};

const OnboardingProgress = ({ step, className }: Props) => {
  return (
    <div
      className={cn(
        'flex justify-center gap-2 md:gap-8 lg:gap-10 xl:gap-[3.125rem]',
        className
      )}
    >
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`h-2 w-12 rounded-full shadow-progress transition-colors md:h-[0.25rem] md:w-20 xl:w-24 ${index < step - 1 ? 'bg-[#1877F2]' : 'bg-[#F4F4F4CC]'}`}
        ></div>
      ))}
    </div>
  );
};

export default OnboardingProgress;
