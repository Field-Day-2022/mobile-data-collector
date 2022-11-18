import { useEffect, useState } from 'react'

import NewArthropodEntry from '../forms/NewArthropodEntry'
import NewArthropodEntry2 from '../forms/NewArthropodEntry2'
import NewData from "../forms/NewData"
import NewDataEntry from '../forms/NewDataEntry'
import NewAmphibianEntry from '../forms/NewAmphibianEntry'

export default function CollectData() {
  const [ currentData, setCurrentData ] = useState({
      captureStatus: '',
      array: '',
      project: '',
      site: '',
      handler: '',
      recorder: '',
      arthropod: [],
      amphibian: [],
      lizard: [],
      mammal: [],
      snake: []
    })
  const [ currentFormName, setCurrentFormName ] = useState('New Data')

  // for testing
  const testSessionData = {
    captureStatus: 'withCaptures',
    array: '1',
    project: 'Gateway',
    site: 'GWA1',
    handler: 'FFF',
    recorder: 'FFF',
  }

  // for testing
  useEffect(() => {
    setCurrentData({...currentData, 
      project: testSessionData.project,
      array: testSessionData.array,
      site: testSessionData.site
    })
    setCurrentFormName("New Arthropod Entry")
  }, [])

  const updateData = (species, data) => {
    setCurrentData({
      ...currentData,
      [species]: [
        ...currentData[species],
        data
      ]
    })
  }

  console.log(currentData)

  return (
    <div className='
      flex 
      flex-col 
      overflow-visible 
      items-center 
      h-full
      max-h-full
      sm:w-11/12 
      w-full 
      pr-0 
      bg-gradient-to-r 
      from-slate-300/75 
      rounded-lg
      text-asu-maroon'>
      <h1 className='text-4xl text-asu-maroon font-bold mt-2'>{currentFormName}</h1>
      <div className='divider mb-0 pb-0 mt-0 h-1 bg-asu-gold/75' />
      {currentFormName === 'New Data' && 
        <NewData data={currentData} setData={setCurrentData} setForm={setCurrentFormName} />}
      {(currentFormName === 'New Data Entry' && currentData) &&
        <NewDataEntry data={currentData} setData={setCurrentData} setForm={setCurrentFormName} />}
      {(currentFormName === 'New Arthropod Entry') &&
        <NewArthropodEntry2 updateData={updateData} setForm={setCurrentFormName} />}
      {(currentFormName === 'New Amphibian Entry') &&
        <NewAmphibianEntry updateData={updateData} setForm={setCurrentFormName} />}
    </div>
  )
}