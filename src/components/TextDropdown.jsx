import { useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

export default function TextDropdown({type, prompt, placeholder, setValue, value, inputRef}) {
  const styles = {
    short: {
      div: "form-control w-full max-w-[6rem]",
      input: "input input-secondary bg-slate-200/50 input-bordered w-full max-w-[6rem] text-xl text-secondary placeholder:text-secondary/50"
    },
    general: {
      div: "form-control w-full max-w-[10rem]",
      input: "input input-secondary bg-slate-200/50 input-bordered w-full max-w-[10rem] text-xl text-secondary placeholder:text-secondary/50"
    },
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
    initial: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: '100%',
      opacity: 1,
      transition: {
        duration: 3,
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
      <motion.input 
        maxLength={type === 'initials' ? 3 : 100} 
        value={value} 
        onChange={e => {
          setValue(e.target.value)
          if (e.target.value > 0 && type === 'dropdown') setIsOpen(true)
          else setIsOpen(false)
        }}
        type="text" 
        placeholder={placeholder} 
        className={style.input} 
      />
      <motion.ul 
        className="border-2 border-asu-maroon border-t-0 flex items-center flex-col justify-center text-asu-maroon text-xl"
        variants={{
          open: {
            opacity: 0,
          },
          closed: {
            opacity: 1,
          }
        }}>
        <li>1</li>
        <li>1</li>
        <li>1</li>
      </motion.ul>
    </motion.div>
  )
}