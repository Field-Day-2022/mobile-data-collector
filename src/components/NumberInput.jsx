export default function NumberInput({ label, value, setValue, placeholder, inputValidation, upperBound }) {
    console.log(value)
    console.log(upperBound)
    return (
        <div className="w-36 mb-2">
            <label className="label pb-0">
                <span className="label-text text-black">{label}</span>
            </label>
            <input
                onChange={(e) => {
                    let decimal;
                    if (e.target.value.includes('.')) {
                        decimal = e.target.value.split('.')[1];
                        // console.log(decimal)
                        if (e.target.value >= 0 && !isNaN(e.target.value) && decimal.length <= 1) {
                            if (inputValidation === 'vtl' && Number(e.target.value) < Number(upperBound)) {
                                console.log('there')
                                setValue(e.target.value)
                            } else if (inputValidation === undefined) {
                                setValue(e.target.value)
                            }
                        }
                    } else {
                        if (e.target.value >= 0 && !isNaN(e.target.value)) {
                            if (inputValidation === 'vtl' && Number(e.target.value) < Number(upperBound)) {
                                console.log('hello')
                                setValue(e.target.value)
                            } else if (inputValidation === undefined) {
                                setValue(e.target.value)
                            } 
                        }
                    }
                }}
                value={value}
                type="text"
                placeholder={placeholder}
                className="
          placeholder:text-gray-400
          placeholder:font-light 
          text-asu-maroon 
          input 
          bg-white/25 
          input-bordered 
          input-secondary 
          text-xl 
          w-full 
          max-w-xs"
            />
        </div>
    );
}
