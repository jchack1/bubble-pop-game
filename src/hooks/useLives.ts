import { useState } from "react"
import { randomFloat } from "../utils/randomFloat"

const DEFAULT_STARTING_LIFE_COUNT = 50

const defaultStartingLives = Array.from({ length: DEFAULT_STARTING_LIFE_COUNT }, (_, index) => Math.round(randomFloat(10000000, 100000000)))

export function useLives() {
    const [lives, setLives] = useState<number[]>(defaultStartingLives)

    const handleDecrementLives = () => {
        setLives(prev => {
            const updatedLives = [...prev]

            updatedLives.pop()

            return updatedLives
        })
    }

    const handleIncrementLives = () => {
        setLives(prev => {
            const updatedLives = [...prev]

            updatedLives.push(randomFloat(10000000, 100000000))

            return updatedLives
        })
    }

    return { lives, handleDecrementLives, handleIncrementLives }
}