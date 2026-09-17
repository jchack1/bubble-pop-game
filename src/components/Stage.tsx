import { useEffect, useState } from "react";
import { BUBBLE_COLORS } from "../constants/bubble-colors";
import { useBubbles } from "../hooks/useBubbles";
import { usePopSound } from "../hooks/usePopSound";
import { useLives } from "../hooks/useLives"
import Bubble from "./Bubble";
import ForbiddenColor from "./ForbiddenColor";
import LifeHeart from "./LifeHeart";
import GameOverFace from "./GameOverFace";
import type { BubbleColor } from "../types";
import { randomFloat } from "../utils/randomFloat";
import { useScore } from "../hooks/useScore";

/** How long a forbidden colour stays forbidden, in ms. */
const FORBIDDEN_SWAP = { min: 7000, max: 14000 }  

const randomColor = () => BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]

/**
 * Root play surface. Owns the game rules — which colour is forbidden, and what
 * a pop means. The bubble field itself is mechanical and lives in useBubbles.
 */
export default function Stage() {
    const [forbiddenColor, setForbiddenColor] = useState<BubbleColor>(randomColor)
    const [flash, setFlash] = useState(false)

    const playPop = usePopSound()

    const { lives, handleDecrementLives, handleIncrementLives } = useLives()
    const isGameOver = lives.length === 0

    const {totalScore, handleIncrementScore} = useScore({addLife: handleIncrementLives})

    const onEscape = (escapedBubbleColor: BubbleColor, forbiddenColor: BubbleColor) => {
        //if is forbidden color, you don't lose points for letting it escape
        //otherwise, lose a life
        if(forbiddenColor.id !== escapedBubbleColor.id){
            handleDecrementLives()
        }
    }
    const { bubbles, popBubble, registerNode } = useBubbles({onEscape, forbiddenColor, paused: isGameOver})

    // Rotate the forbidden colour after a random delay. Each swap schedules
    // the next one with a fresh random delay, since setInterval can only
    // repeat with the delay it was created with.
    useEffect(() => {
        if (isGameOver) return

        let timer: number

        const scheduleNext = () => {
            timer = window.setTimeout(() => {
                setForbiddenColor(prev => {
                    let next = randomColor()
                    while (next.id === prev.id) next = randomColor()
                    return next
                })
                scheduleNext()
            }, randomFloat(FORBIDDEN_SWAP.min, FORBIDDEN_SWAP.max))
        }

        scheduleNext()
        return () => window.clearTimeout(timer)
    }, [isGameOver])

    const handlePop = (id: number) => {
        if (isGameOver) return

        const popped = popBubble(id)
        if (!popped) return // already gone

        if (popped.color.id === forbiddenColor.id) {
            // Wrong colour. Lives come later; for now just the red wash.
            setFlash(true)
            handleDecrementLives()
            window.setTimeout(() => setFlash(false), 320)
            return
        } else {
            handleIncrementScore()
        }

        playPop()
    }

    return (
        <div className={`stage ${flash ? "stage-flash" : ""} ${isGameOver ? "game-over" : ""}`}>
            {isGameOver && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <GameOverFace />
                </div>
            )}
            <div className="flex justify-between p-4">
                <ForbiddenColor color={forbiddenColor} />
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 z-10">
                        {lives.map(x => (
                            <LifeHeart key={x}/>
                        ))}
                    </div>
                    <span>{totalScore}</span>
                </div>

            </div>
            {bubbles.map(bubble => (
                <Bubble
                    key={bubble.id}
                    bubble={bubble}
                    onPop={handlePop}
                    registerNode={registerNode}
                />
            ))}
        </div>
    )
}
