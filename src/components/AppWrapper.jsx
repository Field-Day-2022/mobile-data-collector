export default function AppWrapper ({ children }) {
  return (
    <div
      className="
      font-openSans 
      overflow-hidden 
      absolute 
      flex 
      flex-col 
      items-center 
      text-center 
      justify-start 
      inset-0 
      bg-gradient-to-tr 
      from-asu-maroon 
      to-asu-gold
      "
    >{children}</div>
  )
}