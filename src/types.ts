import type { BUBBLE_COLORS } from './constants/bubble-colors';

/**
 * One entry from the palette. Derived from the constant rather than declared
 * by hand, so adding or removing a colour there can never drift from the type.
 */
export type BubbleColor = (typeof BUBBLE_COLORS)[number];

/** Union of just the palette ids: 'red' | 'orange' | ... Handy for comparing
 *  a bubble against the currently forbidden colour. */
export type BubbleColorId = BubbleColor['id'];

/**
 * A bubble's *identity* — everything decided once at spawn and never touched
 * again. This is what lives in React state, so it holds nothing that changes
 * per frame; that's BubbleMotion below.
 */
export interface Bubble {
  /** Monotonic counter value. Unique for the session, doubles as the React key. */
  id: number;
  color: BubbleColor;
  /** Diameter in px. Applied as an inline style, not a Tailwind size class. */
  size: number;
  /** Horizontal spawn position in px, measured to the bubble's centre from the
   *  left edge of the stage. The wobble oscillates around this. */
  x: number;
  /** Upward speed in px per second. Per-second, not per-frame, so the motion
   *  stays correct on any refresh rate once multiplied by delta time. */
  speed: number;
  /** Half-width of the horizontal sway, in px. */
  wobbleAmplitude: number;
  /** Sway cycles per second. */
  wobbleFrequency: number;
  /** Starting offset into the sway cycle, in radians, so bubbles spawned
   *  together don't drift in unison. */
  wobblePhase: number;
}

/**
 * A bubble's *live position* — mutated in place by the animation loop every
 * frame and written straight to the DOM. Deliberately kept out of React state:
 * this must never trigger a re-render.
 */
export interface BubbleMotion {
  /** Matches the Bubble.id it belongs to. */
  id: number;
  /** Distance travelled upward from the spawn line, in px. Grows over time;
   *  the bubble has escaped once this exceeds the stage height. */
  y: number;
  /** Seconds this bubble has been alive. Drives the wobble. */
  elapsed: number;
}
