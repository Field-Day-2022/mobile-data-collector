import { useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

export default function TextInput({type, prompt, placeholder, setValue, value, inputRef}) {
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
  controls.start('initial')

  return (
    <div className={style.div}>
      <label className="label">
        <span className="label-text text-asu-maroon">{prompt}</span>
      </label>
      <input 
        maxLength={type === 'initials' ? 3 : 100} 
        value={value} 
        onChange={e => {
          if (type === 'initials') setValue(e.target.value.toUpperCase())
          else setValue(e.target.value)
          if (e.target.value > 0 && type === 'dropdown') controls.start("dropdownVariant") 
        }}
        type="text" 
        placeholder={placeholder} 
        className={style.input} 
      />
      {type.includes('dropdown') &&
        <motion.ul 
          animate={controls}
          variants={dropdownVariant}
          className="border-2 border-asu-maroon border-t-0 flex items-center flex-col justify-center text-asu-maroon text-xl">
          <li>1</li>
          <li>1</li>
          <li>1</li>
        </motion.ul>
      }
    </div>
  )
}