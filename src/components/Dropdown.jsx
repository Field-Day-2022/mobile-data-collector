export default function Dropdown({
  value,
  setValue,
  placeholder,
  options,
  toeCode
}) {
  return (
    <div className={ toeCode ? 'dropdown dropdown-top flex justify-center' : 'dropdown flex justify-center mt-2'}>
      <label
        tabIndex={0} 
        className={ toeCode ? "brightness-100 active:brightness-50 active:scale-90 transition select-none rounded-xl m-1 text-asu-gold bg-asu-maroon text-2xl p-5 capitalize font-medium" : "btn bg-white border-[1px] border-asu-maroon focus:border-asu-maroon hover:bg-white/50 m-1 text-asu-maroon text-xl capitalize font-medium"}
      >{toeCode ? placeholder : value ? `${placeholder}: ${value}` : placeholder}</label>
      <ul 
        tabIndex={0} 
        className="
          dropdown-content 
          pl-2
          pr-2 
          shadow
          bg-gradient-radial
          from-white
          to-white/90
          rounded-box 
          text-xl
          text-asu-maroon
          overflow-y-auto
          max-h-96
          border-asu-maroon
          border-[1px]
          ">
        {options.length ? options.map((entry, index) => (
          <li 
            tabIndex={0}
            onClick={() => {
              document.activeElement.blur()
              setValue(entry)
            }}
            className={
              index < options.length - 1 ? 
              'border-b-2 border-black/25' 
              : 
              ''}
            key={entry}
          ><a className="flex flex-col justify-center text-xl p-2">{entry}</a></li>
        ))
        :
        <li 
          tabIndex={0}
          onClick={() => {
            document.activeElement.blur()
          }} 
        ><a className="flex flex-col justify-center text-xl p-2">None available</a></li>   
        }
      </ul>
    </div>
  )
}