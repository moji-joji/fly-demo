'use client';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import useUpdateAvatar from '@/app/dashboard/settings/_lib/use-update-avatar';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Trans } from '../ui/trans';
import { toast } from 'sonner';

function UploadAvatar({
  userId,
  setIsOpen,
}: {
  userId: string;
  setIsOpen: (value: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const updateAvatar = useUpdateAvatar();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // make sure the file is not larger than 10mb (as in supabase storage)
    if (acceptedFiles[0].size > 10 * 1024 * 1024) {
      toast.error('File size is too large');
      return;
    }
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  const handleUpload = async () => {
    await updateAvatar.mutateAsync({ userId, avatar: file });
    setFile(null);
    setIsOpen(false);
  };

  return (
    <>
      <div
        {...getRootProps({
          className: 'cursor-pointer space-y-4 overflow-hidden',
        })}
      >
        <Input
          {...getInputProps({
            className: 'cursor-pointer',
          })}
          type='file'
          accept='.jpeg,.jpg,.png'
        />
        {!file && (
          <div className='rounded-md border-2 border-dashed border-zinc-400 px-4 py-8 text-center text-sm'>
            <Trans i18nKey='app:dropImage' />
            <span className='text-xs'> (.jpeg .jpg .png)</span>
          </div>
        )}
        {file && (
          <Image
            src={URL.createObjectURL(file)}
            alt='Uploaded'
            className='mx-auto aspect-square w-1/2 rounded-xl object-contain'
            width={96}
            height={96}
          />
        )}
      </div>

      <Button disabled={updateAvatar.isPending} onClick={handleUpload}>
        {updateAvatar.isPending ? (
          <Loader className='h-5 w-5 animate-spin' />
        ) : (
          <Trans i18nKey='app:upload' />
        )}
      </Button>
    </>
  );
}

export default UploadAvatar;
