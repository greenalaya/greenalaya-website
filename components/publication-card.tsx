import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { PublicationCard } from "@/lib/content/resources";

type PublicationCardProps = {
  publication: PublicationCard;
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PublicationCardItem({ publication }: PublicationCardProps) {
  const publishedDate = formatDate(publication.publishedDateIso);

  return (
    <article className="group">
      <Link href={`/publications/${publication.slug}`} className="block no-underline">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={publication.coverImage}
            alt={publication.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <h3 className="mt-4 text-lg leading-snug font-normal text-foreground transition group-hover:text-primary sm:text-xl">
          {publication.title}
        </h3>
        {publishedDate ? (
          <p className="mt-2 flex items-center gap-1.5 text-base italic text-muted-foreground">
            <CalendarDays className="size-4 shrink-0 not-italic text-primary" aria-hidden />
            {publishedDate}
          </p>
        ) : null}
      </Link>
    </article>
  );
}
