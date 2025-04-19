'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { PiTranslate } from 'react-icons/pi';

import {
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { language: currentLanguage, options } = i18n;

  const locales = (options.supportedLngs as string[]).filter(
    (locale) => locale.toLowerCase() !== 'cimode'
  );

  const languageNames = useMemo(() => {
    return new Intl.DisplayNames([currentLanguage], {
      type: 'language',
    });
  }, [currentLanguage]);

  const [value, setValue] = useState(i18n.language);

  const languageChanged = useCallback(
    async (locale: string) => {
      setValue(locale);

      await i18n.changeLanguage(locale);

      // refresh cached translations
      router.refresh();
    },
    [i18n, router]
  );

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <PiTranslate className='mr-1.5 h-3.5 w-3.5' />
        <Trans i18nKey='app:language' />
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {locales.map((locale) => (
            <DropdownMenuCheckboxItem
              key={locale}
              checked={value === locale}
              onCheckedChange={(checked) => checked && languageChanged(locale)}
            >
              {capitalize(languageNames.of(locale) ?? locale)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

function capitalize(lang: string) {
  return lang.slice(0, 1).toUpperCase() + lang.slice(1);
}
