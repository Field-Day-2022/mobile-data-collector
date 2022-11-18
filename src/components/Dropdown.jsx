export default function Dropdown({
  value,
  setValue,
  placeholder,
  options
}) {
  return (
    <div className="
      dropdown 
      flex
      justify-center
      mt-2"
    >
      <label
        tabIndex={0} 
        className="
          btn 
          glass 
          m-1 
          text-asu-maroon 
          text-xl 
          capitalize 
          font-medium
          "
      >{value ? `${placeholder}: ${value}` : placeholder}</label>
      <ul 
        tabIndex={0} 
        className="
          dropdown-content 
          menu
          p-2 
          shadow
          bg-gradient-radial
          from-white
          to-white/50
          rounded-box 
          text-xl
          text-asu-maroon
          ">
        {options.map((entry, index) => (
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
          ><a>{entry}</a></li>
        ))}
      </ul>
    </div>
  )
}