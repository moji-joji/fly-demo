import Image from 'next/image';
import flylogo from '~/images/logo.png';

const LoadingAnimation = () => {
  return (
    <div className='animate-bounce-short flex h-screen items-center justify-center'>
      <Image
        src={flylogo}
        alt='Fly Logo'
        width={100}
        height={50}
        className='mb-8'
      />
    </div>
  );
};

export default LoadingAnimation;
