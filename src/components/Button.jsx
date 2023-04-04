export default function Button({
  prompt,
  clickHandler,
}) {
  return (
    <button
        className='text-xl font-semibold px-6 py-2 border-[1px] border-asu-maroon rounded-lg my-2 active:scale-90 transition'
        onClick={() => clickHandler()}
        
      >
        {prompt}
      </button>
  )
}