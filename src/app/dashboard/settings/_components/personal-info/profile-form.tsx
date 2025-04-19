'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import useUpdateProfile from '../../_lib/use-update-profile';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Trans } from '@/components/ui/trans';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

const profileFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type TProfileForm = z.infer<typeof profileFormSchema>;

export default function ProfileForm({
  defaultValues,
}: {
  defaultValues: Partial<TProfileForm>;
}) {
  const form = useForm<TProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const updateProfile = useUpdateProfile();

  const onSubmit = (data: TProfileForm) => {
    updateProfile.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-4 flex grow flex-col justify-between'
      >
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey='app:profileName' />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey='app:email' />
                </FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={updateProfile.isPending || !form.formState.isDirty}
          className='mt-4 w-fit self-end'
          type='submit'
        >
          {updateProfile.isPending && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          <Trans i18nKey='app:saveChanges' />
        </Button>
      </form>
    </Form>
  );
}
