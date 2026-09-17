import { useState, useEffect } from "react"

//number of correctly popped or escaped before getting a new life added
const NEW_LIFE_THRESHOLD = 10

interface UseScoreProps {
    /** Called when bubbles cross the top edge, with how many did. */
    addLife: () => void
}

export function useScore({addLife}: UseScoreProps) {
    const [totalScore, setTotalScore] = useState<number>(0)

    const handleIncrementScore = () => {
        setTotalScore(prev => {
            const newScore = prev + 1

            return newScore
        })
    }

    useEffect(() => {
        if (totalScore % NEW_LIFE_THRESHOLD === 0){
            addLife()
        }
    },[totalScore])

    return { totalScore, handleIncrementScore }
}