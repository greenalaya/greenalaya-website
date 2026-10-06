export type MembershipFormState = {
  ok: boolean;
  message: string;
};

export const membershipFormInitialState: MembershipFormState = {
  ok: false,
  message: "",
};

/**
 * Combined size limit for the two uploaded documents. Vercel rejects request
 * bodies over 4.5 MB, so the files must stay under that with room for the
 * rest of the form.
 */
export const MAX_MEMBERSHIP_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_MEMBERSHIP_UPLOAD_LABEL = "4 MB";
