import { m } from 'framer-motion'
import { useState } from 'react'

export default function NewArthropodEntry({ updateData, setForm }) {
  const [ trap, setTrap ] = useState()
  const [ predator, setPredator ] = useState(false)
  const [ arthropodData, setArthropodData ] = useState()

  const fenceTraps = ['A4', 'B4', 'C4']

  const species = [
    'ARAN',
    'AUCH',
    'BLAT',
    'CHIL',
    'COLE',
    'CRUS',
    'DERM',
    'DIEL',
    'DIPT',
    'HETE',
    'HYMA',
    'HTMB',
    'LEPI',
    'MANT',
    'ORTH',
    'PSEU',
    'SCOR',
    'SOLI',
    'THYS',
    'UNKI',
    'MICRO'
  ]

  const completeCapture = () => {
    updateData('arthropod', {
      trap,
      predator,
      arthropodData
    })
    setForm('New Data Entry')
  }
  
  return (
    <div className="pb-2 text-center form-control items-center justify-start overflow-x-hidden overflow-y-scroll rounded-lg w-full h-full">
     <div className="
      dropdown 
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
              bg-transparent
              backdrop-blur
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
      <label className="label cursor-pointer">
        <span className="label-text text-xl text-asu-maroon mr-2">Predator?</span>
        <input onClick={() => setPredator(!predator)} type="checkbox" className='checkbox checkbox-secondary' />
      </label>
      {species.map(item => (
        <NumberInput 
          key={item}
          label={item}
          setValue={value => setArthropodData({...arthropodData, [item]: value})}
        />
      ))}
      <div>
        <label className="label">
          <span className="label-text text-asu-maroon">Comments</span>
        </label>
        <input onChange={(e) => setArthropodData({...arthropodData, "comments": e.target.value})} type="text" placeholder="Comments" className="placeholder:text-asu-maroon text-asu-maroon  input bg-white/25 input-bordered input-secondary w-full max-w-xs" />
      </div>
      <button 
        className='btn btn-wide btn-secondary mt-2 text-xl capitalize text-asu-gold'
        onClick={() => completeCapture()}  
      >
        Finished
      </button>
    </div>
  )
}

const NumberInput = ({ label, setValue }) => {
  return (
    <div>
      <label className="label">
        <span className="label-text text-asu-maroon">{label}</span>
      </label>
      <input onChange={(e) => e.target.value > 0 && setValue(e.target.value)} type="text" placeholder="# of Critters (0 if blank)" className="placeholder:text-asu-maroon text-asu-maroon  input bg-white/25 input-bordered input-secondary w-full max-w-xs" />
    </div>
  )
}