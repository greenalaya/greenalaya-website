/**
 * The tree on the hero's centre line (the homepage (/)): a tall trunk rooted at the foot of the
 * screen on the line between the words and the butterfly/moth scene, with its crown high up,
 * spreading into both halves above the words. Decorative only: hidden from screen readers and
 * lets the pointer pass through to the scene, whose light falls on it and whose insects fly in
 * front of it. Leafy greens by day; a dark silhouette against the night in the dark theme. The crown sways very slightly,
 * except for visitors who prefer reduced motion.
 */
export function HomeHeroTree({ className }: { className?: string }) {
  // Leaf clusters, back to front: [cx, cy, r]. The back layer is darkest and the front lightest,
  // which gives the crown its depth. All of them sit in the top ~43% of the drawing, and the
  // crown narrows towards its foot so it stays clear of the headline beside it.
  const back: [number, number, number][] = [
    [200, 120, 100],
    [108, 170, 80],
    [292, 166, 82],
    [200, 220, 80],
  ];
  const middle: [number, number, number][] = [
    [148, 92, 64],
    [254, 88, 66],
    [200, 190, 72],
    [120, 214, 56],
    [282, 212, 58],
  ];
  const front: [number, number, number][] = [
    [176, 60, 34],
    [234, 64, 32],
    [140, 146, 30],
    [266, 140, 32],
    [204, 132, 36],
    [200, 236, 28],
  ];

  const clusters = (layer: [number, number, number][], key: string, className: string) =>
    layer.map(([cx, cy, r]) => (
      <circle key={`${key}${cx}-${cy}`} cx={cx} cy={cy} r={r} className={className} />
    ));

  return (
    <svg
      aria-hidden
      viewBox="0 0 400 700"
      className={className}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* A long trunk that flares into roots at the foot and divides into three limbs high up. */}
      <path
        className="fill-[#6b4f36] dark:fill-[#2b2119]"
        d="M138 700 C162 676 172 642 174 600 L176 340 C156 322 130 294 104 256 L120 244 C144 276 164 298 180 312 L182 256 C170 234 162 212 160 190 L176 186 C182 208 192 228 200 242 C210 222 224 202 244 184 L256 196 C236 216 222 238 216 262 L216 314 C234 298 258 272 282 242 L296 254 C272 288 246 316 222 338 L224 600 C226 642 236 676 262 700 Z"
      />
      <path
        className="fill-[#4e3826] dark:fill-[#211912]"
        d="M202 700 C207 660 210 620 209 560 L209 340 L219 342 L219 566 C220 624 225 664 238 700 Z"
      />
      {/* The crown sways from where the limbs leave the trunk. */}
      <g className="animate-tree-sway origin-[200px_320px]">
        {clusters(back, "b", "fill-[#2f6b34] dark:fill-[#12241a]")}
        {clusters(middle, "m", "fill-[#3f8a3f] dark:fill-[#183022]")}
        {clusters(front, "f", "fill-[#5ea552] dark:fill-[#1f3d29]")}
      </g>
    </svg>
  );
}
