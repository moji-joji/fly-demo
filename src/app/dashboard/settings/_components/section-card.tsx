import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  children: React.ReactNode;
  title: string;
  className?: string;
};

export default function SectionCard({ children, title, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border bg-white shadow',
        className
      )}
    >
      <h3 className='border-b p-4 text-xl font-medium'>{title}</h3>
      <div className='flex grow flex-col p-4'>{children}</div>
    </div>
  );
}
