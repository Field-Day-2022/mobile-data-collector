export default function TextInput({
  prompt,
  placeholder,
  value,
  setValue
}) {
  return (
    <div>
      <label className="label">
        <span className="label-text text-asu-maroon">{prompt}</span>
      </label>
      <input value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder={placeholder} className="placeholder:text-asu-maroon text-asu-maroon  input bg-white/25 input-bordered input-secondary w-full max-w-xs" />
    </div>
  )
}