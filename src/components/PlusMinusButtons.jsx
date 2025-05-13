export default function PlusMinusButtons({ children, onNumberChange }) {
    return (
        <div className="flex flex-row items-center">
            <svg
                xmlns="https://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                shapeRendering="crispEdges"
                className="p-2 w-14 h-16 stroke-asu-maroon bg-black/0"
                onClick={() => onNumberChange(-1)}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
            {children}
            <svg
                xmlns="https://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                shapeRendering="crispEdges"
                stroke="currentColor"
                className="p-2 w-14 h-16 stroke-asu-maroon bg-black/0"
                onClick={() => onNumberChange(1)}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </div>
    );
}
