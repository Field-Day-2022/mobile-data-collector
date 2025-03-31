export default function Button({
    className = 'text-xl font-semibold px-6 py-2 border-2 border-asu-maroon rounded-lg my-2 active:scale-90 transition',
    prompt,
    clickHandler,
}) {
    return (
        <button className={className} onClick={() => clickHandler()}>
            {prompt}
        </button>
    );
}
