"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { siteContact } from "@/lib/site";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl px-6 pt-24 pb-12 md:pt-28">
      <h1 className="text-3xl font-bold text-secondary-foreground">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        Sorry, this page ran into a problem. Please try again. If you were submitting a form and it
        keeps failing, email us at{" "}
        <a href={`mailto:${siteContact.email}`} className="text-primary hover:underline">
          {siteContact.email}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="button" onClick={() => unstable_retry()}>
          Try again
        </Button>
        <Link href="/" className="text-sm text-primary hover:underline">
          Go to the homepage
        </Link>
      </div>
    </main>
  );
}
