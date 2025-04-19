import { cn } from '@/lib/utils';

export default function InpirationLoaderCard({ idx }: { idx: number }) {
  return (
    <div
      style={{
        background: 'linear-gradient(154deg, #FFF -4.5%, #2AA6FF 154.55%)',
      }}
      className={cn(
        'flex h-[12.5rem] animate-pulse flex-col gap-2 rounded-lg p-3.5',
        {
          'delay-0': idx % 4 === 0,
          'delay-200': idx % 4 === 1,
          'delay-75': idx % 4 === 2,
          'delay-150': idx % 4 === 3,
        }
      )}
    />
  );
}
