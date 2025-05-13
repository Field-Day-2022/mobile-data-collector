import { useAtom, useAtomValue } from 'jotai';
import { currentSessionData, currentFormName, editingPrevious } from '../utils/jotai';

import NewArthropodEntry from '../forms/NewArthropodEntry';
import NewData from '../forms/NewData';
import NewDataEntry from '../forms/NewDataEntry';
import NewAmphibianEntry from '../forms/NewAmphibianEntry';
import NewLizardEntry from '../forms/NewLizardEntry';
import NewMammalEntry from '../forms/NewMammalEntry';
import { FinishSessionForm } from '../forms/FinishSessionForm';
import { useEffect } from 'react';
import NewSnakeEntry from '../forms/NewSnakeEntry';

export default function CollectData() {
    const currentData = useAtomValue(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);
    const isEditingPrevious = useAtomValue(editingPrevious);

    useEffect(() => {
        if (isEditingPrevious) {
            setCurrentForm('New Data Entry');
        }
    }, []);

    return (
        <div className="w-full h-full">
            {currentForm === 'New Data' && <NewData />}
            {currentForm === 'New Data Entry' && currentData && <NewDataEntry />}
            {currentForm === 'New Arthropod Entry' && <NewArthropodEntry />}
            {currentForm === 'New Amphibian Entry' && <NewAmphibianEntry />}
            {currentForm === 'New Lizard Entry' && <NewLizardEntry />}
            {currentForm === 'New Mammal Entry' && <NewMammalEntry />}
            {currentForm === 'New Snake Entry' && <NewSnakeEntry />}
            {currentForm === 'Finish Session' && <FinishSessionForm />}
        </div>
    );
}
