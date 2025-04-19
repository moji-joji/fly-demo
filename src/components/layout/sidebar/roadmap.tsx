import Link from 'next/link';
import React from 'react';
import { PiLightbulb } from 'react-icons/pi';

import { Trans } from '@/components/ui/trans';

type Props = {};

export default function Roadmap({}: Props) {
  return (
    <Link
      href=''
      className='mb-5 flex items-center gap-1 text-sm text-[#565656]'
    >
      <PiLightbulb className='h-6 w-6 ' />
      <span className=''>
        <Trans i18nKey='app:roadmap' />
      </span>
    </Link>
  );
}
