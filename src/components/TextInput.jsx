export default function TextInput({
    prompt,
    placeholder,
    value,
    setValue,
    onChangeHandler,
    maxLength,
    error,
}) {
    return (
        <div className={error && 'border-2 border-red-600 rounded-xl my-1 px-2'}>
            <p className="text-red-600 font-bold text-left">{error}</p>
            <label className="label mb-0 pb-0">
                <span className="label-text text-lg text-black mb-0">{prompt}</span>
            </label>
            <input
                maxLength={maxLength ?? 100}
                value={value}
                onChange={(e) => {
                    setValue && setValue(e.target.value);
                    onChangeHandler && onChangeHandler(e.target.value);
                }}
                type="text"
                placeholder={placeholder}
                className="border-2 text-xl placeholder:text-gray-500 text-asu-maroon input bg-white/25 input-bordered input-secondary w-full max-w-xs mb-5"
            />
        </div>
    );
}
