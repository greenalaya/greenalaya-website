"use server";

import { after } from "next/server";
import type { ContactFormState } from "@/lib/actions/contact-types";
import { notifyStaffOfContactSubmission } from "@/lib/notify-contact";
import { getRequestIp } from "@/lib/request-ip";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (formData.get("website")) {
    return {
      ok: true,
      message: "Thank you. We will get back to you soon.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "The contact form is temporarily unavailable. Please email us directly.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const values = { name, email, subject, message };

  if (!name || name.length > 120) {
    return { ok: false, message: "Please enter your name (max 120 characters).", values };
  }

  if (!email || !isValidEmail(email) || email.length > 254) {
    return { ok: false, message: "Please enter a valid email address.", values };
  }

  if (subject.length > 200) {
    return { ok: false, message: "Subject is too long (max 200 characters).", values };
  }

  if (message.length < 10 || message.length > 5000) {
    return {
      ok: false,
      message: "Message must be between 10 and 5000 characters.",
      values,
    };
  }

  // Forward the visitor IP so the database rate limit (phase11-hardening.sql)
  // counts per visitor rather than per server.
  const clientIp = await getRequestIp();
  const supabase = await createClient({
    headers: clientIp ? { "x-client-ip": clientIp } : undefined,
  });
  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    subject: subject || null,
    message,
  });

  if (error) {
    console.error("Contact submission insert failed:", error.message);
    const rateLimited = /too many submissions/i.test(error.message);
    return {
      ok: false,
      message: rateLimited
        ? "Too many messages were sent recently. Please try again in a few minutes."
        : "Something went wrong. Please try again or email us directly.",
      values,
    };
  }

  // Runs after the response is sent but keeps the function alive until done.
  after(() =>
    notifyStaffOfContactSubmission({
      name,
      email,
      subject: subject || null,
      message,
    }),
  );

  return {
    ok: true,
    message: "Thank you for reaching out. We will respond as soon as we can.",
  };
}
