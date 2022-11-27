/* eslint-disable jsx-a11y/anchor-is-valid */
import { useAtom } from 'jotai';
import { currentPageName, currentFormName } from '../utils/jotai';
import { useState } from 'react';

export default function Navbar() {
  const [ currentPage, setCurrentPage ] = useAtom(currentPageName)
  const [ currentForm ] = useAtom(currentFormName)
  const [ open, setOpen ] = useState()

  return (
    <div className="text-asu-maroon relative w-screen flex">
      
      <label tabIndex={0} className="btn swap swap-rotate bg-transparent border-0">
        <input type="checkbox" />
        <svg className="swap-off fill-asu-maroon bg-transparent" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
        <svg className="swap-on fill-asu-maroon bg-transparent" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
      </label>

      {open && <ul className='menu absolute left-0 bg-white/90 top-12 rounded-lg p-2 text-xl z-20 text-left'>
        <li className=''>Home</li>
        <li className='pt-5'>New Session</li>
        <li className='pt-5'>Previous Sessions</li>
      </ul>}

    </div>
  )
}