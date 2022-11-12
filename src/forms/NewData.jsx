import { collection, getDocsFromCache, where, query } from 'firebase/firestore'
import { useEffect, useState, useRef } from 'react'
import { db } from '../index'

export default function NewData({ data, setData }) {
  const [ currentProject, setCurrentProject ] = useState('Project')
  const [ currentSite, setCurrentSite ] = useState('Site')
  const [ currentArray, setCurrentArray ] = useState('Array')
  const [ recorder, setRecorder ] = useState('')
  const [ handler, setHandler ] = useState('')
  
  const [ sites, setSites] = useState()
  const [ arrays, setArrays ] = useState()
  
  const getSites = async (projectName) => {
    if (projectName !== currentProject) setCurrentSite('Site')
    let sitesSnapshot = null;
    if (projectName === 'Gateway') {
      sitesSnapshot = await getDocsFromCache(query(collection(db, "AnswerSet"), where("set_name", "==", "GatewaySites")))
    } else if (projectName ==="San Pedro") {
      sitesSnapshot = await getDocsFromCache(query(collection(db, "AnswerSet"), where("set_name", "==", "San PedroSites")))
    } else if (projectName ==="Virgin River") {
      sitesSnapshot = await getDocsFromCache(query(collection(db, "AnswerSet"), where("set_name", "==", "Virgin RiverSites")))
    }
    if (sitesSnapshot) {
      let tempSites = []
      for (const site of sitesSnapshot.docs[0].data().answers) {
        tempSites.push(site.primary)
      }
      setSites(tempSites)
    }
  }

  const getArrays = async (projectName, siteName) => {
    if (projectName !== currentProject ||
        siteName !== currentSite) setCurrentArray('Array')
    let arraysSnapshot = null;
    const set_name = `${projectName}${siteName}Array`
    arraysSnapshot = await getDocsFromCache(query(collection(db, "AnswerSet"), where("set_name", "==", set_name)))
    if (arraysSnapshot.docs[0]) {
      let tempArrays = []
      for (const array of arraysSnapshot.docs[0].data().answers) {
        tempArrays.push(array.primary)
      }
      setArrays(tempArrays)
    }
  }

  return (
    <div className="text-center form-control items-center justify-start overflow-x-hidden overflow-y-scroll scrollbar scrollbar-track-asu-maroon/50 scrollbar-thumb-asu-gold/75 hover:scrollbar-thumb-asu-gold scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg rounded-lg w-full h-full">
      <label className="input-group input-group-vertical justify-center m-1 w-28">
        <span className='glass text-xl text-asu-maroon justify-center'>Recorder</span>
        <input maxLength="3" type="text" placeholder="Initials" className="text-center input glass text-xl text-asu-maroon placeholder:text-black/50 tracking-widest placeholder:tracking-wide" 
          value={recorder}
          onChange={(e) => {
            if (/^[A-Za-z]+$/.test(e.target.value) || e.target.value === '') {
              setRecorder(e.target.value.toUpperCase())
            }
          }}
        />
      </label>
      <label className="input-group input-group-vertical justify-center m-1 w-28">
        <span className='glass text-xl text-asu-maroon justify-center'>Handler</span>
        <input maxLength="3" type="text" placeholder="Initials" className="text-center input glass text-xl text-asu-maroon placeholder:text-black/50 tracking-widest placeholder:tracking-wide w-full" 
          value={handler}
          onChange={(e) => {
            if (/^[A-Za-z]+$/.test(e.target.value) || e.target.value === '') {
              setHandler(e.target.value.toUpperCase())
            }
          }}
        />
      </label>
      <div className="dropdown dropdown-bottom justify-center items-center">
        <label 
          tabIndex={0} 
          className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
        >{currentProject}</label>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48">
          <li onClick={() => {
            if (currentProject !== "Gateway") { 
              setArrays(null)
              setCurrentArray("Array")
            }
            setCurrentProject("Gateway")
            getSites("Gateway")
            document.activeElement.blur()
          }}><a>Gateway</a></li>
          <li onClick={() => {
            if (currentProject !== "San Pedro") { 
              setArrays(null)
              setCurrentArray("Array")
            }
            setCurrentProject("San Pedro")
            getSites("San Pedro")
            document.activeElement.blur()
          }}><a>San Pedro</a></li>
          <li onClick={() => {
            if (currentProject !== "Virgin River") { 
              setArrays(null)
              setCurrentArray("Array")
            }
            setCurrentProject("Virgin River")
            getSites("Virgin River")
            document.activeElement.blur()
          }}><a>Virgin River</a></li>
        </ul>
      </div>
      {sites && 
        <div className="dropdown dropdown-bottom justify-center items-center">
          <label
            tabIndex={0} 
            className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
          >{currentSite !== 'Site' ? `Site ${currentSite}` : currentSite}</label>
          <ul tabIndex={0} className="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box w-28">
            {sites.map(site => (
              <li 
                onClick={() => {
                  setCurrentSite(site)
                  getArrays(currentProject, site)
                  document.activeElement.blur()
                }}
                key={site}
              ><a>{site}</a></li>
            ))}
          </ul>
        </div>
      }
      {arrays && 
        <div className="dropdown dropdown-bottom justify-center items-center">
          <label
            tabIndex={0} 
            className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
          >{currentArray !== 'Array' ? `Array ${currentArray}` : currentArray}</label>
          <ul tabIndex={0} className="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box w-28">
            {arrays.map(array => (
              <li 
                onClick={() => {
                  setCurrentArray(array)
                  document.activeElement.blur()
                }}
                key={array}
              ><a>{array}</a></li>
            ))}
          </ul>
        </div>
      }
      {currentArray !== 'Array' &&
        <div className='flex flex-col justify-center items-center border-black border-0'>
          <p className="text-xl mb-1 text-asu-maroon font-semibold">Any captures?</p>
          <div className='flex'>
            <button className='btn w-28 mr-2 glass text-asu-maroon text-xl capitalize'>Yes</button>
            <button className='btn w-28 glass text-asu-maroon text-xl capitalize'>No</button>
          </div>
        </div>
      }
    </div>
  )
}