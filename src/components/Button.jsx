export default function Button({
  prompt,
  clickHandler
}) {
  return (
    <button
        className='
          btn 
          btn-wide 
          btn-secondary 
          mt-2 
          text-xl 
          capitalize 
          text-asu-gold'
        onClick={() => clickHandler()}
      >
        {prompt}
      </button>
  )
}