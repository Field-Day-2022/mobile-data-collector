/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';

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
import { 
    currentFormName, 
    currentSessionData,
    notificationText,
} from '../utils/jotai';
import { getStandardizedDateTimeString, updateData, verifyForm } from '../utils/functions';

// TODO: dynamic answer set loading, test everything

import {
    sexOptions,
} from '../utils/hardCodedData';

export default function NewMammalEntry() {
    const mammalErrors = {
        speciesCode: '',
        trap: '',
        mass: '',
        sex: ''
    }
    const [speciesCode, setSpeciesCode] = useState('');
    const [trap, setTrap] = useState('');
    const [mass, setMass] = useState('');
    const [sex, setSex] = useState('');
    const [isDead, setIsDead] = useState(false);
    const [comments, setComments] = useState('');
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [species, setSpecies] = useState([]);
    const [fenceTraps, setFenceTraps] = useState([1]);
    const [errors, setErrors] = useState(mammalErrors);
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const setCurrentForm = useSetAtom(currentFormName);
    const setNotification = useSetAtom(notificationText);

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
        const date = new Date();
        updateData(
            'mammal',
            {
                speciesCode,
                trap,
                mass,
                sex,
                isDead,
                comments,
                dateTime: getStandardizedDateTimeString(date),
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
                error={errors.speciesCode}
            />
            <Dropdown
                value={trap}
                setValue={setTrap}
                placeholder="Fence Trap"
                options={fenceTraps}
                error={errors.trap}
            />
            <NumberInput 
                label="Mass (g)" 
                value={mass} 
                setValue={setMass} 
                placeholder="0.0 g"
                error={errors.mass}
            />
            <Dropdown 
                value={sex} 
                setValue={setSex} 
                placeholder="Sex" 
                options={sexOptions}
                error={errors.sex}
            />
            <SingleCheckbox 
                prompt="Is it dead?" 
                value={isDead} 
                setValue={setIsDead}
            />
            <TextInput
                prompt="Comments"
                placeholder="any thoughts?"
                value={comments}
                setValue={setComments}
            />
            <Button 
                prompt="Finished?" 
                clickHandler={() => {
                    verifyForm(
                        mammalErrors,
                        {
                            speciesCode,
                            trap,
                            mass,
                            sex
                        },
                        setNotification,
                        setConfirmationModalIsOpen,
                        setErrors
                    )
                }}
            />
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
