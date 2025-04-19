'use client';

import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';

type Props<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = {
  name: TName;
  containerClassName?: string;
  label?: string | React.ReactNode;
  description?: string;
  onboardingStyles?: boolean;
} & Omit<InputProps, 'name'>;

export function FormInput<T extends object>({
  className,
  name,
  containerClassName,
  label,
  description,
  onboardingStyles,
  ...rest
}: Props<T>) {
  const form = useFormContext<T>();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(containerClassName)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...rest}
              {...field}
              className={cn(
                {
                  'h-11 w-full rounded-lg px-[0.875rem] py-[0.625rem] placeholder:text-[#C0C0C0]':
                    onboardingStyles,
                },
                className
              )}
              value={field.value as string}
            />
          </FormControl>
          {!!description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
