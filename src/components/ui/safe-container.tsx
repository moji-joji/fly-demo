import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const safeContainerVariants = cva('flex flex-col items-center', {
  variants: {
    spaceT: {
      default: 'pt-6 sm:pt-10 md:pt-12',
      double: 'pt-12 sm:pt-20 md:pt-24',
      none: undefined,
    },
    spaceB: {
      default: 'pb-6 sm:pb-10 md:pb-12',
      double: 'pb-12 sm:pb-20 md:pb-24',
    },
    spaceX: {
      default: 'container px-6 md:px-12 lg:px-14 xl:px-20',
      none: undefined,
    },
  },
  defaultVariants: {
    spaceX: 'default',
    spaceT: 'default',
    spaceB: 'default',
  },
});

interface SafeContainerProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof safeContainerVariants> {
  asChild?: boolean;
}

export default function SafeContainer({
  asChild,
  className,
  spaceX,
  spaceT,
  spaceB,
  ...props
}: SafeContainerProps) {
  const Comp = asChild ? Slot : 'section';

  return (
    <Comp
      {...props}
      className={cn(
        safeContainerVariants({ spaceX, spaceT, spaceB }),
        className
      )}
    />
  );
}
