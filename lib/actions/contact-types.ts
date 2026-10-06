export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactFormState = {
  ok: boolean;
  message: string;
  /** Submitted values, returned on failure so the form can be refilled. */
  values?: ContactFormValues;
};

export const contactFormInitialState: ContactFormState = {
  ok: false,
  message: "",
};
