import { motion } from 'framer-motion'
import { ChangeEvent, useEffect, useState } from 'react'

import Initials from '../components/Initials'

export default function DataSheets() {
  const [ currentDataSheet, setCurrentDataSheet ] = useState()

  console.log(currentDataSheet)
 
  // TODO: install and integrate https://react-hook-form.com/

  return (
    <motion.div layout
      className="flex flex-col items-start w-11/12 bg-gradient-to-r from-slate-300/75 p-5 rounded-lg"
      initial={{ opacity: 0, x: '200%'}}
      animate={{ opacity: 1, x: 0, transition: { duration: .25 }}}
      >
      <h1 className="text-5xl text-black/75">New Data Sheet</h1>
      <Initials 
        placeholder="Recorder initials" 
        initials={currentDataSheet?.recorder}
        setInitials={(initials) => {
          setCurrentDataSheet({...currentDataSheet, recorder: initials})
        }
      }/>
    </motion.div>
  )
}