export default function TextInput({type, prompt, placeholder, setValue, value}) {
  const styles = {
    initials: {
      div: "form-control w-full max-w-[6rem]",
      input: "input input-secondary bg-slate-200/50 input-bordered w-full max-w-[6rem] text-xl text-secondary placeholder:text-secondary/50"
    },
    general: {
      div: "form-control w-full max-w-[10rem]",
      input: "input input-secondary bg-slate-200/50 input-bordered w-full max-w-[10rem] text-xl text-secondary placeholder:text-secondary/50"
    }
  }
  let style
  if (type === 'initials') style = styles.initials
  else style = styles.general

  return (
    <div className={style.div}>
      <label className="label">
        <span className="label-text text-asu-maroon">{prompt}</span>
      </label>
      <input 
        maxLength={type === 'initials' ? 3 : 100} 
        value={value} 
        onChange={e => {
          type === 'initials' && setValue(e.target.value.toUpperCase())
        }}
        type="text" 
        placeholder={placeholder} 
        className={style.input} />
    </div>
  )
}