import React from 'react';
import { useTranslation } from 'react-i18next';
import { PiLightbulb } from 'react-icons/pi';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Trans } from '../ui/trans';

type Props = {};

export default function PostTips({}: Props) {
  const { t } = useTranslation('app');
  const tips = [
    t('app:tip0'),
    t('app:tip1'),
    t('app:tip2'),
    t('app:tip3'),
    t('app:tip4'),
  ];
  return (
    <Dialog>
      <DialogTrigger className='flex items-center gap-1 text-sm text-primary'>
        <PiLightbulb className='h-4 w-4 ' />
        <span className='text-xs underline'>
          <Trans i18nKey='app:linkedInTips' />
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>Tips</DialogTitle>
        </DialogHeader>
        <ul className='flex flex-col gap-1 px-3'>
          {tips.map((tip, index) => (
            <li key={index} className='list-disc text-sm'>
              {tip}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
