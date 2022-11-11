import { useState } from 'react'

import NewData from "../forms/NewData"

export default function CollectData() {
  const [ currentData, setCurrentData ] = useState()
  const [ currentFormName, setCurrentFormName ] = useState('New Data')

  return (
    <div className='flex flex-col overflow-visible items-center h-screen sm:w-11/12 w-full pr-0 bg-gradient-to-r from-slate-300/75 rounded-lg'>
      <h1 className='text-4xl text-asu-maroon font-bold mt-2'>{currentFormName}</h1>
      <div className='divider mb-0 pb-0 mt-0 h-1' />
      {currentFormName === 'New Data' &&
        <NewData data={currentData} setData={setCurrentData} />
      }
    </div>
  )
}