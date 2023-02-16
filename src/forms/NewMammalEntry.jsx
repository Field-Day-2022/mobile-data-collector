import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';

import NumberInput from '../components/NumberInput';
import Dropdown from '../components/Dropdown';
import FormWrapper from '../components/FormWrapper';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import {
    collection,
    setDoc,
    query,
    where,
    doc,
    getDocsFromCache,
    getDocFromCache,
} from 'firebase/firestore';
import { db } from '../index';
import { currentFormName, currentSessionData } from '../utils/jotai';
import { updateData } from '../utils/functions';

// TODO: dynamic answer set loading, test everything

import {
    sexOptions,
} from '../utils/hardCodedData';

export default function NewMammalEntry() {
    const [speciesCode, setSpeciesCode] = useState();
    const [trap, setTrap] = useState();
    const [mass, setMass] = useState('');
    const [sex, setSex] = useState();
    const [isDead, setIsDead] = useState(false);
    const [comments, setComments] = useState('');
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [species, setSpecies] = useState([]);
    const [fenceTraps, setFenceTraps] = useState([1]);

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);

    useEffect(() => {
        const getAnswerFormDataFromFirestore = async () => {
            const speciesSnapshot = await getDocsFromCache(
                query(
                    collection(db, 'AnswerSet'),
                    where('set_name', '==', `${currentData.project}MammalSpecies`)
                )
            );
            let speciesCodesArray = [];
            for (const answer of speciesSnapshot.docs[0].data().answers) {
                speciesCodesArray.push(answer.primary);
            }
            setSpecies(speciesCodesArray);
            const fenceTrapsSnapshot = await getDocsFromCache(
                query(collection(db, 'AnswerSet'), where('set_name', '==', 'Fence Traps'))
            );
            let fenceTrapsArray = [];
            for (const answer of fenceTrapsSnapshot.docs[0].data().answers) {
                fenceTrapsArray.push(answer.primary);
            }
            setFenceTraps(fenceTrapsArray);
        };
        getAnswerFormDataFromFirestore();
    }, []);

    const completeCapture = () => {
        updateData(
            'mammal',
            {
                speciesCode,
                trap,
                mass,
                sex,
                isDead,
                comments,
            },
            setCurrentData,
            currentData,
            setCurrentForm
        );
    };

    return (
        <FormWrapper>
            <Dropdown
                value={speciesCode}
                setValue={setSpeciesCode}
                placeholder="Species Code"
                options={species}
            />
            <Dropdown
                value={trap}
                setValue={setTrap}
                placeholder="Fence Trap"
                options={fenceTraps}
            />
            <NumberInput label="Mass (g)" value={mass} setValue={setMass} placeholder="ex: 1.2" />
            <Dropdown value={sex} setValue={setSex} placeholder="Sex" options={sexOptions} />
            <SingleCheckbox prompt="Is it dead?" value={isDead} setValue={setIsDead} />
            <TextInput
                prompt="Comments"
                placeholder="any thoughts?"
                value={comments}
                setValue={setComments}
            />
            <Button prompt="Finished?" clickHandler={() => setConfirmationModalIsOpen(true)} />
            {confirmationModalIsOpen && (
                <ConfirmationModal
                    data={{
                        speciesCode,
                        trap,
                        mass,
                        sex,
                        isDead,
                        comments,
                    }}
                    completeCapture={completeCapture}
                    setConfirmationModalIsOpen={setConfirmationModalIsOpen}
                    modalType="mammal"
                />
            )}
        </FormWrapper>
    );
}
