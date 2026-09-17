export default function GameOverFace() {
    return (
        <svg
            viewBox="0 0 100 100"
            className="w-24 sm:w-40"
            fill="none"
            stroke="white"
            strokeWidth={4}
            strokeLinecap="round"
        >
            <circle cx="50" cy="50" r="46" />
            <circle cx="34" cy="42" r="4" fill="white" stroke="none" />
            <circle cx="66" cy="42" r="4" fill="white" stroke="none" />
            <path d="M 30 72 Q 50 54 70 72" />
        </svg>
    )
}
