/* eslint-disable jsx-a11y/anchor-is-valid */
import { useAtom } from 'jotai';
import { currentPageName, currentFormName, currentSessionData } from '../utils/jotai';
import { useRef } from 'react';
import { motion, useCycle } from 'framer-motion';

export default function Navbar() {
  const [ currentPage, setCurrentPage ] = useAtom(currentPageName)
  const [ currentForm, setCurrentForm ] = useAtom(currentFormName)
  const [ currentData, setCurrentData ] = useAtom(currentSessionData)

  // https://codesandbox.io/s/framer-motion-side-menu-mx2rw?from-embed=&file=/src/Example.tsx:1027-1037
  const [ isOpen, toggleOpen] =  useCycle(false, true);

  const containerRef = useRef(null);

  const navigationContainerVariant = {
    open: {
      opacity: 1,
      left: 0,
    },
    closed: {
      opacity: 0,
      left: '-50%',
    }
  }

  const navItemVariant = {
    open: {
      opacity: 1,
      bottom: 0,
    },
    closed: {
      opacity: 0,
      bottom: '-50%',
    }
  }

  const navUlVariant = {
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  }

  return (
    <motion.nav className="text-asu-maroon relative w-screen flex flex-row items-center"
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      ref={containerRef}
    >

      <motion.div className="bg-white/90 
        rounded-tr-xl 
        rounded-br-xl 
        w-1/2 
        absolute 
        top-12 
        z-30"
        variants={navigationContainerVariant}
      >
        <motion.ul variants={navUlVariant} initial={false} animate={isOpen ? 'open' : 'closed'}>
          <motion.li
            className="text-2xl p-2 border-2 border-asu-gold brightness-90 m-2"
            variants={navItemVariant}
            onClick={() => {
              setCurrentPage('Home')
              setCurrentForm('')
              toggleOpen()
            }}
          >Home</motion.li>
          <motion.li 
            className="text-2xl p-2 border-2 border-asu-gold brightness-90 m-2"
            variants={navItemVariant}
            onClick={() => {
              setCurrentPage('Collect Data')
              if (currentData.project === '') {
                setCurrentForm('New Data')
              } else {
                setCurrentForm('New Data Entry')
              }
              toggleOpen()
            }}
          >Collect Data</motion.li>
          <motion.li 
            className="text-2xl p-2 border-2 border-asu-gold brightness-90 m-2"
            variants={navItemVariant}
            onClick={() => {
              setCurrentPage('History')
              setCurrentForm('')
              toggleOpen()
            }}
          >History</motion.li>
          <motion.li 
            className="text-2xl p-2 border-2 border-asu-gold brightness-90 m-2"
            variants={navItemVariant}
            onClick={() => {
              setCurrentPage('About Us')
              setCurrentForm('')
              toggleOpen()
            }}
          >About Us</motion.li>
        </motion.ul>
      </motion.div>

      <MenuToggle toggle={() => toggleOpen()} />

      <motion.div className="text-lg breadcrumbs ml-2 overflow-hidden">
        <ul>
          <li>{currentPage}</li>
          <li>{currentForm || ''}</li>
        </ul>
      </motion.div>

    </motion.nav>
  )
}

const Path = props => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="#8C1D40"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle }) => (
  <button onClick={toggle} className="p-2 z-30">
    <svg width="33" height="33" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" }
        }}
      />
    </svg>
  </button>
);