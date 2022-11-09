export default function Initials({placeholder, initials, setInitials}) {
  return (
    <input 
      type="text"
      className="input input-ghost w-full max-w-xs text-xl"
      placeholder={placeholder}
      value={initials}
      onChange={e => setInitials(e.target.value.toUpperCase())}
    />
  )
}