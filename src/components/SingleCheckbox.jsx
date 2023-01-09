export default function SingleCheckbox({ 
  prompt, 
  value, 
  setValue 
}) {
  return (
    <label className='label cursor-pointer'>
      <span 
        className='
          label-text 
          text-xl 
          text-asu-maroon mr-2
          '
      >{prompt}</span>
      <input
        checked={value}
        onChange={() => setValue(!value)}
        type='checkbox'
        className='checkbox checkbox-secondary'
      />
    </label>
  );
}
