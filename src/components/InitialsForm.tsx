import { ChangeEvent, KeyboardEventHandler, useState, useRef, MutableRefObject, useEffect } from "react"
import { motion, useAnimationControls } from 'framer-motion'

type Props = {
  label: String,
  setState: React.Dispatch<React.SetStateAction<string>>
}

export default function InitialsForm({ label, setState }: Props) {
  const [ firstInitial, setFirstInitial ] = useState<string>('')
  const [ middleInitial, setMiddleInitial ] = useState<string>('')
  const [ lastInitial, setLastInitial ] = useState<string>('')

  const firstInitialRef = useRef<HTMLInputElement>(null);
  const secondInitialRef = useRef<HTMLInputElement>(null);
  const thirdInitialRef = useRef<HTMLInputElement>(null);

  const labelControls = useAnimationControls();
  const firstInitialControls = useAnimationControls();
  const secondInitialControls = useAnimationControls();
  const thirdInitialControls = useAnimationControls();
  const placeholderControls = useAnimationControls();

  useEffect(() => {
    setTimeout(() => {
      labelControls.start("visible")
      firstInitialRef.current?.focus();
    }, 0)
    setTimeout(() => placeholderControls.start("visible"), 300)
  }, [])

  useEffect(() => {
    setState(firstInitial + middleInitial + lastInitial)
  }, [firstInitial, middleInitial, lastInitial])

  const className = label === "Recorder" ? 
      "absolute left-[130px] w-max"
      :
      "absolute left-[120px] w-max"

  const labelVariant = {
    hidden: { 
      opacity: 0,
      y: "100%",
     },
     visible: (i: number) => ({
      y: 0,
      opacity: .85,
      transition: {
        delay: i * .04,
      }
     }),
  }

  const placeholderVariant = {
     hidden: (i: number) => ({
      y: "-100%",
      opacity: 0,
      transition: {
        delay: i * .02
      }
     }),
     visible: (i: number) => ({
      y: 0,
      opacity: .5,
      transition: {
        delay: i * .02,
      }
     }),
  }

  const initialVariant = {
    visible: {
      y: "0%",
      opacity: 1,
    },
    hidden: {
      y: ['0%', '25%', '50%', '75%', '100%'],
      opacity: [1,  .7, .3, 0, 0],
      transition: {
        duration: .15
      }
    }
  }

  const enterFirstInitial = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === 'Backspace') {
      firstInitialControls.start("hidden")
      .then(() => {
        setFirstInitial('')
      })
    }
    if (e.code.slice(0, 3) === 'Key') {
      setFirstInitial(e.key.toLocaleUpperCase())
      placeholderControls.start("hidden")
      secondInitialRef.current?.focus()
      firstInitialControls.start("visible")
    }
  }


  const enterMiddleInitial = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === 'Backspace') {
      if (middleInitial) {
        secondInitialControls.start("hidden")
        .then(() => {
          setMiddleInitial('')
        })
      }
      else {
        firstInitialRef.current?.focus()
        placeholderControls.start("visible")
        firstInitialControls.start("hidden"
        ).then(
          () => setFirstInitial('')
        )
      }
    }
    if (e.code.slice(0, 3) === 'Key') {
      setMiddleInitial(e.key.toLocaleUpperCase())
      secondInitialControls.start("visible")
      thirdInitialRef.current?.focus()
    }
  }

  const enterLastInitial = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === 'Backspace') {
      if (lastInitial) {
        thirdInitialControls.start("hidden")
        .then(() => {
          setLastInitial('')
        })
      }
      else {
        secondInitialRef.current?.focus()
        secondInitialControls.start("hidden")
        .then(() => {
          setMiddleInitial('')
        })
      }
    }
    if (e.code.slice(0, 3) === 'Key') {
      setLastInitial(e.key.toLocaleUpperCase())
      thirdInitialControls.start("visible")
    }
  }
  
  return (
    <div 
      className="relative text-3xl border-black border-0 text-left flex justify-start">
      <motion.p className="italic">
        {`${label}: `.split("").map((char, i) => {
          if (char.charCodeAt(0) === 32) char = "\u00A0"
          return (
            <motion.span
              key={i}
              style={{display: 'inline-block'}}
              custom={i}
              initial="hidden"
              variants={labelVariant}
              animate={labelControls}
            >
              {char}
            </motion.span>
          )
        })}
      </motion.p>
      <motion.p className={className}>
        {"Initials".split("").map((char, i) => {
          if (char.charCodeAt(0) === 32) char = "\u00A0"
          return (
            <motion.span
              key={i}
              style={{display: 'inline-block'}}
              custom={i}
              initial="hidden"
              variants={placeholderVariant}
              animate={placeholderControls}
            >
              {char}
            </motion.span>
          )
        })}
      </motion.p>

      <motion.input
        value={firstInitial}
        className="w-5 outline-none bg-transparent"
        onKeyUp={enterFirstInitial}
        ref={firstInitialRef}
        readOnly
        variants={initialVariant}
        initial={{y: "100%"}}
        animate={firstInitialControls}
      />
      <motion.input 
        value={middleInitial}
        className="w-5 outline-none bg-transparent"
        onKeyUp={enterMiddleInitial}
        ref={secondInitialRef}
        readOnly
        variants={initialVariant}
        initial={{y: '100%'}}
        animate={secondInitialControls}
      />
      <motion.input 
        value={lastInitial}
        className="w-5 outline-none bg-transparent"
        onKeyUp={enterLastInitial}
        ref={thirdInitialRef}
        readOnly
        variants={initialVariant}
        initial={{y: '100%'}}
        animate={thirdInitialControls}
      />
    </div>
  )
}