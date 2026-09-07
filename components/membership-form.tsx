"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { submitMembershipApplication } from "@/lib/actions/membership";
import { membershipFormInitialState } from "@/lib/actions/membership-types";
import { membershipEducationOptions, membershipInterestOptions, membershipTiers } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const labelClass = "mb-2 block text-sm font-semibold text-foreground";
const fieldsetLegendClass = "mb-3 block text-sm font-semibold text-foreground";
const acceptedDocumentTypes = "image/jpeg,image/png,image/webp,application/pdf";

function YesNoField({ name, question }: { name: string; question: string }) {
  return (
    <fieldset>
      <legend className={fieldsetLegendClass}>
        {question} <span className="text-red-600">*</span>
      </legend>
      <div className="flex gap-6">
        {["Yes", "No"].map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
          >
            <input
              type="radio"
              name={name}
              value={option.toLowerCase()}
              required
              className="size-4 accent-primary"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function MembershipForm() {
  const [state, formAction, pending] = useActionState(
    submitMembershipApplication,
    membershipFormInitialState,
  );
  const [interests, setInterests] = useState<string[]>([]);
  const [permanentAddress, setPermanentAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  if (state.ok && state.message) {
    return (
      <div
        role="status"
        className="rounded-lg border border-border bg-accent p-6 text-accent-foreground"
      >
        <p className="font-medium">Application received</p>
        <p className="mt-2 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-10">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.message && !state.ok && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full Name <span className="text-red-600">*</span>
          </label>
          <Input id="fullName" name="fullName" type="text" required maxLength={120} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className={labelClass}>
            Date of Birth <span className="text-red-600">*</span>
          </label>
          <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address <span className="text-red-600">*</span>
          </label>
          <Input id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number <span className="text-red-600">*</span>
          </label>
          <Input id="phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="organization" className={labelClass}>
            Organization or Affiliation <span className="text-red-600">*</span>
          </label>
          <Input
            id="organization"
            name="organization"
            type="text"
            required
            maxLength={200}
            placeholder="Write “None” if not affiliated"
          />
        </div>
        <div>
          <label htmlFor="education" className={labelClass}>
            Highest Level of Education <span className="text-red-600">*</span>
          </label>
          <Select id="education" name="education" required defaultValue="">
            <option value="" disabled>
              Select your highest level of education
            </option>
            {membershipEducationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="fieldOfStudy" className={labelClass}>
            Major Subject or Field of Study
          </label>
          <Input id="fieldOfStudy" name="fieldOfStudy" type="text" maxLength={200} />
        </div>
        <div>
          <label htmlFor="membershipType" className={labelClass}>
            Membership Type <span className="text-red-600">*</span>
          </label>
          <Select id="membershipType" name="membershipType" required defaultValue="">
            <option value="" disabled>
              Select a membership type
            </option>
            {membershipTiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="permanentAddress" className={labelClass}>
            Permanent Address <span className="text-red-600">*</span>
          </label>
          <Input
            id="permanentAddress"
            name="permanentAddress"
            type="text"
            required
            maxLength={300}
            value={permanentAddress}
            onChange={(event) => setPermanentAddress(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="currentAddress" className={labelClass}>
            Current Address <span className="text-red-600">*</span>
          </label>
          <Input
            id="currentAddress"
            name="currentAddress"
            type="text"
            required
            maxLength={300}
            readOnly={sameAsPermanent}
            value={sameAsPermanent ? permanentAddress : currentAddress}
            onChange={(event) => setCurrentAddress(event.target.value)}
            className={sameAsPermanent ? "bg-secondary/50" : undefined}
          />
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={sameAsPermanent}
              onChange={(event) => setSameAsPermanent(event.target.checked)}
              className="size-4 accent-primary"
            />
            Same as permanent address
          </label>
        </div>
      </div>

      <fieldset>
        <legend className={fieldsetLegendClass}>
          Areas of Interest <span className="text-red-600">*</span>{" "}
          <span className="font-normal text-muted-foreground">(select at least one)</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {membershipInterestOptions.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="interests"
                value={option}
                checked={interests.includes(option)}
                onChange={(event) =>
                  setInterests((prev) =>
                    event.target.checked
                      ? [...prev, option]
                      : prev.filter((value) => value !== option),
                  )
                }
                className="size-4 accent-primary"
              />
              {option}
            </label>
          ))}
        </div>

        {interests.includes("Other") && (
          <div className="mt-4">
            <label htmlFor="interestOther" className={labelClass}>
              Please specify <span className="text-red-600">*</span>
            </label>
            <Input id="interestOther" name="interestOther" type="text" required maxLength={200} />
          </div>
        )}
      </fieldset>

      <div className="space-y-6 border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground">Communication Preferences</h3>
        <YesNoField name="whatsappOptIn" question="Would you like to join our members’ WhatsApp group?" />
        <YesNoField
          name="updatesOptIn"
          question="Would you like to receive updates about our events and activities?"
        />
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground">Payment</h3>
        <p className="text-sm text-muted-foreground">
          Pay the applicable membership fee using the QR code below, then upload your payment
          receipt in the Required Documents section.
        </p>
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/50 p-6 text-center sm:items-start sm:text-left">
          <Image
            src="/images/membership-payment-qr.png"
            alt="Scan to pay your Greenalaya Nepal membership fee"
            width={200}
            height={200}
            unoptimized
            className="size-[200px] rounded-md border border-border bg-card object-contain"
          />
          <p className="text-xs text-muted-foreground">
            If the QR code has not loaded yet, email {" "}
            <a href="mailto:info@greenalayanepal.org.np" className="underline hover:opacity-70">
              info@greenalayanepal.org.np
            </a>{" "}
            for payment details.
          </p>
        </div>
      </div>

      <div className="space-y-6 border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground">Required Documents</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="identification" className={labelClass}>
              Identification (Student ID, or citizenship/national ID) <span className="text-red-600">*</span>
            </label>
            <Input
              id="identification"
              name="identification"
              type="file"
              required
              accept={acceptedDocumentTypes}
              className="cursor-pointer pt-1.5"
            />
          </div>
          <div>
            <label htmlFor="receipt" className={labelClass}>
              Payment Receipt (JPG, PNG, or PDF) <span className="text-red-600">*</span>
            </label>
            <Input
              id="receipt"
              name="receipt"
              type="file"
              required
              accept={acceptedDocumentTypes}
              className="cursor-pointer pt-1.5"
            />
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 border-t border-border pt-6 text-sm text-foreground">
        <input
          type="checkbox"
          name="declaration"
          required
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <span>
          I confirm that the information provided is correct and agree to follow the objectives and
          policies of Greenalaya Nepal. I understand that membership will be confirmed after
          verification of my application and payment.{" "}
          <span className="text-red-600">*</span>
        </span>
      </label>

      <Button type="submit" disabled={pending} size="lg" className="w-full">
        <Send className="h-4 w-4" aria-hidden />
        {pending ? "Submitting…" : "Submit Membership Application"}
      </Button>
    </form>
  );
}
