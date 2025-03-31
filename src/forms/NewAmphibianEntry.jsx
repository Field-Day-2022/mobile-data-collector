import { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { currentFormName, currentSessionData, notificationText } from '../utils/jotai';
import { getStandardizedDateTimeString, updateData, verifyForm } from '../utils/functions';
import { sexOptions } from '../utils/hardCodedData';
import NumberInput from '../components/NumberInput';
import FormWrapper from '../components/FormWrapper';
import Dropdown from '../components/Dropdown';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import { getDocsFromCache, query, where, collection } from 'firebase/firestore';
import { db } from '../index';

export default function NewAmphibianEntry() {
    const amphibianErrorObj = {
        speciesCode: '',
        trap: '',
        hdBody: '',
        mass: '',
        sex: '',
    };
    const [speciesCode, setSpeciesCode] = useState('');
    const [trap, setTrap] = useState('');
    const [hdBody, setHdBody] = useState('');
    const [mass, setMass] = useState('');
    const [sex, setSex] = useState('');
    const [isDead, setIsDead] = useState(false);
    const [comments, setComments] = useState('');
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [species, setSpecies] = useState([]);
    const [errors, setErrors] = useState(amphibianErrorObj);
    const [fenceTraps, setFenceTraps] = useState([]);
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const setCurrentForm = useSetAtom(currentFormName);
    const setNotification = useSetAtom(notificationText);
    const [continueAnyways, setContinueAnyways] = useState(false);

    useEffect(() => {
        sex === 'Male' && setSex('M');
        sex === 'Female' && setSex('F');
        sex === 'Unknown' && setSex('U');
    }, [sex]);

    useEffect(() => {
        if (continueAnyways && hdBody && mass && sex) {
            setConfirmationModalIsOpen(true);
        }
    }, [continueAnyways, hdBody, mass, sex]);

    useEffect(() => {
        const getAnswerFormDataFromFirestore = async () => {
            const speciesSnapshot = await getDocsFromCache(
                query(
                    collection(db, 'AnswerSet'),
                    where('set_name', '==', `${currentData.project}AmphibianSpecies`),
                ),
            );
            const speciesCodesArray = speciesSnapshot.docs[0].data().answers.map((answer) => {
                return answer.primary;
            });
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
            'amphibian',
            {
                speciesCode,
                trap,
                hdBody,
                mass,
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
                label="HD-Body"
                value={hdBody}
                setValue={setHdBody}
                placeholder="HD-Body"
                inputValidation="oneDecimalPlace"
                error={errors.hdBody}
            />
            <NumberInput
                label="Mass (g)"
                value={mass}
                setValue={setMass}
                placeholder="0.0 g"
                inputValidation="mass"
                error={errors.mass}
            />
            <Dropdown
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
                error={errors.sex}
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
                clickHandler={() =>
                    verifyForm(
                        amphibianErrorObj,
                        {
                            speciesCode,
                            trap,
                            hdBody,
                            mass,
                            sex,
                        },
                        setNotification,
                        setConfirmationModalIsOpen,
                        setErrors,
                        setContinueAnyways,
                    )
                }
            />
            {continueAnyways && (
                <div>
                    <p className="text-xl">Form has incomplete data, continue anyways?</p>
                    <Button
                        prompt="Submit incomplete form"
                        clickHandler={() => {
                            if (hdBody === '') setHdBody('N/A');
                            if (mass === '') setMass('N/A');
                            if (sex === '') setSex('U');
                        }}
                    />
                </div>
            )}
            {confirmationModalIsOpen && (
                <ConfirmationModal
                    data={{
                        speciesCode,
                        trap,
                        hdBody,
                        mass,
                        sex,
                        isDead,
                        comments,
                    }}
                    completeCapture={completeCapture}
                    setConfirmationModalIsOpen={setConfirmationModalIsOpen}
                    modalType="amphibian"
                    resetFields={() => {
                        hdBody === 'N/A' && setHdBody('');
                        mass === 'N/A' && setMass('');
                        sex === 'U' && setSex('');
                    }}
                />
            )}
        </FormWrapper>
    );
}
