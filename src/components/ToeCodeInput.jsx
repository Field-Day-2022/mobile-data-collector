import { useState } from 'react'

export default function ToeCodeInput({
  toeCode,
  setToeCode
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

  const letters = ['A', 'B', 'C', 'D']
  const numbers = [1, 2, 3, 4, 5]

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
          modal-toggle"   
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
            "
          >
          <p className="text-xl">{toeCode ? `Toe-Clip Code: ${toeCode}` : 'Toe-Clip Code'}</p>
          <img src="./toe-clip-example-img.png" alt="example toe codes" className="w-5/6 z-0"/>
          <div className="flex w-full justify-evenly items-center">
            {letters.map(letter => (
              <Button 
                key={letter}
                prompt={letter}
                handler={() => setSelected({...selected, [letter]: !selected[letter]})}
                isSelected={selected[letter]}
              />
            ))}
            <div className='bg-asu-maroon rounded-xl'>
            <svg height="72" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="nonzero" d="M 355.684 68.486 C 359.156 65.197 359.172 59.835 355.716 56.523 C 352.273 53.211 346.62 53.197 343.159 56.493 L 144.317 244.006 C 140.845 247.295 140.828 252.657 144.284 255.969 L 343.159 443.513 C 346.631 446.802 352.26 446.787 355.716 443.475 C 359.172 440.163 359.156 434.809 355.684 431.52 L 163.201 250.003 L 355.684 68.486 Z" fill="rgb(255, 198, 39)" paintOrder="fill" strokeMiterlimit={"11"}  />
            </svg>
            </div>
          </div>
          <div className="flex mt-2 w-full justify-evenly">
            {numbers.map(number => (
              <Button 
                key={number}
                prompt={number}
                handler={() => setSelected({...selected, [number]: !selected[number]})}
                isSelected={selected[number]}
              />
            ))}
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
        `bg-asu-maroon
        brightness-50
        p-5
        rounded-xl 
        text-2xl 
        capitalize 
        text-asu-gold
        z-10
        m-1
        `
        :
        `bg-asu-maroon
        brightness-100
        p-5
        rounded-xl 
        text-2xl 
        capitalize 
        text-asu-gold
        z-10
        m-1
        `
      }
        
      onClick={handler}
    >
      {prompt}
    </button>
  )
}