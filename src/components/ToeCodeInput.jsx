import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { currentSessionData } from '../utils/jotai'
import { db } from '../index'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function ToeCodeInput({
  toeCode,
  setToeCode,
  speciesCode,
  isRecapture
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
  
  const [ currentData, setCurrentData ] = useAtom(currentSessionData)
  
  console.log(toeCodes)

  useEffect(() => {
    const fetchToeCodes = async() => {
      const toeCodesSnapshot = await getDocs(query(
        collection(db, 'ToeClipCodes'),
        where('SiteCode', '==', currentData.site)
      ))
      setToeCodes(toeCodesSnapshot.docs[0].data())
    }
    fetchToeCodes()
  }, [])
  
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

  const generateToeCode = () => {
    for (const toeClipCode in toeCodes[currentData.array][speciesCode]) {
      if (toeClipCode.slice(0, toeCode.length) === (toeCode) &&
          toeCodes[currentData.array][speciesCode][toeClipCode] === 'date') {
        // console.log(toeClipCode, toeCodes[currentData.array][speciesCode][toeClipCode])
        setToeCode(toeClipCode)
        return
      }
    }
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

      <div className="modal modal-open">
        <div 
          className="
            modal-box 
            w-11/12 
            max-w-sm
            bg-white/90
            flex
            flex-col
            items-center
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
          <img src="./toe-clip-example-img.png" alt="example toe codes" className="w-3/4 z-0"/>
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
          <div className="flex flex-row items-center">
            {isRecapture ? 
              <div>
                {/* The button to open modal */}
                <button
                  className='
                  bg-asu-maroon
                    brightness-100
                    p-5
                    rounded-xl 
                    text-2xl 
                    capitalize 
                    text-asu-gold
                    active:brightness-50
                    active:scale-90
                    transition
                    select-none
                  '
                >
                <label htmlFor="my-modal">Recapture History</label>
                </button>

                {/* Put this part before </body> tag */}
                <input type="checkbox" id="my-modal" className="modal-toggle" />
                <div className="modal">
                  <div className="
                      modal-box 
                      w-11/12 
                      max-w-sm
                      bg-white/90
                      flex
                      flex-col
                      items-center
                      max-h-screen
                      p-1
                    ">
                    <h3 className="font-bold text-lg">Congratulations random Internet user!</h3>
                    <p className="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
                    <div className="modal-action">
                      <label htmlFor="my-modal" className="btn">Yay!</label>
                    </div>
                  </div>
                </div>
              </div>
              :
              <Button 
                prompt="Generate New"
                handler={() => generateToeCode()}
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
                `}>
              <label htmlFor="my-modal-4">Close</label>
            </button>
          </div>
        </div>
      </div>

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