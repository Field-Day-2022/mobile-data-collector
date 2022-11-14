export default function NewDataEntry({data, setData}) {


  const entryTypes = [
    'Arthropod',
    'Amphibian',
    'Lizard',
    'Mammal',
    'Snake'
  ]
  
  
  return (
    <div className="
      rounded-lg 
      w-full 
      h-full
      text-center 
      form-control 
      items-center 
      justify-start 
      overflow-x-hidden 
      overflow-y-scroll 
      scrollbar 
      scrollbar-track-asu-maroon/50 
      scrollbar-thumb-asu-gold/75 
      hover:scrollbar-thumb-asu-gold 
      scrollbar-thumb-rounded-lg 
      scrollbar-track-rounded-lg 
    ">
      <p className="text-lg">{`Project: ${data.project}`}</p>
      <p className="text-lg">{`Site: ${data.site}`}</p>
      <p className="text-lg">{`Array: ${data.array}`}</p>
      <div className="flex w-full justify-center">
        <div className="dropdown dropdown-bottom justify-center items-center">
          <label
            tabIndex={0} 
            className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
          >Select Form</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box text-xl">
            {entryTypes.map((entry, index) => (
              <li 
                onClick={() => {
                  document.activeElement.blur()
                }}
                className={index < entryTypes.length - 1 ? 'border-b-2 border-black/50' : ''}
                key={entry}
              ><a>{entry}</a></li>
            ))}
          </ul>
        </div>
        <label htmlFor="my-modal-6" className="btn glass m-1 text-asu-maroon capitalize text-xl font-normal">End Session</label>
      </div>
      <p className="text-xl mt-2 ">{`Number of Previous Entries:`}</p>
      {data ? 
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
                entryNumber={data.arthropod?.length || 0}
              />
              <EntryTableRow 
                entryType={'Amphibian'}
                entryNumber={data.amphibian?.length || 0}
              />
              <EntryTableRow 
                entryType={'Lizard'}
                entryNumber={data.lizard?.length || 0}
              />
              <EntryTableRow 
                entryType={'Mammal'}
                entryNumber={data.mammal?.length || 0}
              />
              <tr>
                <td className="bg-transparent text-lg p-1 rounded-bl-3xl">{'Snake'}</td>
                <td className="bg-transparent text-lg p-1 rounded-br-3xl">{data.snake?.length || 0}</td>
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
                  // TODO: send data to remote, navigate to "Home"
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