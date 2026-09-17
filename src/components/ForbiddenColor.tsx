import type { BubbleColor } from "../types"

interface ForbiddenColorProps {
    color: BubbleColor
}

/** The colour you must NOT pop, shown as a bubble in the top-left corner. */
export default function ForbiddenColor({ color }: ForbiddenColorProps) {
    return (
        <div className="">
            <div
                className={`w-14 h-14 rounded-full border ${color.borderClass} ${color.class} opacity-60`}
            />
        </div>
    )
}
