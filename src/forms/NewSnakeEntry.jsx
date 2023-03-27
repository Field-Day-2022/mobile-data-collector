/* eslint-disable react-hooks/exhaustive-deps */

// TODO: confirmation modal and dynamic loading, test everything

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { collection, setDoc, query, where, doc, getDocsFromCache } from 'firebase/firestore';
import { db } from '../index';

import NumberInput from '../components/NumberInput';
import Dropdown from '../components/Dropdown';
import FormWrapper from '../components/FormWrapper';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

import { currentFormName, currentSessionData, notificationText } from '../utils/jotai';
import { updateData } from '../utils/functions';
//TODO: species list for snakes
import { sexOptions } from '../utils/hardCodedData';
import ConfirmationModal from '../components/ConfirmationModal';

export default function NewSnakeEntry() {
    const [speciesCode, setSpeciesCode] = useState('');
    const [trap, setTrap] = useState('');
    const [mass, setMass] = useState('');
    const [sex, setSex] = useState('');
    const [isDead, setIsDead] = useState(false);
    const [comments, setComments] = useState('');
    const [svl, setSvl] = useState('');
    const [vtl, setVtl] = useState('');
    const [species, setSpecies] = useState([]);
    const [fenceTraps, setFenceTraps] = useState([]);
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [errors, setErrors] = useState({
        speciesCode: '',
        fenceTrap: '',
        vtl: '',
        svl: '',
        mass: '',
        sex: '',
        comments: '',
    });
    const [noCapture, setNoCapture] = useState(false);

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);
    const [notification, setNotification] = useAtom(notificationText);

    useEffect(() => {
        const getAnswerFormDataFromFirestore = async () => {
            const speciesSnapshot = await getDocsFromCache(
                query(
                    collection(db, 'AnswerSet'),
                    where('set_name', '==', `${currentData.project}SnakeSpecies`)
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

    const setFormDataToNoCapture = () => {
        setSex('N/A');
        setMass('N/A');
        setVtl('N/A');
        setSvl('N/A');
        setIsDead('N/A');
    }

    const setFormDataToBlank = () => {
        setSex('');
        setMass('');
        setVtl('');
        setSvl('');
        setIsDead('');
    }

    useEffect(() => {
        if (noCapture) {
            setFormDataToNoCapture();
        } else {
            setFormDataToBlank();
        }
    }, [noCapture])

    const completeCapture = () => {
        const date = new Date();
        updateData(
            'snake',
            {
                speciesCode,
                trap,
                mass,
                svl,
                vtl,
                sex,
                isDead,
                comments,
                dateTime: date.toISOString(),
                noCapture,
            },
            setCurrentData,
            currentData,
            setCurrentForm
        );
    };

    const verifyForm = () => {
        let tempErrors = {
            speciesCode: '',
            fenceTrap: '',
            vtl: '',
            svl: '',
            mass: '',
            sex: '',
            comments: '',
        };
        if (speciesCode === '') tempErrors.speciesCode = 'Required';
        if (trap === '') tempErrors.fenceTrap = 'Required';
        if (
            svl === '' &&
            vtl === '' &&
            sex === '' &&
            mass === ''
        ) {
            setNoCapture(true);
        } else {
            if (svl === '') tempErrors.svl = 'Required';
            if (vtl === '') tempErrors.vtl = 'Required';
            if (sex === '') tempErrors.sex = 'Required';
            if (mass === '') tempErrors.mass = 'Required';
        } 
        let errorExists = false;
        for (const key in tempErrors) {
            if (tempErrors[key] !== '') errorExists = true;
        }
        if (errorExists) {
            setNotification('Errors in form');
        } else {
            setNotification('Form is valid');
            setConfirmationModalIsOpen(true);
        }
        setErrors(tempErrors);
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
                error={errors.fenceTrap}
            />
            <NumberInput
                error={errors.svl}
                label="SVL (mm)"
                value={svl}
                setValue={setSvl}
                placeholder="ex: 1.2"
            />
            <NumberInput
                error={errors.vtl}
                label="VTL (mm)"
                value={vtl}
                setValue={setVtl}
                placeholder="ex: 1.2"
            />
            <NumberInput
                error={errors.mass}
                label="Mass (g)"
                value={mass}
                setValue={setMass}
                placeholder="ex: 1.2"
            />
            <Dropdown
                error={errors.sex}
                value={sex}
                setValue={setSex}
                placeholder="Sex"
                options={sexOptions}
            />
            {!noCapture && <SingleCheckbox prompt="Is it dead?" value={isDead} setValue={setIsDead} />}
            <TextInput
                prompt="Comments"
                placeholder="any thoughts?"
                value={comments}
                setValue={setComments}
            />
            <Button prompt="Finished?" clickHandler={() => verifyForm()} />
            {confirmationModalIsOpen && (
                <ConfirmationModal
                    data={{
                        speciesCode,
                        trap,
                        svl,
                        vtl,
                        mass,
                        sex,
                        isDead,
                        comments,
                    }}
                    completeCapture={completeCapture}
                    setConfirmationModalIsOpen={setConfirmationModalIsOpen}
                    modalType="snake"
                />
            )}
        </FormWrapper>
    );
}
