import { useAtom } from 'jotai';
import { currentSessionData, currentFormName } from '../utils/jotai';

import NewArthropodEntry from '../forms/NewArthropodEntry';
import NewData from '../forms/NewData';
import NewDataEntry from '../forms/NewDataEntry';
import NewAmphibianEntry from '../forms/NewAmphibianEntry';
import NewLizardEntry from '../forms/NewLizardEntry';
import { FinishSessionForm } from '../forms/FinishSessionForm';

export default function CollectData() {
  const [currentData, setCurrentData] = useAtom(currentSessionData)
  const [currentForm, setCurrentForm] = useAtom(currentFormName);

  //  ("New Data")

  return (
    <div className="w-full h-full">
      {currentForm === 'New Data' && <NewData />}
      {currentForm === 'New Data Entry' && currentData && <NewDataEntry />}
      {currentForm === 'New Arthropod Entry' && <NewArthropodEntry />}
      {currentForm === 'New Amphibian Entry' && <NewAmphibianEntry />}
      {currentForm === 'New Lizard Entry' && <NewLizardEntry />}
      {currentForm === 'Finish Session'  && <FinishSessionForm />}
    </div>
  );
}
