export default function NumberInput({
    label,
    value,
    setValue,
    placeholder,
    inputValidation,
    upperBound,
    error,
    isDisabled,
}) {
    return (
        <div className={error ? 'w-36 my-2 border-2 border-red-600 p-2 rounded-xl' : 'w-36 mb-2'}>
            <p className='text-red-600 font-bold'>{error}</p>
            <label className="label pb-0 mt-0 pt-0">
                <span className="label-text text-black">{label}</span>
            </label>
            <input
                disabled={isDisabled}
                onChange={(e) => {
                    let decimal;
                    if (e.target.value.includes('.')) {
                        decimal = e.target.value.split('.')[1];
                        // console.log(decimal)
                        if (e.target.value >= 0 && !isNaN(e.target.value) && decimal.length <= 1) {
                            if (
                                inputValidation === 'vtl' &&
                                Number(e.target.value) <= Number(upperBound)
                            ) {
                                setValue(e.target.value);
                            } else if (inputValidation === undefined) {
                                setValue(e.target.value);
                            }
                        }
                    } else {
                        if (e.target.value >= 0 && !isNaN(e.target.value)) {
                            if (
                                inputValidation === 'vtl' &&
                                Number(e.target.value) <= Number(upperBound)
                            ) {
                                setValue(e.target.value);
                            } else if (inputValidation === undefined) {
                                setValue(e.target.value);
                            }
                        }
                    }
                }}
                value={value ?? ''}
                type="text"
                placeholder={placeholder}
                className="placeholder:text-gray-400 placeholder:font-light  text-black  input  bg-white/25  input-bordered  input-secondary  text-xl  w-full  max-w-xs disabled:bg-gray-600"
            />
        </div>
    );
}
