import { motion } from 'framer-motion'
import { ChangeEvent, useEffect, useState } from 'react'
import InitialsForm from './components/InitialsForm'

export default function DataSheets() {
  const [ recorder, setRecorder ] = useState<string>("")
  const [ handler, setHandler ] = useState<string>("")
  const [ showRecorderForm, setShowRecorderForm ] = useState<boolean>(false)
  const [ showHandlerForm, setShowHandlerForm ] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => setShowRecorderForm(true), 1000)
  }, [])

  useEffect(() => {
    if (recorder.length === 3) {
      setShowHandlerForm(true)
    }
  }, [recorder])

  return (
    <motion.div layout
      className="flex flex-col items-start w-11/12 bg-gradient-to-r from-slate-300/75 p-5 rounded-lg"
      initial={{ opacity: 0, x: '200%'}}
      animate={{ opacity: 1, x: 0, transition: { duration: 1 }}}
      transition={{ duration: .25 }}
      >
      <h1 className="text-5xl mb-2">New Data Sheet</h1>
        <motion.div>
        {showRecorderForm && 
        <InitialsForm 
          label="Recorder" 
          setState={setRecorder}
        />}
        {showHandlerForm && 
        <InitialsForm 
          label="Handler"
          setState={setHandler}
        />}
      </motion.div>
    </motion.div>
  )
}