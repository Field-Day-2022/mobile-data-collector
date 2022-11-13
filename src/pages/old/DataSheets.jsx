import { motion, LayoutGroup } from 'framer-motion';
import { useState, useRef } from 'react';

import TextInput from '../components/TextInput';
import TextDropdown from '../components/TextDropdown'

export default function DataSheets() {
  const [currentDataSheet, setCurrentDataSheet] = useState();

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(currentDataSheet);
  }

  const siteRef = useRef()

  return (
    <motion.div
      className='flex flex-col items-start h-full w-11/12 bg-gradient-to-r from-slate-300/75 p-5 rounded-lg'
      initial={{ opacity: 0, x: '200%' }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.25 } }}
    >
    <LayoutGroup
      layout
      transition={{duration: 1}}
    >
      <h1 className='text-5xl text-black/75'>New Data Sheet</h1>
      <form onSubmit={onSubmit}>
        <TextInput
          type='initials'
          prompt='Recorder'
          placeholder='Initials'
          value={currentDataSheet?.recorder || ''}
          setValue={(initials) =>
            setCurrentDataSheet({ ...currentDataSheet, recorder: initials })
          }
        />
        <TextInput
          type='initials'
          prompt='Handler'
          placeholder='Initials'
          value={currentDataSheet?.handler || ''}
          setValue={(initials) =>
            setCurrentDataSheet({ ...currentDataSheet, handler: initials })
          }
        />
        <TextDropdown 
          type='dropdown'
          prompt='Site'
          value={currentDataSheet?.site || ''}
          setValue={(site) => 
            setCurrentDataSheet({ ...currentDataSheet, site })
          }
          inputRef={siteRef}
        />
        <motion.button layout type='submit' className='btn btn-secondary mt-5'>Submit</motion.button>
      </form>
    </LayoutGroup>
    </motion.div>
  );
}
