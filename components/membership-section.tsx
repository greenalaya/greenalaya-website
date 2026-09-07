import { CheckCircle2 } from "lucide-react";
import { MembershipForm } from "@/components/membership-form";
import { Card } from "@/components/ui/card";
import { membershipPageContent, membershipTiers } from "@/lib/site";

export function MembershipSection() {
  return (
    <main className="mx-auto max-w-4xl px-6 pt-24 pb-16 md:pt-28">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {membershipPageContent.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {membershipPageContent.intro}
        </p>
        <p className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-primary">
          {membershipPageContent.focusAreas.map((area, index) => (
            <span key={area} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden className="text-muted-foreground">|</span>}
              {area}
            </span>
          ))}
        </p>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
          {membershipPageContent.whyJoinHeading}
        </h2>
        <ul className="mt-6 space-y-4">
          {membershipPageContent.whyJoin.map((item) => (
            <li key={item} className="flex items-start gap-3 text-foreground">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
          {membershipPageContent.optionsHeading}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {membershipTiers.map((tier) => (
            <Card key={tier.id} className="p-6 text-center">
              <p className="font-semibold text-foreground">{tier.label}</p>
              <p className="mt-3 text-2xl font-bold text-primary">{tier.fee}</p>
              <p className="mt-1 text-xs text-muted-foreground">{tier.feeNote}</p>
              {tier.renewal && (
                <p className="mt-3 text-sm text-muted-foreground">{tier.renewal}</p>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
          {membershipPageContent.applicationHeading}
        </h2>
        <p className="mt-3 text-muted-foreground">Please provide the following information:</p>

        <Card className="mt-6 p-6 sm:p-8">
          <MembershipForm />
        </Card>

        <p className="mt-8 text-center text-muted-foreground">{membershipPageContent.closing}</p>
      </section>
    </main>
  );
}
