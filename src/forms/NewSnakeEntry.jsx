import { useState, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { collection, query, where, getDocsFromCache } from 'firebase/firestore';
import { db } from '../index';

import NumberInput from '../components/NumberInput';
import Dropdown from '../components/Dropdown';
import FormWrapper from '../components/FormWrapper';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

import { currentFormName, currentSessionData, notificationText } from '../utils/jotai';
import { getStandardizedDateTimeString, updateData, verifyForm } from '../utils/functions';
import { sexOptions } from '../utils/hardCodedData';
import ConfirmationModal from '../components/ConfirmationModal';

export default function NewSnakeEntry() {
    const snakeErrors = {
        speciesCode: '',
        fenceTrap: '',
        vtl: '',
        svl: '',
        mass: '',
        sex: '',
        comments: '',
    };
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
    const [errors, setErrors] = useState(snakeErrors);
    const [continueAnyways, setContinueAnyways] = useState(false);

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const setCurrentForm = useSetAtom(currentFormName);
    const setNotification = useSetAtom(notificationText);

    useEffect(() => {
        sex === 'Male' && setSex('M');
        sex === 'Female' && setSex('F');
        sex === 'Unknown' && setSex('U');
    }, [sex]);

    useEffect(() => {
        if (continueAnyways && mass && svl && vtl && sex) {
            setConfirmationModalIsOpen(true);
        }
    }, [continueAnyways, mass, svl, vtl, sex]);

    useEffect(() => {
        const getAnswerFormDataFromFirestore = async () => {
            const speciesSnapshot = await getDocsFromCache(
                query(
                    collection(db, 'AnswerSet'),
                    where('set_name', '==', `${currentData.project}SnakeSpecies`),
                ),
            );
            let speciesCodesArray = [];
            for (const answer of speciesSnapshot.docs[0].data().answers) {
                speciesCodesArray.push(answer.primary);
            }
            setSpecies(speciesCodesArray);
            const fenceTrapsSnapshot = await getDocsFromCache(
                query(collection(db, 'AnswerSet'), where('set_name', '==', 'Fence Traps')),
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
                dateTime: getStandardizedDateTimeString(currentData.sessionEpochTime),
                entryId: new Date().getTime(),
            },
            setCurrentData,
            currentData,
            setCurrentForm,
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
                error={errors.svl}
                label="SVL (mm)"
                value={svl}
                setValue={setSvl}
                placeholder="0 mm"
            />
            <NumberInput
                error={errors.vtl}
                label="VTL (mm)"
                value={vtl}
                setValue={setVtl}
                placeholder="0 mm"
            />
            <NumberInput
                error={errors.mass}
                label="Mass (g)"
                value={mass}
                setValue={setMass}
                placeholder="0.0 g"
                inputValidation="mass"
            />
            <Dropdown
                error={errors.sex}
                value={`${
                    sex === 'M' || sex === 'Male'
                        ? 'Male'
                        : sex === 'F' || sex === 'Female'
                          ? 'Female'
                          : sex === 'U' || sex === 'Unknown'
                            ? 'Unknown'
                            : sex
                }`}
                setValue={setSex}
                placeholder="Sex"
                options={sexOptions}
            />
            <SingleCheckbox prompt="Is it dead?" value={isDead} setValue={setIsDead} />
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
                        snakeErrors,
                        {
                            speciesCode,
                            trap,
                            mass,
                            svl,
                            vtl,
                            sex,
                        },
                        setNotification,
                        setConfirmationModalIsOpen,
                        setErrors,
                        setContinueAnyways,
                    );
                }}
            />
            {continueAnyways && (
                <div>
                    <p className="text-xl">Form has incomplete data, continue anyways?</p>
                    <Button
                        prompt="Submit incomplete form"
                        clickHandler={() => {
                            svl === '' && setSvl('N/A');
                            vtl === '' && setVtl('N/A');
                            mass === '' && setMass('N/A');
                            sex === '' && setSex('U');
                        }}
                    />
                </div>
            )}
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
                    resetFields={() => {
                        svl === 'N/A' && setSvl('');
                        vtl === 'N/A' && setVtl('');
                        mass === 'N/A' && setMass('');
                        sex === 'U' && setSex('');
                    }}
                />
            )}
        </FormWrapper>
    );
}
