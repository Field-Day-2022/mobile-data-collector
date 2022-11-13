export default function ButtonDropdown({
  placeholderText,
  selection,
  options,
  onClickHandler
}) {
  return (
    <div className="dropdown dropdown-bottom justify-center items-center">
      <label
        tabIndex={0} 
        className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
      >{selection ? `${placeholderText}: ${selection}` : `${placeholderText}`}</label>
      <ul tabIndex={0} className="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box w-28">
        {options.map(option => (
          <li 
            onClick={onClickHandler(options)}
            key={option}
          ><a>{option}</a></li>
        ))}
      </ul>
    </div>
  )
 
}