import { useState } from 'react'

export default function NewArthropodEntry({ updateDate, setForm }) {
  const [ trap, setTrap ] = useState()
  
  const fenceTraps = ['A4', 'B4', 'C4']
  
  return (
    <div className="text-center form-control items-center justify-start overflow-x-hidden overflow-y-scroll scrollbar scrollbar-track-asu-maroon/50 scrollbar-thumb-asu-gold/75 hover:scrollbar-thumb-asu-gold scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg rounded-lg w-full h-full">
     <div className="
      dropdown 
      dropdown-bottom 
      flex
      justify-center
      ">
          <label
            tabIndex={0} 
            className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
          >{trap ? `Fence Trap: ${trap}` : 'Fence Trap'}</label>
          <ul 
            tabIndex={0} 
            className="
              dropdown-content 
              menu
              p-2 
              shadow
              bg-transparent/5 
              rounded-box 
              text-xl
              text-asu-maroon
              ">
            {fenceTraps.map((entry, index) => (
              <li 
                tabIndex={0}
                onClick={() => {
                  document.activeElement.blur()
                  setTrap(entry)
                }}
                className={index < fenceTraps.length - 1 ? 'border-b-2 border-black/25' : ''}
                key={entry}
              ><a>{entry}</a></li>
            ))}
          </ul>
        </div>
    </div>
  )
}

