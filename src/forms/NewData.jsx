export default function NewData({ data, setData }) {
  return (
    <div className="form-control items-center justify-start overflow-x-hidden overflow-y-scroll scrollbar scrollbar-track-asu-maroon/50 scrollbar-thumb-asu-gold/75 hover:scrollbar-thumb-asu-gold border-0 border-black w-full h-full">
      <h1 className="text-5xl mb-5">New Data</h1>
      <label className="input-group justify-center m-1">
        <span>Recorder</span>
        <input type="text" placeholder="initials" className="input" />
      </label>
      <label className="input-group justify-center m-1">
        <span>Handler</span>
        <input type="text" placeholder="initials" className="input" />
      </label>
      <div className="dropdown dropdown-hover dropdown-right justify-center items-center">
        <label tabIndex={0} className="btn glass m-1 text-asu-maroon text-xl capitalize">Project</label>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48">
          <li><a>Gateway</a></li>
          <li><a>San Pedro</a></li>
          <li><a>Virgin River</a></li>
        </ul>
      </div>
      <div className="dropdown dropdown-hover dropdown-right justify-center items-center">
        <label tabIndex={0} className="btn glass m-1 text-asu-maroon text-xl capitalize">Site</label>
        <ul tabIndex={0} className="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box w-20">
          <li><a>Site</a></li>
          <li><a>Site</a></li>
        </ul>
      </div>
    </div>
  )
}