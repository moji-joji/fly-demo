import useDeleteAvatar from '../../_lib/use-delete-avatar';
import { Trans } from '@/components/ui/trans';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import useUpdateAvatar from '../../_lib/use-update-avatar';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';

export default function ProfilePhoto({
  avatar,
  userId,
}: {
  avatar?: string;
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteAvatar = useDeleteAvatar();

  return (
    <div className='flex items-center justify-start gap-2'>
      <Image
        src={avatar || '/images/avatars/default-avatar.png'}
        alt='Profile Picture'
        className='aspect-square rounded-full border-2 object-cover'
        height={96}
        width={96}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size='sm' className='mt-4 bg-[#1877F2]'>
            <Trans i18nKey='app:upload' />
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[26.5625rem]'>
          <UploadAvatar userId={userId} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
      {avatar && (
        <Button
          size='sm'
          className='mt-4 border-none bg-transparent px-0 text-[#F02E2E] shadow-none hover:bg-transparent '
          onClick={() => deleteAvatar.mutate()}
        >
          <Trans i18nKey='app:deletePicture' />{' '}
        </Button>
      )}
    </div>
  );
}

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
