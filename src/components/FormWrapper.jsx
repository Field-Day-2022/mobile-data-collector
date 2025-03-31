export default function FormWrapper({ children }) {
    return (
        <div
            className="
      pb-24 
      text-center 
      form-control 
      items-center 
      justify-start 
      overflow-x-hidden 
      overflow-y-auto 
      scrollbar-thin 
      scrollbar-thumb-asu-maroon 
      scrollbar-thumb-rounded-full 
      rounded-lg 
      w-full
      h-full
      max-h-[calc(100%-3em)]
      "
        >
            {children}
        </div>
    );
}
