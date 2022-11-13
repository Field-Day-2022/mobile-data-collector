export default function NewDataEntry({data, setData}) {
  return (
    <div className="text-center form-control items-center justify-start overflow-x-hidden overflow-y-scroll scrollbar scrollbar-track-asu-maroon/50 scrollbar-thumb-asu-gold/75 hover:scrollbar-thumb-asu-gold scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg rounded-lg w-full h-full">
      <p className="text-xl">{`Project: ${data.project}`}</p>
      <p className="text-xl">{`Site: ${data.site}`}</p>
      <p className="text-xl">{`Array: ${data.array}`}</p>
      <p className="text-xl">{`Number of Previous Entries:`}</p>
      {data.entries ? 
        <div>
          <table className="table">
            <thead className="border-b-[3px] border-slate-200">
              <tr>
                <th className="bg-white/25 rounded-tl-2xl">Entry Type</th>
                <th className="bg-white/25 rounded-to-2xl">Number</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td className="bg-white/25">Arthropod</td>
                <td className="bg-white/25">{data.entries.arthropod?.length || 0}</td>
              </tr>
              <tr>
                <td className="bg-white/25">Amphibian</td>
                <td className="bg-white/25">{data.entries.amphibian?.length || 0}</td>
              </tr>
              <tr>
                <td className="bg-white/25">Lizard</td>
                <td className="bg-white/25">{data.entries.lizard?.length || 0}</td>
              </tr>
              <tr>
                <td className="bg-white/25">Mammal</td>
                <td className="bg-white/25">{data.entries.mammal?.length || 0}</td>
              </tr>
              <tr>
                <td className="bg-white/25">Snake</td>
                <td className="bg-white/25">{data.entries.snake?.length || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
        :
        <p className="text-lg">No previous entries</p>}
    </div>
  )
}