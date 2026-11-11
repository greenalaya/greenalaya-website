/** A small seeded random, so the grass is the same on every visit (and on server and browser). */
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const WIDTH = 960;
const HEIGHT = 64;

// The same blades as the butterfly meadow draws along its foot (one about every 5px, 14-48px
// tall, in two greens), worked out once here rather than on every frame.
const blades = (() => {
  const random = seeded(11);
  return Array.from({ length: WIDTH / 5 }, () => {
    const x = random() * WIDTH;
    const tall = 14 + random() * 34;
    // Meadow greens by day, darker ones at night: the same as the scene's grass.
    const colour =
      random() > 0.5
        ? "stroke-[#7fae62] dark:stroke-[#35602f]"
        : "stroke-[#5f9247] dark:stroke-[#27482a]";
    const width = 1.5 + random() * 1.5;
    const bend = (random() - 0.5) * 10;
    const tip = (random() - 0.5) * 16;
    return {
      d: `M${x.toFixed(1)} ${HEIGHT + 2} Q${(x + bend).toFixed(1)} ${(HEIGHT - tall * 0.6).toFixed(1)} ${(x + tip).toFixed(1)} ${(HEIGHT - tall).toFixed(1)}`,
      colour,
      width: width.toFixed(2),
    };
  });
})();

/**
 * Still grass along the foot of the hero's left half (/home-preview-2), matching the scene's
 * grass on the right in both themes. Drawn at its real size (not stretched): a wider half shows
 * more of it, up to 960px.
 */
export function HomeMeadowGrass({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMinYMax slice"
      className={className}
    >
      {blades.map((blade, index) => (
        <path
          key={index}
          d={blade.d}
          fill="none"
          className={blade.colour}
          strokeWidth={blade.width}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
