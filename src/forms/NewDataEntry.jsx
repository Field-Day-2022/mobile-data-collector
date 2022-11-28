import { useAtom } from 'jotai'
import { currentFormName, currentSessionData } from '../utils/jotai';

export default function NewDataEntry() {
  const [currentData, setCurrentData] = useAtom(currentSessionData)
  const [currentForm, setCurrentForm] = useAtom(currentFormName);


  const entryTypes = [
    'Arthropod',
    'Amphibian',
    'Lizard',
    'Mammal',
    'Snake'
  ]

  const goToForm = (formName) => {
    setCurrentForm(formName)
  }
  
  const getNumberCrittersRecorded = (critter) => {
    let count = 0;
    if (critter === 'arthropod') {
      for (const dataEntry of currentData[critter]) {
        for (const key in dataEntry.arthropodData) {
          count += Number(dataEntry.arthropodData[key])
        }
      }
    } else if 
      (
        critter === 'amphibian' ||
        critter === 'lizard'
      ) 
    {
      for (const dataEntry of currentData[critter]) {
        count++;
      }
    }
    return count
  }
  
  return (
    <div 
      
      className="
        rounded-lg 
        w-full 
        h-full
        text-center 
        form-control 
        items-center 
        justify-start 
        overflow-x-hidden 
        overflow-y-auto
        scrollbar-thin 
        scrollbar-thumb-asu-maroon 
        scrollbar-thumb-rounded-full
      ">
      <p className="text-lg">{`Project: ${currentData.project}`}</p>
      <p className="text-lg">{`Site: ${currentData.site}`}</p>
      <p className="text-lg">{`Array: ${currentData.array}`}</p>
      <div className="flex w-full justify-center">
        <div className="dropdown dropdown-bottom justify-center items-center">
          <label
            tabIndex={0} 
            className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
          >Select Form</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-gradient-radial
              from-white
              to-white/50 rounded-box text-xl">
            {entryTypes.map((entry, index) => (
              <li 
                onClick={() => {
                  document.activeElement.blur()
                  goToForm(`New ${entry} Entry`)
                }}
                className={index < entryTypes.length - 1 ? 'border-b-2 border-black/50' : ''}
                key={entry}
              ><a>{entry}</a></li>
            ))}
          </ul>
        </div>
        <label htmlFor="my-modal-6" className="btn glass m-1 text-asu-maroon capitalize text-xl font-normal">End Session</label>
      </div>
      <p className="text-xl mt-2 ">{`Number of Critters Recorded:`}</p>
      {currentData ? 
        <div className="rounded-3xl">
          <table className="table table-compact glass rounded-3xl">
            <thead className="border-b-[3px] border-slate-200">
              <tr>
                <th className="bg-transparent rounded-tl-3xl text-center">Critter</th>
                <th className="bg-transparent rounded-tr-3xl text-center">Number</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <EntryTableRow 
                entryType={'Arthropod'}
                entryNumber={getNumberCrittersRecorded('arthropod')}
              />
              <EntryTableRow 
                entryType={'Amphibian'}
                entryNumber={getNumberCrittersRecorded('amphibian')}
              />
              <EntryTableRow 
                entryType={'Lizard'}
                entryNumber={getNumberCrittersRecorded('lizard')}
              />
              <EntryTableRow 
                entryType={'Mammal'}
                entryNumber={getNumberCrittersRecorded('mammal')}
              />
              <tr>
                <td className="bg-transparent text-lg p-1 rounded-bl-3xl">{'Snake'}</td>
                <td className="bg-transparent text-lg p-1 rounded-br-3xl">{getNumberCrittersRecorded('snake')}</td>
              </tr>
            </tbody>
          </table>
        </div>
        :
        <p className="text-lg">No previous entries</p>}
        <input type="checkbox" id="my-modal-6" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-asu-gold/90">
            <h3 className="text-3xl font-normal text-asu-maroon mb-2">Are you sure?</h3>
            <p className="text-asu-maroon text-lg">This will send the session data to the server. To add to this session after clicking yes, go to the edit previous sessions screen (can only add to sessions created on that device that same day).</p>
            <div className="modal-action m-1 flex flex-col items-center">
              <label 
                htmlFor="my-modal-6" 
                onClick={() => {
                  setCurrentForm('Finish Session')
                }}
                className="btn p-2 h-min glass text-asu-maroon normal-case mb-2 font-normal text-lg">Yes, I'm done with this session</label>
              <label htmlFor="my-modal-6" className="btn p-2 h-min glass text-asu-maroon normal-case font-normal text-lg">No, I'm not finished with this session</label>
            </div>
          </div>
        </div>
    </div>
  )
}

const EntryTableRow = ({entryType, entryNumber}) => {
  return (
    <tr>
      <td className="bg-transparent text-lg p-1">{entryType}</td>
      <td className="bg-transparent text-lg p-1">{entryNumber}</td>
    </tr>
  )
}