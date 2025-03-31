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
    const createInputValidator = (value, upperBound) => {
        const obj = {};
        obj.generalValidation = value >= 0 && !isNaN(value);
        obj.oneDecimalPlaceMax =
            (value.includes('.') && value.split('.')[1].length <= 1) || !value.includes('.');
        obj.upperBound = Number(value) <= Number(upperBound);
        obj.integerOnly = !value.includes('.');
        return obj;
    };

    return (
        <div className={error ? 'w-36 my-2 border-2 border-red-600 p-2 rounded-xl' : 'w-36 my-2'}>
            <p className="text-red-600 font-bold">{error}</p>
            <label className="label pb-0 mt-0 pt-0">
                <span className="label-text text-black">{label}</span>
            </label>
            <input
                disabled={isDisabled}
                onChange={(e) => {
                    const value = e.target.value;
                    const inputValidator = createInputValidator(value, upperBound);
                    if (inputValidator.generalValidation) {
                        if (
                            (inputValidation === 'mass' || inputValidation === 'oneDecimalPlace') &&
                            inputValidator.oneDecimalPlaceMax
                        )
                            setValue(value);
                        else if (
                            inputValidation === 'vtl' &&
                            inputValidator.upperBound &&
                            inputValidator.integerOnly
                        )
                            setValue(value);
                        else if (inputValidation === undefined && inputValidator.integerOnly)
                            setValue(value);
                    }
                }}
                step={
                    inputValidation === 'oneDecimalPlace' || inputValidation === 'mass' ? '.1' : '1'
                }
                value={value ?? ''}
                type={value === 'N/A' ? 'text' : 'number'}
                inputMode={
                    inputValidation === 'oneDecimalPlace' || inputValidation === 'mass'
                        ? 'decimal'
                        : 'numeric'
                }
                pattern="[0-9]*"
                placeholder={placeholder}
                className="border-2 placeholder:text-gray-400 placeholder:font-light  text-black  input  bg-white/25  input-bordered  input-secondary  text-xl  w-full  max-w-xs disabled:bg-gray-600"
            />
        </div>
    );
}
