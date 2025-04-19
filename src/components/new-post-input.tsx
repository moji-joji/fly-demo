'use client';

import { DOMAttributes } from 'react';
import { PiArrowUpRight, PiCircleNotch } from 'react-icons/pi';

import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { Trans } from './ui/trans';

type Props = {
  value: string;
  handleInputChange: any;
  onSubmit: DOMAttributes<HTMLFormElement>['onSubmit'];
  className?: string;
  isLoading?: boolean;
  placeholder?: string;
};

export default function NewPostInput({
  value,
  handleInputChange,
  onSubmit,
  className,
  isLoading,
  placeholder,
}: Props) {
  const { formRef, onKeyDown } = useEnterSubmit();

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className={cn('relative overflow-clip rounded-2xl bg-white', className)}
    >
      <div className='relative'>
        <div className='absolute bottom-0 w-fit rounded-tr-xl bg-primary/10 px-3 py-1 text-center text-xs'>
          <span className='font-medium text-primary'>
            <Trans i18nKey='app:oneGenOneCredit' />
          </span>
        </div>
        <Textarea
          name='message'
          value={value}
          onChange={handleInputChange}
          className='h-40 w-full resize-none rounded-2xl p-4 placeholder:text-black/40 focus:ring-0 md:h-32'
          onKeyDown={onKeyDown}
          id='input'
          placeholder={placeholder}
        />
        <Button
          disabled={isLoading}
          size='icon'
          className='absolute bottom-3 right-3 h-7 w-7 rounded-full p-0 md:h-9 md:w-9'
          type='submit'
        >
          {isLoading ? (
            <PiCircleNotch className='h-5 w-5 animate-spin' />
          ) : (
            <PiArrowUpRight className='h-5 w-5 md:h-6 md:w-6' />
          )}
        </Button>
      </div>
    </form>
  );
}
