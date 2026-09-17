/**
 * Bubble palette — 15 Tailwind hues spread around the wheel so that no two
 * are easily confused. Confusable neighbours (red/rose/pink, sky/blue) are
 * deliberately thinned out: the forbidden-colour rule only works if the
 * player can tell every colour apart at a glance, mid-flight.
 *
 * `class` is the Tailwind background utility; `hex` is the same colour for
 * gradients, shadows and canvas work where a utility class can't reach.
 */
export const BUBBLE_COLORS = [
  { id: 'red', class: 'bg-red-500', hex: '#ef4444', borderClass: 'border-red-500'  },
  { id: 'orange', class: 'bg-orange-400', hex: '#fb923c', borderClass: 'border-orange-500'  },
  { id: 'amber', class: 'bg-amber-400', hex: '#fbbf24', borderClass: 'border-amber-500'  },
  { id: 'yellow', class: 'bg-yellow-300', hex: '#fde047', borderClass: 'border-yellow-500'  },
  { id: 'lime', class: 'bg-lime-400', hex: '#a3e635', borderClass: 'border-lime-500'  },
  { id: 'green', class: 'bg-green-500', hex: '#22c55e', borderClass: 'border-green-500'  },
  { id: 'emerald', class: 'bg-emerald-400', hex: '#34d399', borderClass: 'border-emerald-500'  },
  { id: 'teal', class: 'bg-teal-400', hex: '#2dd4bf', borderClass: 'border-teal-500'  },
  { id: 'cyan', class: 'bg-cyan-400', hex: '#22d3ee', borderClass: 'border-cyan-500'  },
  { id: 'sky', class: 'bg-sky-500', hex: '#0ea5e9', borderClass: 'border-sky-500'  },
  { id: 'blue', class: 'bg-blue-500', hex: '#3b82f6', borderClass: 'border-blue-500'  },
  { id: 'indigo', class: 'bg-indigo-400', hex: '#818cf8', borderClass: 'border-indigo-500'  },
  { id: 'violet', class: 'bg-violet-400', hex: '#a78bfa', borderClass: 'border-violet-500'  },
  { id: 'fuchsia', class: 'bg-fuchsia-400', hex: '#e879f9', borderClass: 'border-fuchsia-500'  },
  { id: 'pink', class: 'bg-pink-400', hex: '#f472b6', borderClass: 'border-pink-500' },
] as const;
