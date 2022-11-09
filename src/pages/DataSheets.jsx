import { motion } from 'framer-motion'
import { ChangeEvent, useEffect, useState } from 'react'

export default function DataSheets() {
  const [ recorder, setRecorder ] = useState("")
  const [ handler, setHandler ] = useState("")
  const [ showRecorderForm, setShowRecorderForm ] = useState(false)
  const [ showHandlerForm, setShowHandlerForm ] = useState(false)

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
      <h1 className="text-5xl">New Data Sheet</h1>
        <motion.div>
          
        </motion.div>
    </motion.div>
  )
}