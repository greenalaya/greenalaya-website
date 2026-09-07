type MembershipEmailAttachment = {
  filename: string;
  content: string;
};

type MembershipEmailPayload = {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  organization: string;
  education: string;
  fieldOfStudy: string | null;
  membershipType: string;
  permanentAddress: string;
  currentAddress: string;
  interests: string[];
  interestOther: string | null;
  whatsappOptIn: boolean;
  updatesOptIn: boolean;
  attachments: MembershipEmailAttachment[];
};

export function isMembershipEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.CONTACT_NOTIFY_EMAIL &&
      process.env.CONTACT_FROM_EMAIL,
  );
}

export async function sendMembershipApplicationEmail(
  payload: MembershipEmailPayload,
): Promise<{ ok: boolean }> {
  if (!isMembershipEmailConfigured()) return { ok: false };

  const text = [
    "New membership application",
    "",
    `Full Name: ${payload.fullName}`,
    `Date of Birth: ${payload.dateOfBirth}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Organization/Affiliation: ${payload.organization}`,
    `Highest Level of Education: ${payload.education}`,
    payload.fieldOfStudy ? `Field of Study: ${payload.fieldOfStudy}` : null,
    `Membership Type: ${payload.membershipType}`,
    `Permanent Address: ${payload.permanentAddress}`,
    `Current Address: ${payload.currentAddress}`,
    `Areas of Interest: ${payload.interests.join(", ")}`,
    payload.interestOther ? `Other (specified): ${payload.interestOther}` : null,
    `Join members' WhatsApp group: ${payload.whatsappOptIn ? "Yes" : "No"}`,
    `Receive event/activity updates: ${payload.updatesOptIn ? "Yes" : "No"}`,
    "",
    "Identification and payment receipt are attached.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_NOTIFY_EMAIL],
      reply_to: payload.email,
      subject: `[Greenalaya] New membership application: ${payload.fullName}`,
      text,
      attachments: payload.attachments,
    }),
  });

  if (!response.ok) {
    console.error("Membership application email failed:", await response.text());
    return { ok: false };
  }

  return { ok: true };
}
