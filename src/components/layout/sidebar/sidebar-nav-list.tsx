'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons/lib';
import {
  PiGraduationCap,
  PiLightbulb,
  PiNoteBlank,
  PiPencilSimpleLineLight,
  PiSquaresFourLight,
} from 'react-icons/pi';

import { cn } from '@/lib/utils';

import PostFeedback from './post-feedback';

type Props = {};

export default function SidebarNavList({}: Props) {
  const { t } = useTranslation('app');
  const navItems = [
    {
      title: t('overview'),
      icon: PiSquaresFourLight,
      href: '/dashboard',
    },
    {
      title: t('create'),
      icon: PiPencilSimpleLineLight,
      href: '/dashboard/create',
    },
    {
      title: t('posts'),
      icon: PiNoteBlank,
      href: '/dashboard/posts',
    },
    {
      title: t('training'),
      icon: PiGraduationCap,
      href: '/dashboard/training',
    },
    {
      title: t('roadmap'),
      icon: PiLightbulb,
      href: 'https://fly.featurebase.app',
    },
  ] as const;
  const pathName = usePathname();

  return (
    <div className='flex flex-col gap-3'>
      {navItems.map((item, idx) => (
        <NavItem
          key={idx}
          title={item.title}
          icon={item.icon}
          href={item.href}
          isActive={pathName === item.href}
        />
      ))}
      <PostFeedback />
    </div>
  );
}

type NavItemProps = {
  title: string;
  icon: IconType;
  href: string;
  isActive: boolean;
};

function NavItem({ title, href, isActive, icon: Icon }: NavItemProps) {
  return (
    <Link target={href.startsWith('http') ? '_blank' : undefined} href={href}>
      <div
        className={cn('flex items-center gap-2 rounded-md border p-[0.0625rem]', {
          'border-[#77B4FF80] bg-[#DEEDFF] font-medium text-[#2A2A2A]':
            isActive,
          'border-transparent text-[#565656]': !isActive,
        })}
      >
        <Icon
          className={cn('h-7 w-7', {
            'text-[#1877F2]': isActive,
            'text-[#565656]': !isActive,
          })}
        />
        <span>{title}</span>
      </div>
    </Link>
  );
}
