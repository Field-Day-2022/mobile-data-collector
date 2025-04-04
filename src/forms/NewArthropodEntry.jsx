import { useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import NumberInput from '../components/NumberInput';
import Dropdown from '../components/Dropdown';
import FormWrapper from '../components/FormWrapper';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import PlusMinusButtons from '../components/PlusMinusButtons';

import {
    currentFormName,
    currentSessionData,
    editingPrevious,
    notificationText,
} from '../utils/jotai';
import {
    updateData,
    updatePreexistingArthropodData,
    verifyArthropodForm,
    changeStringsToNumbers,
    getStandardizedDateTimeString,
} from '../utils/functions';
import { collection, query, where, getDocsFromCache } from 'firebase/firestore';
import { db } from '../index';

export default function NewArthropodEntry() {
    const [trap, setTrap] = useState('');
    const [predator, setPredator] = useState(false);
    const [arthropodData, setArthropodData] = useState();
    const [comments, setComments] = useState('');
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [arthropodSpeciesList, setArthropodSpeciesList] = useState([]);
    const [fenceTraps, setFenceTraps] = useState([]);
    const [errors, setErrors] = useState({
        trap: '',
    });

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const setCurrentForm = useSetAtom(currentFormName);
    const isEditingPrevious = useAtomValue(editingPrevious);
    const setNotification = useSetAtom(notificationText);

    useEffect(() => {
        const getAnswerFormDataFromFirestore = async () => {
            const speciesSnapshot = await getDocsFromCache(
                query(collection(db, 'AnswerSet'), where('set_name', '==', 'ArthropodSpecies')),
            );
            let tempArthropodSpeciesArray = [];
            let tempArthropodData = {};
            for (const arthropodSpecies of speciesSnapshot.docs[0].data().answers) {
                tempArthropodSpeciesArray.push(arthropodSpecies.primary.toLowerCase());
                tempArthropodData[arthropodSpecies.primary.toLowerCase()] = '';
            }
            setArthropodSpeciesList(tempArthropodSpeciesArray);
            setArthropodData(tempArthropodData);
            const fenceTrapsSnapshot = await getDocsFromCache(
                query(
                    collection(db, 'AnswerSet'),
                    where('set_name', '==', 'Arthropod Fence Traps'),
                ),
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
        const formattedArthropodData = changeStringsToNumbers(arthropodData);
        if (isEditingPrevious || currentData.arthropod) {
            updatePreexistingArthropodData(
                {
                    trap,
                    predator: predator ? 'true' : 'false',
                    arthropodData: formattedArthropodData,
                    comments,
                    dateTime: getStandardizedDateTimeString(currentData.sessionEpochTime),
                    entryId: new Date().getTime(),
                },
                setCurrentData,
                currentData,
                setCurrentForm,
            );
        } else {
            updateData(
                'arthropod',
                {
                    trap,
                    predator: predator ? 'true' : 'false',
                    arthropodData: formattedArthropodData,
                    comments,
                    dateTime: getStandardizedDateTimeString(currentData.sessionEpochTime),
                    entryId: new Date().getTime(),
                },
                setCurrentData,
                currentData,
                setCurrentForm,
            );
        }
    };

    return (
        <FormWrapper>
            <Dropdown
                error={errors.trap}
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
            <Button
                prompt="Finished?"
                clickHandler={() =>
                    verifyArthropodForm(
                        trap,
                        setNotification,
                        setConfirmationModalIsOpen,
                        setErrors,
                    )
                }
            />
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
                    resetFields={() => {
                        setTrap(trap);
                        setPredator(predator);
                        setArthropodData(arthropodData);
                        setComments(comments);
                        setErrors({ trap: '' });
                    }}
                />
            )}
        </FormWrapper>
    );
}
