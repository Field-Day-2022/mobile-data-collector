import { useAtom } from 'jotai';
import { 
  currentPageName, 
  currentFormName, 
  currentSessionData,
  notificationText, 
} from '../utils/jotai';
import { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

export default function Notification() {
  const [ currentPage, setCurrentPage ] = useAtom(currentPageName)
  const [ currentForm, setCurrentForm ] = useAtom(currentFormName)
  const [ currentData, setCurrentData ] = useAtom(currentSessionData)
  const [ notification, setNotification ] = useAtom(notificationText)

  const controls = useAnimationControls()

  // useEffect(() => {
  //   controls.start("hidden")
  // }, [])

  useEffect(() => {
    if (notification !== '') {
        controls.start("visible").then(() => controls.start("hidden")).then(() => setNotification(''))
    }
  }, [ notification ])

  const containerVariant = {
    hidden: {
      scale: 0,
      y: '-100%',
      opacity: 0,
      transition: {
        delay: 1.5,
        staggerChildren: .03,
        delayChildren: 1,
        duration: .5
      }
    },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        duration: .5,
        delayChildren: .3,
        staggerChildren: .03,
      }
    }
  }

  const letterVariant = {
    hidden: {
      opacity: 0,
      y: "100%",
    },
    visible: {
      opacity: .8,
      y: 0,
    }
  }

  return (
    <motion.div
     className='
        absolute
        bg-white/90
        z-50
        p-4
        rounded-2xl
        mt-1
      '
      variants={containerVariant}
      animate={controls}
      initial="hidden"
     >
      <motion.p>
        {/* {Array.from(notification).map((char, i) => {
          if (char.charCodeAt(0) === 32) char = "\u00A0"
          return (
            <motion.span
              key={i}
              style={{display: 'inline-block'}}
              variants={letterVariant}
            >
              {char}
            </motion.span>
          )
        })} */}
        {notification}
      </motion.p>
    </motion.div>
  )

}