import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { currentSessionData } from '../utils/jotai'
import { db } from '../index'
import { collection, getDocFromCache, getDocs, getDocsFromCache, query, where, doc, getDocsFromServer } from 'firebase/firestore'
import Dropdown from './Dropdown'
import { motion, useAnimationControls } from 'framer-motion'
import SingleCheckbox from './SingleCheckbox'

export default function ToeCodeInput({
  toeCode,
  setToeCode,
  speciesCode,
  isRecapture,
  setIsRecapture,
  setUpdatedToeCodes
}) {
  const [ selected, setSelected ] = useState({
    a: false,
    b: false,
    c: false,
    d: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  })
  const [ toeCodes, setToeCodes ] = useState()
  const [ preexistingToeClipCodes,
          setPreexistingToeClipCodes ] = useState([]) 
  const [ errorMsg, setErrorMsg ] = useState()
  const [ isValid, setIsValid ] = useState(false)

  const [ currentData, setCurrentData ] = useAtom(currentSessionData)

  const errorMsgControls = useAnimationControls()
  
  // console.log(toeCodes)

  // console.log(preexistingToeClipCodes)

  useEffect(() => {
    const fetchToeCodes = async() => {
      let toeCodesSnapshot
      try {
        toeCodesSnapshot = await getDocFromCache(doc(db, "TestToeClipCodes", currentData.site))
        console.log("getting toe codes from test")
        setToeCodes(toeCodesSnapshot.data())
      } catch (e) {
        console.log("getting toe codes from live")
        toeCodesSnapshot = await getDocsFromCache(query(
          collection(db, 'ToeClipCodes'),
          where('SiteCode', '==', currentData.site)
        ))
        // TODO: fix error where toeCodes is undefined at first
        setToeCodes(toeCodesSnapshot.docs[0].data())
        console.log(currentData.site)
        console.log(toeCodes)
      }
      // let toeCodesSnapshot = await getDocFromCache(doc(db, "TestToeClipCodes", currentData.site))
      // if (toeCodesSnapshot) {
      //   console.log("from test")
      //   setToeCodes(toeCodesSnapshot.data())
      // }
      // else {
      //   console.log("from live")
      //   toeCodesSnapshot = await getDocsFromCache(query(
      //     collection(db, 'ToeClipCodes'),
      //     where('SiteCode', '==', currentData.site)
      //   ))
      //   setToeCodes(toeCodesSnapshot.docs[0].data())
      // }
    }
    fetchToeCodes()
  }, [])

  useEffect(() => {
    if (toeCodes) {
      setPreexistingToeClipCodes([])
      for (const toeClipCode in toeCodes[currentData.array][speciesCode]) {
        if (toeCodes[currentData.array][speciesCode][toeClipCode] !== 'date' &&
            toeClipCode !== 'SpeciesCode' &&
            toeClipCode !== 'ArrayCode' &&
            toeClipCode !== 'SiteCode') {
          setPreexistingToeClipCodes(preexistingToeClipCodes => [...preexistingToeClipCodes, toeClipCode ])
          // console.log(toeClipCode)
        }
      }
    }
  }, [speciesCode, toeCodes])

  useEffect(() => {
    checkToeCodeValidity()
  }, [ toeCode, isRecapture ])

  const errorMsgVariant = {
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: .5,
        type: 'spring'
      }
    },
    hidden: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: .5,
        type: 'spring',
        delay: 2
      }
    }
  }

  const triggerErrorMsgAnimation = async (msg) => {
    setErrorMsg(msg)
    await errorMsgControls.start("visible")
    await errorMsgControls.start("hidden")
  }
  
  const letters = ['A', 'B', 'C', 'D']
  const numbers = [1, 2, 3, 4, 5]

  const formattedToeCodes = 
    toeCode ?  
    toeCode.split('').reduce((total, current, index, array) => {
      if (index % 2 && index < array.length - 1) {
        return `${total}${current}-`
      } else {
        return `${total}${current}`
      }
    })
    :
    ''

  const generateNewToeCode = () => {
    for (const toeClipCode in toeCodes[currentData.array][speciesCode]) {
      if ( toeClipCode.slice(0, toeCode.length) === (toeCode) &&
          toeCodes[currentData.array][speciesCode][toeClipCode] === 'date') {
        // console.log(toeClipCode, toeCodes[currentData.array][speciesCode][toeClipCode])
        setToeCode(toeClipCode)
        setSelected({
          a: false,
          b: false,
          c: false,
          d: false,
          1: false,
          2: false,
          3: false,
          4: false,
          5: false
        })
        return
      }
    }
  }

  const checkToeCodeValidity = () => {
    if (toeCode.length < 2) {
      setIsValid(false)
      setErrorMsg('Toe Clip Code needs to be at least 2 characters long')
    } else if (toeCode.length % 2) {
      setIsValid(false)
      setErrorMsg('Toe Clip Code must have an even number of characters')
    } else {
      if (isRecapture) {
        if (preexistingToeClipCodes.includes(toeCode)) {
          setIsValid(true)
        } else {
          setErrorMsg('Toe Clip Code is not previously recorded, please uncheck the recapture box to record a new entry')
          setIsValid(false)    
        }
      } else {
        if (preexistingToeClipCodes.includes(toeCode)) {
          setErrorMsg('Toe Clip Code is already taken, choose another or check recapture box to record a recapture')
          setIsValid(false)
        } else {
          setIsValid(true)
        }
      }
    } 
  }

  const generateToeCodesObj = () => {
    let updatedToeCodeObject = toeCodes
    updatedToeCodeObject[currentData.array][speciesCode][toeCode] = Date.now()
    // console.log(updatedToeCodeObject)
    setUpdatedToeCodes(updatedToeCodeObject)
  }

  const handleClick = (source) => {
    if (source !== 'backspace' && toeCode.length !== 8) {
      if (Number(source)) {
        if (!Number(toeCode.charAt(toeCode.length - 1))) {
          setToeCode(`${toeCode}${source}`)
          setSelected({
            a: false,
            b: false,
            c: false,
            d: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false
          })
        }
      } else {
        if (Number(toeCode.charAt(toeCode.length - 1)) || toeCode.length === 0) {
          // console.log("letter pressed")
          if (toeCode.length >= 2 && source <= toeCode.charAt(toeCode.length - 2)) {
            triggerErrorMsgAnimation(source < toeCode.charAt(toeCode.length - 2) ? 
              'Error: Letters must be in alphabetical order'
              :
              'Error: Can only clip one toe per foot')
            return;
          } 
          setToeCode(`${toeCode}${source}`)
          setSelected({...selected, [source]: !selected[source]})
        }
      } 
    } else if (source === 'backspace') {
      setToeCode(toeCode.substring(0, toeCode.length - 1))
      setSelected({
        a: false,
        b: false,
        c: false,
        d: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
      })
      if (!Number(toeCode.charAt(toeCode.length - 2)) && toeCode.charAt(toeCode.length - 2)) {
        setSelected({...selected, [toeCode.charAt(toeCode.length - 2)]: true})
      }
    }
  }

  return (
    <div>
      <label 
        htmlFor="my-modal-4"
        className="
          btn
          capitalize
          text-xl
          text-asu-maroon
          bg-white/25
          border-none
          font-normal
          hover:bg-white/50
          "
      >{toeCode ? `Toe-Clip Code: ${toeCode}` : 'Toe-Clip Code'}</label>
      <input type="checkbox" id="my-modal-4" 
        className="
          modal-toggle
          "   
      />

      <motion.div className="modal ">
        <div 
          className="
            modal-box 
            w-11/12 
            max-w-sm
            bg-white/90
            flex
            flex-col
            items-center
            min-h-screen
            max-h-screen
            p-1
            "
          >
          <div className="flex flex-row">
            <div className="flex flex-col">
              <p className="text-sm">Toe-Clip Code:</p>
              <p className="text-xl">{formattedToeCodes}</p>
            </div>
          </div>
          <div className="w-3/4 relative">
            <img src="./toe-clip-example-img.png" alt="example toe codes" className="w-full z-0"/>
            <div className="absolute bottom-0 w-1/2 right-0">
              <SingleCheckbox 
                prompt="Is it a recapture?"
                value={isRecapture}
                setValue={setIsRecapture}
              />
            </div>
          </div>
          <div className="flex w-full justify-evenly items-center">
            {letters.map(letter => (
              <Button 
                key={letter}
                prompt={letter}
                handler={() => handleClick(letter)}
                isSelected={selected[letter]}
              />
            ))}
            <div className='
              bg-asu-maroon 
                rounded-xl
                brightness-100
                text-2xl 
                capitalize 
                text-asu-gold
                z-10
                active:brightness-50
                active:scale-90
                transition
                '
              onClick={() => handleClick('backspace')}
            >
            <svg height="72" width="50" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="nonzero" d="M 355.684 68.486 C 359.156 65.197 359.172 59.835 355.716 56.523 C 352.273 53.211 346.62 53.197 343.159 56.493 L 144.317 244.006 C 140.845 247.295 140.828 252.657 144.284 255.969 L 343.159 443.513 C 346.631 446.802 352.26 446.787 355.716 443.475 C 359.172 440.163 359.156 434.809 355.684 431.52 L 163.201 250.003 L 355.684 68.486 Z" fill="rgb(255, 198, 39)" paintOrder="fill" strokeMiterlimit={"11"}  />
            </svg>
            </div>
          </div>
          <div className="flex mt-2 w-full justify-evenly">
            {numbers.map(number => (
              <Button 
                key={number}
                prompt={number}
                handler={() => handleClick(number)}
                isSelected={selected[number]}
              />
            ))}
          </div>
          <div className="flex flex-row items-center ">
            {isRecapture && toeCodes ? 
              <Dropdown 
                toeCode
                value={toeCode}
                setValue={setToeCode}
                placeholder="History"
                options={preexistingToeClipCodes}
              />
              :
              <Button 
                prompt="Generate New"
                handler={() => generateNewToeCode()}
              />
            }
            <button
              className={`
                bg-asu-maroon
                brightness-100
                p-5
                rounded-xl 
                text-2xl 
                capitalize 
                text-asu-gold
                z-10
                m-1
                active:brightness-50
                active:scale-90
                transition
                select-none
                `}
                >
              {isValid ? 
                <label htmlFor="my-modal-4"
                  onClick={() => generateToeCodesObj()}
                >Close</label>
                :
                <p onClick={() => triggerErrorMsgAnimation(errorMsg)}>Close</p>
              }
            </button>
          </div>
        </div>
        <motion.div className="toast toast-top left-0 w-full"
          animate={errorMsgControls}
          variants={errorMsgVariant}
          initial="hidden"
        >
          <div className='alert bg-red-800/90 text-white text-xl'>
            <div>
              <span>{errorMsg}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      
    </div>
  )
}

function Button({prompt, handler, isSelected}) {
  return (
    <button
      className={
        isSelected ? 
        `
        bg-asu-maroon
        brightness-50
        p-5
        rounded-xl 
        text-2xl 
        capitalize 
        text-asu-gold
        z-10
        m-1
        active:brightness-50
        active:scale-90
        transition
        select-none
        `
        :
        `
        bg-asu-maroon
        brightness-100
        p-5
        rounded-xl 
        text-2xl 
        capitalize 
        text-asu-gold
        z-10
        m-1
        active:brightness-50
        active:scale-90
        transition
        select-none
        `
      }
        
      onClick={handler}
    >
      {prompt}
    </button>
  )
}