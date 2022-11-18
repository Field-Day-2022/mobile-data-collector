import { useState } from 'react';

import NumberInput from '../components/NumberInput';

export default function NewAmphibianEntry({updateData, setForm}) {
  const [ speciesCode, setSpeciesCode ] = useState()
  const [ trap, setTrap ] = useState()
  const [ hdBody, setHdBody ] = useState()
  const [ mass,  setMass] = useState()
  const [ sex, setSex] = useState()
  const [ isAlive, setIsAlive ] = useState()
  const [ comments, setComments ] = useState()
  
  // hard coded values temporary
  const fenceTraps = [
    'A1', 
    'A2', 
    'A3',
    'A4',
    'A-Fence',
    'B2',
    'B3',
    'B4',
    'B-Fence',
    'C2',
    'C3',
    'C4',
    'C-Fence'
  ]
  const species = [
    'BUAL',
    'BUCD',
    'BUPU',
    'BUWU',
    'INAL',
    'SCCO',
    'UNKA'
  ]
  const sexOptions= [
    'Male',
    'Female',
    'Undefined'
  ]

  const completeCapture = () => {
    updateData('amphibian', {
      speciesCode,
      trap,
      hdBody,
      mass,
      sex,
      isAlive,
      comments
    })
    setForm('New Data Entry')
  }
  
  return (
    <div className="pb-2 scrollbar-thin 
    scrollbar-thumb-asu-maroon 
    scrollbar-thumb-rounded-full text-center form-control items-center justify-start overflow-x-hidden overflow-y-auto rounded-lg w-full h-full">
      <div className="
      dropdown 
      flex
      justify-center
      mt-2
      ">
          <label
            tabIndex={0} 
            className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
          >{speciesCode ? `Species Code: ${speciesCode}` : 'Species Code'}</label>
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
            {species.map((entry, index) => (
              <li 
                tabIndex={0}
                onClick={() => {
                  document.activeElement.blur()
                  setSpeciesCode(entry)
                }}
                className={index < species.length - 1 ? 'border-b-2 border-black/25' : ''}
                key={entry}
              ><a>{entry}</a></li>
            ))}
          </ul>
      </div>
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
              pl-2
              pr-2
              shadow
              bg-gradient-radial
              from-white
              to-white/50
              rounded-box 
              text-asu-maroon
              max-h-72
              overflow-y-auto
              w-36
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
              ><a className="flex flex-col justify-center text-xl p-2">{entry}</a></li>
            ))}
          </ul>
      </div>
      <NumberInput 
        label="HD-Body"
        setValue={value => setHdBody(value)}
        placeholder="HD-Body"
      />
      <NumberInput 
        label="Mass (g)"
        setValue={value => setMass(value)}
        placeholder="ex: 1.2"
      />
      <div className="
      dropdown 
      flex
      justify-center
      mt-2
      ">
          <label
            tabIndex={0} 
            className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
          >{sex ? `Sex : ${sex}` : 'Sex'}</label>
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
            {sexOptions.map((entry, index) => (
              <li 
                tabIndex={0}
                onClick={() => {
                  document.activeElement.blur()
                  setSex(entry)
                }}
                className={index < sexOptions.length - 1 ? 'border-b-2 border-black/25' : ''}
                key={entry}
              ><a>{entry}</a></li>
            ))}
          </ul>
      </div>
      <div className='flex flex-col justify-center items-center border-black border-0'>
        <p className="text-xl mb-1 text-asu-maroon font-normal">Alive or dead?</p>
        <div className='flex'>
          <button onClick={() => setIsAlive(true)} className='btn w-28 mr-2 glass text-asu-maroon text-xl capitalize font-medium'>Alive</button>
          <button onClick={() => setIsAlive(false)} className='btn w-28 glass text-asu-maroon text-xl capitalize font-medium'>Dead</button>
        </div>
      </div>
      <div>
        <label className="label">
          <span className="label-text text-asu-maroon">Comments</span>
        </label>
        <input onChange={(e) => setComments( e.target.value )} type="text" placeholder="Comments" className="placeholder:text-asu-maroon text-asu-maroon text-lg input bg-white/25 input-bordered input-secondary w-full max-w-xs" />
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