import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The tree on the hero's centre line (the homepage (/)): rooted at the foot of the screen on the
 * line between the words and the butterfly/moth scene. Decorative only: hidden from screen
 * readers and lets the pointer pass through to the scene, whose light falls on it and whose
 * insects fly in front of it. In full colour by day; darkened to a silhouette against the night
 * in the dark theme. It sways very slightly from its roots, except for visitors who prefer
 * reduced motion.
 *
 * The picture (public/images/home/hero-tree.webp, 800 × 1400) is made from a Vecteezy Pro vector,
 * "Deciduous green tree with exposed roots" (vecteezy.com, 10847909): trimmed to the tree, with
 * the plain stretch of trunk below the branches lengthened so the crown stands high up.
 */
export function HomeHeroTree({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("aspect-[4/7]", className)}>
      <Image
        src="/images/home/hero-tree.webp"
        alt=""
        fill
        // Served as it is: it is already a small WebP, and the image optimiser drops its
        // transparency.
        unoptimized
        // Part of the first screen, so it loads straight away.
        loading="eager"
        className="animate-tree-sway origin-bottom object-contain dark:brightness-[0.32] dark:saturate-[0.6]"
      />
    </div>
  );
}
