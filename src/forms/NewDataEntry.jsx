export default function NewDataEntry({data, setData}) {


  const entryTypes = [
    'Arthropod',
    'Amphibian',
    'Lizard',
    'Mammal',
    'Snake'
  ]
  
  
  return (
    <div className="text-center form-control items-center justify-start overflow-x-hidden overflow-y-scroll scrollbar scrollbar-track-asu-maroon/50 scrollbar-thumb-asu-gold/75 hover:scrollbar-thumb-asu-gold scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg rounded-lg w-full h-full">
      <p className="text-xl">{`Project: ${data.project}`}</p>
      <p className="text-xl">{`Site: ${data.site}`}</p>
      <p className="text-xl">{`Array: ${data.array}`}</p>
      <p className="text-xl mt-2 ">{`Number of Previous Entries:`}</p>
      <div className="dropdown dropdown-bottom justify-center items-center">
          <label
            tabIndex={0} 
            className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
          >Select Form</label>
          <ul tabIndex={0} className="dropdown-content menu shadow bg-base-100 rounded-box text-xl">
            {entryTypes.map((entry, index) => (
              <li 
                onClick={() => {
                  document.activeElement.blur()
                }}
                className={index < entryTypes.length - 1 && 'border-b-2 border-black/50'}
                key={entry}
              ><a>{entry}</a></li>
            ))}
          </ul>
        </div>
      {data.entries ? 
        <div className="rounded-3xl">
          <table className="table table-compact glass rounded-3xl">
            <thead className="border-b-[3px] border-slate-200">
              <tr>
                <th className="bg-transparent rounded-tl-3xl">Entry Type</th>
                <th className="bg-transparent rounded-tr-3xl">Number</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <EntryTableRow 
                entryType={'Arthropod'}
                entryNumber={data.entries.arthropod?.length || 0}
              />
              <EntryTableRow 
                entryType={'Amphibian'}
                entryNumber={data.entries.amphibian?.length || 0}
              />
              <EntryTableRow 
                entryType={'Lizard'}
                entryNumber={data.entries.lizard?.length || 0}
              />
              <EntryTableRow 
                entryType={'Mammal'}
                entryNumber={data.entries.mammal?.length || 0}
              />
              <tr>
                <td className="bg-transparent text-lg p-1 rounded-bl-3xl">{'Snake'}</td>
                <td className="bg-transparent text-lg p-1 rounded-br-3xl">{data.entries.snake?.length || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
        :
        <p className="text-lg">No previous entries</p>}
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