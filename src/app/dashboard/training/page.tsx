import React from 'react';

type Props = {};

export default function Training({}: Props) {
  return (
    <div className='px-11 py-6'>
      <h1 className='text-3xl font-bold'>Video Catalog</h1>
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        <div className=''>
          <iframe
            src='https://www.youtube.com/embed/SuHUZ2Jlzr4?si=C6v99J0TMMqV4rCY'
            title='YouTube video player'
            className='aspect-video w-full rounded-xl'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
          ></iframe>
          <span className='mt-1 block text-lg font-medium'>
            Product Walkthrough
          </span>
        </div>
      </div>
    </div>
  );
}
