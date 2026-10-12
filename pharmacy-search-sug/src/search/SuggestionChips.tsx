import { useState } from "react";
import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";

export type Suggestion = { id: string; label: string };

type Props = {
  suggestions: Suggestion[];
  onSelect?: (suggestion: Suggestion) => void;
};

/**
 * Animation state per chip:
 *   "false" → hidden: tiny + invisible   (Figma: "search -- disappear")
 *   "true"  → shown:  natural size        (Figma: "search -- pop suggestions - appear")
 *
 * Only `transform` and `opacity` are animated, so every chip keeps its
 * flex-wrap slot from the first frame — no layout shift, no neighbour jostle.
 */
const chipVariants: Variants = {
  false: { opacity: 0, transform: "scale(0.1)" },
  true: { opacity: 1, transform: "scale(1)" },
};

// prefers-reduced-motion: same false → true states, opacity only.
const reducedChipVariants: Variants = {
  false: { opacity: 0 },
  true: { opacity: 1 },
};

// Snappy spring with a visible but short overshoot — a physical "pop".
const POP_SPRING = { type: "spring", stiffness: 560, damping: 20, mass: 0.7 } as const;

// Randomised timing window. Everything starts within ~0.33s.
const START_OFFSET = 0.06; // let the page settle for a beat
const SPREAD = 0.22; // spread of the shuffled order across the window
const JITTER = 0.05; // per-chip noise so the rhythm never looks metronomic

/**
 * Shuffle the chips into a random reveal order, then map that order onto a
 * short window with jitter. Neighbours in the shuffle can overlap, so several
 * chips often fire almost together — organic, not a mechanical stagger.
 */
function makeRandomDelays(count: number, reduce: boolean): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const delays = new Array<number>(count);
  order.forEach((chipIndex, rank) => {
    const t = count > 1 ? rank / (count - 1) : 0;
    const base = START_OFFSET + t * SPREAD + Math.random() * JITTER;
    delays[chipIndex] = reduce ? base * 0.5 : base;
  });
  return delays;
}

function chipTransition(delay: number, reduce: boolean): Transition {
  if (reduce) {
    // Reduced motion: no scaling, just a gentle fade.
    return { opacity: { duration: 0.2, ease: "easeOut", delay } };
  }
  return {
    transform: { ...POP_SPRING, delay },
    // Opacity is a quick tween, not a spring — a spring would overshoot past 1
    // and the chip would read as "blinking in" rather than popping.
    opacity: { duration: 0.12, ease: [0.23, 1, 0.32, 1], delay },
  };
}

export function SuggestionChips({ suggestions, onSelect }: Props) {
  const reduce = useReducedMotion() ?? false;

  // Computed once per mount: stable across re-renders, fresh on every real
  // re-entry (the page/group unmounts and mounts again).
  const [delays] = useState(() => makeRandomDelays(suggestions.length, reduce));

  return (
    <div className="search-suggestions" role="group" aria-label="پیشنهادهای جستجو">
      {suggestions.map((s, i) => (
        <motion.button
          key={s.id}
          type="button"
          className="search-chip"
          variants={reduce ? reducedChipVariants : chipVariants}
          initial="false"
          animate="true"
          transition={chipTransition(delays[i] ?? 0, reduce)}
          onClick={() => onSelect?.(s)}
        >
          <span className="search-chip__label" dir="auto">
            {s.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
