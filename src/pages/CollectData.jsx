import { useAtom } from 'jotai';

import NewArthropodEntry from '../forms/NewArthropodEntry';
import NewData from '../forms/NewData';
import NewDataEntry from '../forms/NewDataEntry';
import NewAmphibianEntry from '../forms/NewAmphibianEntry';
import { currentSessionData, currentFormName } from '../utils/jotai';

export default function CollectData() {
  const [currentData, setCurrentData] = useAtom(currentSessionData)
  const [currentForm, setCurrentForm] = useAtom(currentFormName);


  return (
    <div
      className='
      flex 
      flex-col 
      overflow-visible 
      items-center 
      h-full
      max-h-full
      sm:w-11/12 
      w-full 
      pr-0 
      bg-gradient-to-r 
      from-slate-300/75 
      rounded-lg
      text-asu-maroon'
    >
      <h1 className='text-4xl text-asu-maroon font-bold mt-2'>
        {currentForm}
      </h1>
      <div className='divider mb-0 pb-0 mt-0 h-1 bg-asu-gold/75' />
      {currentForm === 'New Data' && <NewData />}
      {currentForm === 'New Data Entry' && currentData && <NewDataEntry />}
      {currentForm === 'New Arthropod Entry' && <NewArthropodEntry />}
      {currentForm === 'New Amphibian Entry' && <NewAmphibianEntry />}
    </div>
  );
}
