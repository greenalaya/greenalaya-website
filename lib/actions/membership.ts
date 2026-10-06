"use server";

import {
  MAX_MEMBERSHIP_UPLOAD_BYTES,
  MAX_MEMBERSHIP_UPLOAD_LABEL,
  type MembershipFormState,
} from "@/lib/actions/membership-types";
import {
  isMembershipEmailConfigured,
  sendMembershipApplicationEmail,
} from "@/lib/notify-membership";
import { membershipEducationOptions, membershipInterestOptions, membershipTiers } from "@/lib/site";

/** File extension per accepted type; the extension never comes from the user's filename. */
const DOCUMENT_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requiredText(formData: FormData, field: string, maxLength: number) {
  return String(formData.get(field) ?? "")
    .trim()
    .slice(0, maxLength);
}

/** Checks the file's leading bytes match its declared type (the browser-supplied type is untrusted). */
function matchesSignature(bytes: Uint8Array, type: string) {
  const startsWith = (signature: number[], offset = 0) =>
    signature.every((byte, index) => bytes[offset + index] === byte);

  switch (type) {
    case "application/pdf":
      return startsWith([0x25, 0x50, 0x44, 0x46]); // %PDF
    case "image/png":
      return startsWith([0x89, 0x50, 0x4e, 0x47]);
    case "image/jpeg":
      return startsWith([0xff, 0xd8, 0xff]);
    case "image/webp":
      return startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8); // RIFF....WEBP
    default:
      return false;
  }
}

async function validateDocument(
  file: FormDataEntryValue | null,
  label: string,
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) {
    return `Please attach your ${label}.`;
  }
  if (!DOCUMENT_EXTENSIONS[file.type]) {
    return `The ${label} must be a JPG, PNG, WebP, or PDF file.`;
  }
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!matchesSignature(header, file.type)) {
    return `The ${label} doesn't appear to be a valid ${DOCUMENT_EXTENSIONS[file.type].toUpperCase()} file.`;
  }
  return null;
}

async function toBase64(file: File) {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

export async function submitMembershipApplication(
  _prevState: MembershipFormState,
  formData: FormData,
): Promise<MembershipFormState> {
  if (formData.get("website")) {
    return {
      ok: true,
      message: "Thank you. We will review your application and be in touch soon.",
    };
  }

  if (!isMembershipEmailConfigured()) {
    return {
      ok: false,
      message: "The membership form is temporarily unavailable. Please email us directly.",
    };
  }

  const fullName = requiredText(formData, "fullName", 120);
  const dateOfBirth = requiredText(formData, "dateOfBirth", 20);
  const email = requiredText(formData, "email", 254);
  const phone = requiredText(formData, "phone", 30);
  const organization = requiredText(formData, "organization", 200);
  const education = requiredText(formData, "education", 200);
  const fieldOfStudy = requiredText(formData, "fieldOfStudy", 200);
  const membershipTypeId = requiredText(formData, "membershipType", 20);
  const permanentAddress = requiredText(formData, "permanentAddress", 300);
  const currentAddress = requiredText(formData, "currentAddress", 300);
  const whatsappOptIn = formData.get("whatsappOptIn");
  const updatesOptIn = formData.get("updatesOptIn");
  const declarationAccepted = formData.get("declaration") === "on";
  const interests = formData
    .getAll("interests")
    .map((value) => String(value))
    .filter((value): value is (typeof membershipInterestOptions)[number] =>
      (membershipInterestOptions as readonly string[]).includes(value),
    );
  const interestOther = requiredText(formData, "interestOther", 200);

  if (!fullName) return { ok: false, message: "Please enter your full name." };
  if (!dateOfBirth) return { ok: false, message: "Please enter your date of birth." };
  if (!email || !isValidEmail(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (!phone) return { ok: false, message: "Please enter your phone number." };
  if (!organization) {
    return {
      ok: false,
      message: "Please enter your organization or affiliation (write “None” if not affiliated).",
    };
  }
  if (!membershipEducationOptions.some((option) => option === education)) {
    return { ok: false, message: "Please select your highest level of education." };
  }
  const membershipTier = membershipTiers.find((tier) => tier.id === membershipTypeId);
  if (!membershipTier) {
    return { ok: false, message: "Please select a membership type." };
  }
  if (!permanentAddress) return { ok: false, message: "Please enter your permanent address." };
  if (!currentAddress) return { ok: false, message: "Please enter your current address." };
  if (interests.length === 0) {
    return { ok: false, message: "Please select at least one area of interest." };
  }
  if (interests.includes("Other") && !interestOther) {
    return { ok: false, message: "Please specify your other area of interest." };
  }
  if (whatsappOptIn !== "yes" && whatsappOptIn !== "no") {
    return {
      ok: false,
      message: "Please let us know if you would like to join the WhatsApp group.",
    };
  }
  if (updatesOptIn !== "yes" && updatesOptIn !== "no") {
    return { ok: false, message: "Please let us know if you would like to receive updates." };
  }
  if (!declarationAccepted) {
    return { ok: false, message: "Please accept the declaration to submit your application." };
  }

  const identificationError = await validateDocument(
    formData.get("identification"),
    "identification document",
  );
  if (identificationError) return { ok: false, message: identificationError };

  const receiptError = await validateDocument(formData.get("receipt"), "payment receipt");
  if (receiptError) return { ok: false, message: receiptError };

  const identification = formData.get("identification") as File;
  const receipt = formData.get("receipt") as File;

  if (identification.size + receipt.size > MAX_MEMBERSHIP_UPLOAD_BYTES) {
    return {
      ok: false,
      message: `Your two documents must be under ${MAX_MEMBERSHIP_UPLOAD_LABEL} combined. Please upload smaller files.`,
    };
  }

  const [identificationContent, receiptContent] = await Promise.all([
    toBase64(identification),
    toBase64(receipt),
  ]);

  const { ok: emailSent } = await sendMembershipApplicationEmail({
    fullName,
    dateOfBirth,
    email,
    phone,
    organization,
    education,
    fieldOfStudy: fieldOfStudy || null,
    membershipType: membershipTier.label,
    permanentAddress,
    currentAddress,
    interests,
    interestOther: interests.includes("Other") ? interestOther : null,
    whatsappOptIn: whatsappOptIn === "yes",
    updatesOptIn: updatesOptIn === "yes",
    attachments: [
      {
        filename: `identification.${DOCUMENT_EXTENSIONS[identification.type]}`,
        content: identificationContent,
      },
      { filename: `payment-receipt.${DOCUMENT_EXTENSIONS[receipt.type]}`, content: receiptContent },
    ],
  });

  if (!emailSent) {
    return {
      ok: false,
      message:
        "Something went wrong submitting your application. Please try again or email us directly.",
    };
  }

  return {
    ok: true,
    message:
      "Thank you for applying. We will confirm your membership after verifying your application and payment.",
  };
}
