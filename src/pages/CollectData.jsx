import { useState } from 'react'

import NewData from "../forms/NewData"

export default function CollectData() {
  const [ currentData, setCurrentData ] = useState()

  return (
    <div className='flex flex-col overflow-visible items-center h-full w-11/12 bg-gradient-to-r from-slate-300/75 p-5 rounded-lg'>
      <NewData data={currentData} setData={setCurrentData} />
    </div>
  )
}