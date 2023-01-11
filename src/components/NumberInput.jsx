export default function NumberInput({ 
  label, 
  value,
  setValue, 
  placeholder 
}) {
  return (
    <div className='w-36 mb-2'>
      <label className="label pb-0">
        <span className="label-text text-black">{label}</span>
      </label>
      <input 
        onChange={(e) => {
          if (e.target.value > 0 &&
              !isNaN(e.target.value)) 
            setValue(e.target.value)
        }}
        value={value} 
        type="text" 
        placeholder={placeholder} 
        className="
          placeholder:text-gray-400
          placeholder:font-light 
          text-asu-maroon 
          input 
          bg-white/25 
          input-bordered 
          input-secondary 
          text-xl 
          w-full 
          max-w-xs" />
    </div>
  )
}