import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';

import NumberInput from '../components/NumberInput';
import Dropdown from '../components/Dropdown';
import FormWrapper from '../components/FormWrapper';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import PlusMinusButtons from '../components/PlusMinusButtons';

import { currentFormName, currentSessionData } from '../utils/jotai';
import { updateData } from '../utils/functions';
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

export default function NewArthropodEntry() {
    const [trap, setTrap] = useState();
    const [predator, setPredator] = useState(false);
    const [arthropodData, setArthropodData] = useState();
    const [comments, setComments] = useState('');
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [arthropodSpeciesList, setArthropodSpeciesList] = useState([]);
    const [fenceTraps, setFenceTraps] = useState([]);

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);

    // todo: input validation

    useEffect(() => {
        const getAnswerFormDataFromFirestore = async () => {
            const speciesSnapshot = await getDocsFromCache(
                query(collection(db, 'AnswerSet'), where('set_name', '==', 'ArthropodSpecies'))
            );
            let tempArthropodSpeciesArray = [];
            let tempArthropodData = {};
            for (const arthropodSpecies of speciesSnapshot.docs[0].data().answers) {
                tempArthropodSpeciesArray.push(arthropodSpecies.primary.toLowerCase());
                tempArthropodData[arthropodSpecies.primary.toLowerCase()] = 0;
            }
            setArthropodSpeciesList(tempArthropodSpeciesArray);
            setArthropodData(tempArthropodData);
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
        const date = new Date();
        updateData(
            'arthropod',
            {
                trap,
                predator,
                arthropodData,
                comments,
                dateTime: date.toISOString(),
            },
            setCurrentData,
            currentData,
            setCurrentForm
        );
    };

    return (
        <FormWrapper>
            <Dropdown
                value={trap}
                setValue={setTrap}
                placeholder="Fence Trap"
                options={fenceTraps}
            />
            <SingleCheckbox prompt="Predator?" value={predator} setValue={setPredator} />
            {arthropodSpeciesList.map((item) => (
                <PlusMinusButtons
                    key={item}
                    onNumberChange={(changeAmount) =>
                        setArthropodData((arthropodData) => {
                            if (Number(arthropodData[item]) + changeAmount < 0) {
                                return { ...arthropodData };
                            } else {
                                return {
                                    ...arthropodData,
                                    [item]: Number(arthropodData[item]) + changeAmount,
                                };
                            }
                        })
                    }
                >
                    <NumberInput
                        value={arthropodData && arthropodData[item]}
                        label={item.toUpperCase()}
                        placeholder="# of critters"
                        setValue={(value) => setArthropodData({ ...arthropodData, [item]: value })}
                    />
                </PlusMinusButtons>
            ))}
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
                        trap,
                        predator,
                        arthropodData,
                        comments,
                    }}
                    completeCapture={completeCapture}
                    setConfirmationModalIsOpen={setConfirmationModalIsOpen}
                    modalType="arthropod"
                />
            )}
        </FormWrapper>
    );
}
