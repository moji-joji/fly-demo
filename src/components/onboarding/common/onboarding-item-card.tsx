'use client';

import { FieldPath, useFormContext } from 'react-hook-form';

import { TOnboardingForm } from '@/lib/onboarding/onboarding.form.schema';
import { cn } from '@/lib/utils';

import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { useTranslation } from 'react-i18next';

type Props = {
  text: string;
  icon: React.ElementType;
  formFields: FieldPath<TOnboardingForm>[];
  otherField?: FieldPath<TOnboardingForm>;
};

const OnboardingItemCard = ({
  text,
  icon: Icon,
  formFields,
  otherField,
}: Props) => {
  const form = useFormContext<TOnboardingForm>();
  const fieldValue = form.watch(formFields[0]);
  const isMulti = Array.isArray(fieldValue);
  const isSelected = isMulti ? fieldValue.includes(text) : fieldValue === text;
  const { t } = useTranslation('onboarding');
  const isOther = text === t('onboarding:Other');

  const handleChange = (checked: boolean) => {
    if (isMulti) {
      const newValue = checked
        ? [...fieldValue, text]
        : fieldValue.filter((val) => val !== text);
      form.setValue(formFields[0], newValue);
    } else {
      form.setValue(formFields[0], checked ? text : '');
    }

    if (isOther && !checked && otherField) {
      form.setValue(otherField, '');
    }
  };

  return (
    <label
      className={cn(
        'flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-[#E4E4E4] bg-white px-3 py-4 text-center shadow-custom',
        {
          'border-[#052652] bg-[#052652]': isSelected,
        }
      )}
    >
      <FormField
        control={form.control}
        name={formFields[0]}
        render={() => (
          <FormItem className='hidden'>
            <FormControl>
              <Checkbox
                className={cn('', { hidden: !isSelected })}
                checked={isSelected}
                onCheckedChange={handleChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className='flex h-1/2 flex-col justify-end'>
        <Icon
          className={cn('h-12 w-12 fill-[#0B5CC6]', {
            'fill-white': isSelected,
          })}
        />
      </div>
      <div className='flex h-1/2 flex-col items-center justify-between'>
        <span
          className={cn('w-[9.375rem] break-words font-medium text-[#052652]', {
            'text-white': isSelected,
          })}
        >
          {text}
        </span>
        {isOther && isSelected && otherField && (
          <FormInput<TOnboardingForm>
            name={otherField}
            placeholder={t('onboarding:onboardingItemCardInputPlaceholder')}
            className='center border-b-px max-w-[8.75rem] rounded-md border-l-0 border-r-0 border-t-0 border-white bg-[#FFFFFF29] text-xs text-white placeholder:font-light placeholder:text-white/90 focus-visible:ring-0'
          />
        )}
      </div>
    </label>
  );
};

export default OnboardingItemCard;
