"use server";

import type { MembershipFormState } from "@/lib/actions/membership-types";
import { isMembershipEmailConfigured, sendMembershipApplicationEmail } from "@/lib/notify-membership";
import { membershipEducationOptions, membershipInterestOptions, membershipTiers } from "@/lib/site";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_DOCUMENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requiredText(formData: FormData, field: string, maxLength: number) {
  return String(formData.get(field) ?? "")
    .trim()
    .slice(0, maxLength);
}

function extensionFor(file: File) {
  const fromName = file.name.includes(".") ? file.name.split(".").pop() : null;
  if (fromName) return fromName.toLowerCase();
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function validateDocument(file: FormDataEntryValue | null, label: string): string | null {
  if (!(file instanceof File) || file.size === 0) {
    return `Please attach your ${label}.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `${label} must be smaller than 10 MB.`;
  }
  if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
    return `${label} must be a JPG, PNG, or PDF file.`;
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
    return { ok: false, message: "Please let us know if you would like to join the WhatsApp group." };
  }
  if (updatesOptIn !== "yes" && updatesOptIn !== "no") {
    return { ok: false, message: "Please let us know if you would like to receive updates." };
  }
  if (!declarationAccepted) {
    return { ok: false, message: "Please accept the declaration to submit your application." };
  }

  const identificationError = validateDocument(formData.get("identification"), "identification document");
  if (identificationError) return { ok: false, message: identificationError };

  const receiptError = validateDocument(formData.get("receipt"), "payment receipt");
  if (receiptError) return { ok: false, message: receiptError };

  const identification = formData.get("identification") as File;
  const receipt = formData.get("receipt") as File;

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
      { filename: `identification.${extensionFor(identification)}`, content: identificationContent },
      { filename: `payment-receipt.${extensionFor(receipt)}`, content: receiptContent },
    ],
  });

  if (!emailSent) {
    return {
      ok: false,
      message: "Something went wrong submitting your application. Please try again or email us directly.",
    };
  }

  return {
    ok: true,
    message:
      "Thank you for applying. We will confirm your membership after verifying your application and payment.",
  };
}
