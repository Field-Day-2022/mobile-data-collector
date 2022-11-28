import { 
  currentSessionData,
  pastSessionData
} from "../utils/jotai"
import { useAtom } from 'jotai'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function PastSessionData () {
  const [ currentData, setCurrentData ] = useAtom(currentSessionData)
  const [ pastData, setPastData ] = useAtom(pastSessionData)
  const [ isOpen, setIsOpen ] = useState([])

  const liVariant = {
    open: {
      // position: 'relative',
      // top: 0,
      // zIndex: 10,
      // scale: 1.5
      height: '300px',
    },
    closed: {
      height: '60px',
      // scale: 1,
      // position: 'relative',
      // opacity: 1,
    }
  }

  //fffff

  useEffect(() => {
    setIsOpen(new Array(pastData.length).fill(false))
  }, [])

  console.log(isOpen)

  return (
    <motion.ul layout
      className="relative
        w-full
        flex
        flex-col
        items-center
        "
      transition={{ duration: 1 }}
    >
      {pastData.map((sessionEntry, index) => {
        const date = new Date(sessionEntry.sessionData.sessionDateTime)
        const displayDate = date.toLocaleString()
        return (
          <motion.li
            key={index}
            className="
              bg-slate-200
              p-4
              border-2
              border-asu-maroon
              m-2
              rounded-2xl
              w-5/6
              "
            variants={liVariant}
            initial={false}
            animate={(isOpen[index]) ? 'open' : 'closed'}
            onClick={() => {
              console.log(index)
              let array = [...isOpen];
              array[index] = !isOpen[index]
              setIsOpen(array)
            }}
            custom={index}
          >
            {displayDate}
          </motion.li>
        )}
      )}
    </motion.ul>
  )
}