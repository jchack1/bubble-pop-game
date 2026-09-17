import { useMemo } from "react";
import { Howl } from "howler";
import popSrc from "../audio/pop.mp3";

/**
 * One Howl instance for the whole session. Pops overlap constantly, so the
 * sprite is played with its own id each time rather than restarted.
 */
export function usePopSound() {
    const howl = useMemo(
        () => new Howl({ src: [popSrc], volume: 0.6, pool: 12 }),
        [],
    )

    /** Slight random rate so repeated pops don't sound mechanical. */
    return () => {
        const id = howl.play()
        howl.rate(0.85 + Math.random() * 0.4, id)
    }
}
