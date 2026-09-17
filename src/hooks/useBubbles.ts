import { useState, useRef, useEffect, useCallback } from "react";
import { BUBBLE_COLORS } from "../constants/bubble-colors";
import type { Bubble, BubbleMotion, BubbleColor } from "../types";

import { randomFloat } from "../utils/randomFloat";

/** Random float in [min, max). */

const SIZE = { min: 45, max: 110 }           // diameter, px
const SPEED = { min: 35, max: 120 }          // px per second
const WOBBLE_AMP = { min: 6, max: 32 }       // px of horizontal sway
const WOBBLE_FREQ = { min: 0.15, max: 0.3 } // sway cycles per second
const SPAWN_GAP = { min: 250, max: 900 }     // ms between spawns

interface UseBubblesOptions {
    /** Called when bubbles cross the top edge, with how many did. */
    onEscape?: (escapedBubbleColor: BubbleColor, forbiddenColor: BubbleColor) => void
    forbiddenColor?: BubbleColor
    /** Freezes spawning and movement in place, e.g. once the game is over. */
    paused?: boolean
}

export function useBubbles({ onEscape, forbiddenColor, paused }: UseBubblesOptions = {}) {
    const [bubbles, setBubbles] = useState<Bubble[]>([])

    // Monotonic id source. A ref, not state — bumping it must never re-render.
    const nextId = useRef(0)

    // Live positions, mutated every frame. Deliberately outside React state so
    // movement never triggers a render.
    const motion = useRef(new Map<number, BubbleMotion>())

    // id -> DOM node, so the loop can write transforms without re-rendering.
    const nodes = useRef(new Map<number, HTMLDivElement>())

    // id -> static spawn data. Mirrors the state array, but readable from
    // inside the loop without making the loop depend on a render.
    const specs = useRef(new Map<number, Bubble>())

    // Latest-ref pattern: the loop lives for the life of the component, so it
    // must not close over a callback identity that changes between renders.
    const escapeRef = useRef(onEscape)
    escapeRef.current = onEscape

    // Same latest-ref pattern: both the spawner and animation loop are
    // long-lived closures that need the current value, not the one from
    // whenever they were set up.
    const pausedRef = useRef(paused)
    pausedRef.current = paused

    const registerNode = useCallback((id: number, el: HTMLDivElement | null) => {
        if (el) nodes.current.set(id, el)
        else nodes.current.delete(id)
    }, [])

    const createBubble = useCallback(() => {
        const size = Math.round(randomFloat(SIZE.min, SIZE.max))
        const amplitude = randomFloat(WOBBLE_AMP.min, WOBBLE_AMP.max)

        // Keep the bubble fully on screen at the extremes of its sway:
        // inset by its own radius plus the wobble it will travel.
        const edge = size / 2 + amplitude

        const bubble: Bubble = {
            id: nextId.current++,
            color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
            size,
            x: randomFloat(edge, window.innerWidth - edge),
            speed: randomFloat(SPEED.min, SPEED.max),
            wobbleAmplitude: amplitude,
            wobbleFrequency: randomFloat(WOBBLE_FREQ.min, WOBBLE_FREQ.max),
            // Random start offset in the sine cycle, so bubbles spawned close
            // together don't sway in visible lockstep.
            wobblePhase: Math.random() * Math.PI * 2,
        }

        specs.current.set(bubble.id, bubble)
        motion.current.set(bubble.id, { id: bubble.id, y: 0, elapsed: 0 })
        setBubbles(prev => [...prev, bubble])
    }, [])

    /** Removes a bubble and hands back its data so the caller can judge the
     *  pop. Returns null if it was already gone (double tap, or it escaped). */
    const popBubble = useCallback((id: number): Bubble | null => {
        // Read from the spec map, not from inside a setState updater — updaters
        // run later, so anything captured in one is still null on return.
        const popped = specs.current.get(id) ?? null
        if (!popped) return null

        motion.current.delete(id)
        specs.current.delete(id)
        setBubbles(prev => prev.filter(b => b.id !== id))
        return popped
    }, [])

    // Spawner: recursive timeout rather than an interval, so each gap is its
    // own random length.
    useEffect(() => {
        let timer: number
        const tick = () => {
            // Tab backgrounded or game paused: skip this spawn, but keep the
            // chain going so spawning resumes on its own once able to again.
            if (!document.hidden && !pausedRef.current) createBubble()
            timer = window.setTimeout(tick, randomFloat(SPAWN_GAP.min, SPAWN_GAP.max))
        }
        timer = window.setTimeout(tick, 400)
        return () => window.clearTimeout(timer)
    }, [createBubble])

    // The animation loop. Set up once, never re-created.
    useEffect(() => {
        let frame: number
        let last = performance.now()

        const step = (now: number) => {
            // Seconds since the last frame. Clamped so a backgrounded tab
            // doesn't teleport every bubble off the top on return.
            const dt = Math.min((now - last) / 1000, 0.05)
            last = now

            // Paused: freeze everything in place, but keep the loop alive so
            // `last` stays current and movement resumes cleanly if unpaused.
            if (pausedRef.current) {
                frame = requestAnimationFrame(step)
                return
            }

            const height = window.innerHeight
            const escaped: number[] = []

            for (const m of motion.current.values()) {
                m.elapsed += dt

                const spec = specs.current.get(m.id)
                if (!spec) continue

                // Speed is px/second, so multiplying by dt keeps the pace
                // identical on 60Hz and 144Hz displays.
                m.y += spec.speed * dt

                if (m.y > height + spec.size) {
                    escaped.push(m.id)
                    continue
                }

                const node = nodes.current.get(m.id)
                if (!node) continue // spawned this frame, not yet mounted

                const drift = spec.wobbleAmplitude *
                    Math.sin(m.elapsed * spec.wobbleFrequency * Math.PI * 2 + spec.wobblePhase)

                node.style.transform = `translate3d(${drift}px, ${-m.y}px, 0)`
            }

            if (escaped.length) {
                for (const id of escaped) {
                    const escapedSpec = specs.current.get(id)
                    if (escapedSpec && forbiddenColor) {
                        escapeRef.current?.(escapedSpec.color, forbiddenColor)
                    }

                    motion.current.delete(id)
                    specs.current.delete(id)
                }
                // One state update for the whole frame, not one per bubble.
                setBubbles(prev => prev.filter(b => !escaped.includes(b.id)))
            }

            frame = requestAnimationFrame(step)
        }

        frame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frame)
    }, [forbiddenColor, onEscape])

    return { bubbles, popBubble, registerNode }
}
