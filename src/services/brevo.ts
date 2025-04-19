import * as SibApiV3Sdk from '@sendinblue/client';
import { env } from '@/env';
import * as Sentry from '@sentry/nextjs';

const apiInstance = new SibApiV3Sdk.ContactsApi();
apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, env.BREVO_API_KEY);

const NEW_SIGNUP_LIST_ID = 10;

export const brevo = {
  createContact: async (email: string) => {
    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email;
    createContact.attributes = {
      HAS_ONBOARDED: false,
    };
    createContact.listIds = [NEW_SIGNUP_LIST_ID];

    try {
      await apiInstance.createContact(createContact);
    } catch (error) {
      Sentry.captureException(error);
    }
  },

  updateContact: async (email: string, hasOnboarded: boolean) => {
    const updateContact = new SibApiV3Sdk.UpdateContact();
    updateContact.attributes = {
      HAS_ONBOARDED: hasOnboarded,
    };
    updateContact.listIds = [NEW_SIGNUP_LIST_ID];

    try {
      await apiInstance.updateContact(email, updateContact);
    } catch (error) {
      Sentry.captureException(error);
    }
  },
};
