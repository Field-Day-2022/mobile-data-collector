import { useEffect, useState } from 'react'
import NewArthropodEntry from '../forms/NewArthropodEntry'

import NewData from "../forms/NewData"
import NewDataEntry from '../forms/NewDataEntry'

export default function CollectData() {
  const [ currentData, setCurrentData ] = useState()
  const [ currentFormName, setCurrentFormName ] = useState('New Data')

  // currentData && console.log(currentData)

  const testSessionData = {
    captureStatus: 'withCaptures',
    array: '1',
    project: 'Gateway',
    site: 'GWA1',
    handler: 'FFF',
    recorder: 'FFF',
    arthropod: [1, 2, 3, 4],
    amphibian: [1],
    lizard: [],
    mammal: [],
    snake: [1, 2, 3, 4, 5]
  }

  // useEffect(() => {
  //   if (currentData?.captureStatus &&
  //       currentData?.array &&
  //       currentData?.project &&
  //       currentData?.site &&
  //       currentData?.handler &&
  //       currentData?.recorder
  //     ) setCurrentFormName('New Data Entry')
  // }, [ currentData] )

  // for testing
  useEffect(() => {
    // setCurrentData(testSessionData)
    setCurrentFormName("New Data")
  }, [])

  const updateData = (species, data) => {
    if (species === 'arthropod') {
      setCurrentData({
        ...currentData,
        arthropod: [
          ...currentData.arthropod,
          data
        ]
      })
    }
  }
  

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
      rounded-lg'>
      <h1 className='text-4xl text-asu-maroon font-bold mt-2'>{currentFormName}</h1>
      <div className='divider mb-0 pb-0 mt-0 h-1' />
      {currentFormName === 'New Data' && 
        <NewData data={currentData} setData={setCurrentData} setForm={setCurrentFormName} />}
      {(currentFormName === 'New Data Entry' && currentData) &&
        <NewDataEntry data={currentData} setData={setCurrentData} setForm={setCurrentFormName} />}
      {(currentFormName === 'New Arthropod Entry') &&
        <NewArthropodEntry updateData={updateData} setForm={setCurrentFormName} />}
    </div>
  )
}