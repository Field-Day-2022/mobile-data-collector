import { useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

export default function TextDropdown({type, prompt, placeholder, setValue, value, inputRef}) {
  const styles = {
    dropdown: {
      div: "form-control w-full max-w-[10rem]",
      input: "input input-secondary bg-slate-200/50 input-bordered w-full max-w-[10rem] text-xl text-secondary placeholder:text-secondary/50"
    },
  }

  const [ isOpen, setIsOpen ] = useState(false)

  let style
  if (type ==='initials' || type === 'short') style = styles.short
  if (type === 'dropdown') style = styles.dropdown
  else style = styles.general

  const controls = useAnimationControls()

  const dropdownVariant = {
    enter: {
      opacity: 1,
      scaleY: 1,
      y: 0,
      transition: {
        duration: .25
      },
      display: "block"
    },
    exit: {
      opacity: 0,
      scaleY: 0,
      y: -30,
      transition: {
        duration: .25,
      },
      transitionEnd: {
        display: "none"
      }
    }
  }

  return (
    <motion.div 
      className={style.div}
      initial={false}  
      animate={isOpen ? "open" : "closed"}
    >
      <motion.label className="label">
        <motion.span className="label-text text-asu-maroon">{prompt}</motion.span>
      </motion.label>
      <motion.div 
        className="flex flex-col items-center"
        onHoverStart={() => setIsOpen(true)}  
        onHoverEnd={() => setIsOpen(false)}
      >
        <input 
          type="text"
          className="input input-secondary bg-slate-200/50 input-bordered w-full max-w-[10rem] text-xl text-secondary placeholder:text-secondary/50"
        />
        <motion.div
          className="hidden bg-slate-200/50 border-asu-maroon border-[1px] rounded-lg text-asu-maroon p-3"
          initial="exit"
          animate={isOpen ? "enter" : "exit"}
          variants={dropdownVariant}
        >
          <p>item 1</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}