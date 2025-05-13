export default function Dropdown({ value, setValue, placeholder, options, error, clickHandler }) {
    return (
        <div
            className={
                error
                    ? 'dropdown flex flex-col items-center my-2 border-2 border-red-600 rounded-xl p-2'
                    : 'dropdown flex flex-col items-center my-2'
            }
        >
            <p className="text-red-600 font-bold">{error}</p>
            <label
                tabIndex={0}
                className={
                    'btn bg-white border-2 border-asu-maroon focus:border-asu-maroon hover:bg-white/50 m-1 text-black text-xl capitalize font-medium'
                }
            >
                {value ? `${placeholder}: ${value}` : placeholder}
            </label>
            <ul
                tabIndex={0}
                className="
          dropdown-content 
          pl-2
          pr-2 
          shadow
          bg-white
          rounded-box 
          text-xl
          text-black
          overflow-y-auto
          max-h-96
          border-asu-maroon
          border-2
          "
            >
                {options.length ? (
                    options.map((entry, index) => (
                        <li
                            tabIndex={0}
                            onClick={() => {
                                document.activeElement.blur();
                                setValue(entry);
                                clickHandler && clickHandler(entry);
                            }}
                            className={
                                index < options.length - 1 ? 'border-b-2 border-black/25' : ''
                            }
                            key={entry}
                        >
                            <a className="flex flex-col justify-center text-xl p-2">{entry}</a>
                        </li>
                    ))
                ) : (
                    <li
                        tabIndex={0}
                        onClick={() => {
                            document.activeElement.blur();
                        }}
                    >
                        <a className="flex flex-col justify-center text-xl p-2">None available</a>
                    </li>
                )}
            </ul>
        </div>
    );
}
