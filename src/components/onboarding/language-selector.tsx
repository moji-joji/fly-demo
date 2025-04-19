'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TOnboardingForm } from '@/lib/onboarding/onboarding.form.schema';
import { useFormContext } from 'react-hook-form';
import onboardingDefaultValues from '@/lib/onboarding/default-values';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { language: currentLanguage, options } = i18n;
  const form = useFormContext<TOnboardingForm>();

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
      // localStorage.removeItem('onboarding-values');
      router.replace('/onboarding');
      form.reset(onboardingDefaultValues);
    },
    [i18n, router, form]
  );

  return (
    <div>
      <Select value={value} onValueChange={languageChanged}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {locales.map((locale) => {
            const label = capitalize(languageNames.of(locale) ?? locale);

            const option = {
              value: locale,
              label,
            };

            return (
              <SelectItem value={option.value} key={option.value}>
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

function capitalize(lang: string) {
  return lang.slice(0, 1).toUpperCase() + lang.slice(1);
}
