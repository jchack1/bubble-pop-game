import type { Bubble as BubbleData } from "../types"

interface BubbleProps {
    bubble: BubbleData
    onPop: (id: number) => void
    registerNode: (id: number, el: HTMLDivElement | null) => void
}

export default function Bubble({ bubble, onPop, registerNode }: BubbleProps) {
    const { id, color, size, x } = bubble

    return (
        <div
            ref={el => registerNode(id, el)}
            className={`bubble border ${color.borderClass} rounded-full opacity-80 ${color.class}`}
            style={{
                width: size,
                height: size,
                // Centred on its spawn x, and starting one diameter below the
                // bottom edge so it drifts into view rather than popping in.
                left: x - size / 2,
                bottom: -size,
            }}
            onPointerDown={() => onPop(id)}
        />
    )
}
