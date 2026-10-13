import { useId } from "react";

/**
 * CategoryLetter
 * -----------------------------------------------------------------------
 * Renders a single oversized ROSHNI letter as an image-filled container,
 * and morphs that letter into a perfect circle on hover/focus.
 *
 * HOW THE MORPH WORKS (read this before touching the SVG below)
 * -----------------------------------------------------------------------
 * A literal point-by-point tween from an arbitrary serif glyph ("R", "S",
 * "N"...) into a circle isn't something CSS or SVG can interpolate on its
 * own — that needs a shape-tweening library, which this brief asked to
 * avoid. Instead this component uses the technique real fashion sites use
 * for this exact effect, built only from two native SVG <clipPath>s:
 *
 *   Layer A — the SAME photo, clipped to the letter's own glyph outline
 *             (rendered with an SVG <text> element as the clip shape).
 *   Layer B — the SAME photo, at the SAME position, clipped to a circle.
 *
 * Both layers sit exactly on top of one another. At rest, Layer A is
 * fully visible and Layer B is invisible; on hover/focus that crossfades
 * and both layers scale up together. Because it's the same image in the
 * same place the whole time, the eye reads it as the letter itself
 * rounding out into a circle, not as a circle appearing on top of it.
 * This is a real shape transformation (two SVG clip-paths), not a plain
 * image-swap or a circle overlaid on a static letter.
 * -----------------------------------------------------------------------
 */

const VIEW_W = 220;
const VIEW_H = 280;
const CENTER_X = VIEW_W / 2;
const CENTER_Y = VIEW_H / 2;
const CIRCLE_R = 96;

// Shared transition: one easing curve, defined once in roshni-categories.css
// as --roshni-ease, referenced everywhere via an arbitrary Tailwind value.
const MORPH_TRANSITION =
  "tw:transition-[opacity,transform] tw:duration-[650ms] tw:ease-[var(--roshni-ease)] " +
  "tw:motion-reduce:transition-none tw:motion-reduce:duration-0";

export default function CategoryLetter({
  letter,
  title,
  href,
  image,
  alt,
  isActive,
  isDimmed,
  onActivate,
  onDeactivate,
}) {
  // useId keeps clipPath ids collision-free even when six of these render
  // side by side (SVG ids are global to the document, not scoped per-svg).
  const uid = useId();
  const letterClipId = `roshni-letter-clip-${uid}`;
  const circleClipId = `roshni-circle-clip-${uid}`;

  return (
    <a
      href={href}
      // Container: a single focusable, hoverable unit. Semantics come
      // from the anchor itself (a real destination, not a div faking a
      // link) plus an accessible name that includes what the photo shows.
      aria-label={`Shop ${title} — ${alt}`}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className={[
        "tw:group tw:relative tw:flex tw:shrink-0 tw:flex-col tw:items-center",
        "tw:w-[42vw] tw:max-w-[220px] tw:sm:w-[220px]",
        "tw:snap-center tw:outline-none",
        "tw:rounded-[28px] tw:focus-visible:ring-2 tw:focus-visible:ring-[#C6A662] tw:focus-visible:ring-offset-4 tw:focus-visible:ring-offset-[#FAF6EF]",
        MORPH_TRANSITION,
        // Requirement 9: siblings quietly recede, never disappear (req 10).
        isDimmed ? "tw:opacity-60 tw:scale-[0.94]" : "tw:opacity-100 tw:scale-100",
      ].join(" ")}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="tw:w-full tw:h-auto tw:overflow-visible"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          {/* Layer A's clip shape: the letter's own glyph outline. */}
          <clipPath id={letterClipId}>
            <text
              x={CENTER_X}
              y={CENTER_Y}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                fontWeight: 800,
                fontSize: 236,
              }}
            >
              {letter}
            </text>
          </clipPath>

          {/* Layer B's clip shape: a plain circle, same optical center. */}
          <clipPath id={circleClipId}>
            <circle cx={CENTER_X} cy={CENTER_Y} r={CIRCLE_R} />
          </clipPath>
        </defs>

        {/* ---------- Layer A: letter-shaped photo (resting state) ---------- */}
        <g
          className={MORPH_TRANSITION}
          style={{
            opacity: isActive ? 0 : 1,
            transform: isActive ? "scale(1.1)" : "scale(1)",
            transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
          }}
        >
          <image
            href={image}
            x="0"
            y="0"
            width={VIEW_W}
            height={VIEW_H}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${letterClipId})`}
          />
          {/* Subtle antique-gold outline traced around the letter itself. */}
          <text
            x={CENTER_X}
            y={CENTER_Y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="none"
            stroke="#C6A662"
            strokeWidth="1.5"
            style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
              fontWeight: 800,
              fontSize: 236,
            }}
          >
            {letter}
          </text>
        </g>

        {/* ---------- Layer B: circle-shaped photo (hover/focus state) ---------- */}
        <g
          className={MORPH_TRANSITION}
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? "scale(1.06)" : "scale(0.92)",
            transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
          }}
        >
          <image
            href={image}
            x="0"
            y="0"
            width={VIEW_W}
            height={VIEW_H}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${circleClipId})`}
          />
          {/* Matching gold ring so the border itself appears to morph too. */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={CIRCLE_R}
            fill="none"
            stroke="#C6A662"
            strokeWidth="1.5"
          />
        </g>
      </svg>

      {/* "Explore" indicator — only meaningful once a category is active,
          so it's hidden from assistive tech rather than just visually. */}
      <span
        aria-hidden="true"
        className={[
          "tw:pointer-events-none tw:absolute tw:left-1/2 tw:top-[46%] tw:-translate-x-1/2",
          "tw:flex tw:items-center tw:gap-1.5 tw:text-[11px] tw:tracking-[0.14em] tw:text-[#FAF6EF]",
          MORPH_TRANSITION,
          isActive
            ? "tw:opacity-100 tw:translate-y-2"
            : "tw:opacity-0 tw:translate-y-0",
        ].join(" ")}
      >
        Explore
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2.5 6h7M6.5 2.5 10 6l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Category label — enlarges slightly on hover/focus per spec. */}
      <span
        className={[
          "tw:mt-4 tw:font-serif tw:text-[#1B3A3A] tw:tracking-[0.02em]",
          MORPH_TRANSITION,
          isActive ? "tw:text-base tw:text-[#8B6B22]" : "tw:text-sm",
        ].join(" ")}
      >
        {title}
      </span>
    </a>
  );
}
