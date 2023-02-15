import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
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

import { currentFormName, currentSessionData, notificationText } from '../utils/jotai';
import { updateData } from '../utils/functions';

import FormWrapper from '../components/FormWrapper';
import Dropdown from '../components/Dropdown';
import SingleCheckbox from '../components/SingleCheckbox';
import ToeCodeInput from '../components/ToeCodeInput';
import NumberInput from '../components/NumberInput';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';

export default function NewLizardEntry() {
    const [speciesCode, setSpeciesCode] = useState('');
    const [trap, setTrap] = useState('');
    const [isRecapture, setIsRecapture] = useState(false);
    const [toeCode, setToeCode] = useState('');
    const [svl, setSvl] = useState('');
    const [vtl, setVtl] = useState('');
    const [regenTail, setRegenTail] = useState(false);
    const [otl, setOtl] = useState('');
    const [isHatchling, setIsHatchling] = useState(false);
    const [massGrams, setMassGrams] = useState('');
    const [sex, setSex] = useState('');
    const [isDead, setIsDead] = useState(false);
    const [comments, setComments] = useState('');
    const [updatedToeCodes, setUpdatedToeCodes] = useState();
    const [lizardSpeciesList, setLizardSpeciesList] = useState([]);
    const [fenceTraps, setFenceTraps] = useState([]);
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [siteToeCodes, setSiteToeCodes] = useState();
    const [speciesToeCodes, setSpeciesToeCodes] = useState();
    const [errors, setErrors] = useState({
        speciesCode: '',
        fenceTrap: '',
        recapture: '',
        toeCode: '',
        svl: '',
        vtl: '',
        regenTail: '',
        otl: '',
        hatchling: '',
        mass: '',
        sex: '',
        dead: '',
        comments: '',
    });

    // TODO: add input validation logic for svl, vtl, otl, and mass

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);
    const [notification, setNotification] = useAtom(notificationText);

    const sexOptions = ['Male', 'Female', 'Unknown'];

    useEffect(() => {
        const getAnswerFormDataFromFirestore = async () => {
            const speciesSnapshot = await getDocsFromCache(
                query(
                    collection(db, 'AnswerSet'),
                    where('set_name', '==', `${currentData.project}LizardSpecies`)
                )
            );
            let speciesCodesArray = [];
            for (const answer of speciesSnapshot.docs[0].data().answers) {
                speciesCodesArray.push(answer.primary);
            }
            setLizardSpeciesList(speciesCodesArray);
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
        const fetchToeCodes = async () => {
            let toeCodesSnapshot;
            try {
                toeCodesSnapshot = await getDocFromCache(
                    doc(db, 'TestToeClipCodes', currentData.site)
                );
                console.log('getting toe codes from test');
                setSiteToeCodes(toeCodesSnapshot.data());
            } catch (e) {
                console.log('getting toe codes from live');
                toeCodesSnapshot = await getDocsFromCache(
                    query(collection(db, 'ToeClipCodes'), where('SiteCode', '==', currentData.site))
                );
                setSiteToeCodes(toeCodesSnapshot.docs[0].data());
                // console.log('retreiving toe codes from ' + currentData.site)
                // console.log(toeCodes)
            }
        };
        fetchToeCodes();
    }, []);

    useEffect(() => {
        if (siteToeCodes) {
            let tempArray = [];
            setSpeciesToeCodes([]);
            for (const toeClipCode in siteToeCodes[currentData.array][speciesCode]) {
                if (
                    siteToeCodes[currentData.array][speciesCode][toeClipCode] !== 'date' &&
                    toeClipCode !== 'SpeciesCode' &&
                    toeClipCode !== 'ArrayCode' &&
                    toeClipCode !== 'SiteCode'
                ) {
                    tempArray.push(toeClipCode);
                    // setPreexistingToeClipCodes((preexistingToeClipCodes) => [
                    //     ...preexistingToeClipCodes,
                    //     toeClipCode,
                    // ]);
                    // console.log(toeClipCode)
                }
            }
            setSpeciesToeCodes(tempArray);
            console.log(
                `All preexisting toe codes from this species(${speciesCode}), array(${currentData.array}), and site(${currentData.site})`
            );
            console.log(tempArray);
        }
    }, [speciesCode]);

    const sendToeCodeDataToFirestore = async () => {
        await setDoc(doc(db, 'TestToeClipCodes', currentData.site), updatedToeCodes);
        setNotification('Successfully set toe clip code entry');
    };

    const verifyForm = () => {
        let tempErrors = {
            speciesCode: '',
            fenceTrap: '',
            recapture: '',
            toeCode: '',
            svl: '',
            vtl: '',
            regenTail: '',
            otl: '',
            hatchling: '',
            mass: '',
            sex: '',
            dead: '',
            comments: '',
        };
        if (sex === '') tempErrors.sex = 'Required';
        if (massGrams === '') tempErrors.mass = 'Required';
        if (speciesCode === '') tempErrors.speciesCode = 'Required';
        if (trap === '') tempErrors.fenceTrap = 'Required';
        let errorExists = false;
        for (const key in tempErrors) {
            if (tempErrors[key] !== '') errorExists = true;
        }
        if (errorExists) {
            setNotification('Errors in form');
        } else {
            setNotification('Form is valid');
        }
        setErrors(tempErrors);
        console.log(tempErrors);
        console.log([trap, speciesCode]);
    };

    const completeCapture = () => {
        const date = new Date();
        sendToeCodeDataToFirestore();
        updateData(
            'lizard',
            {
                speciesCode,
                trap,
                isRecapture,
                toeCode,
                svl,
                vtl,
                regenTail,
                otl,
                isHatchling,
                mass: massGrams,
                sex,
                isDead,
                comments,
                dateTime: date.toUTCString(),
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
                options={lizardSpeciesList}
                error={errors.speciesCode}
            />
            <Dropdown
                value={trap}
                setValue={setTrap}
                placeholder="Fence Trap"
                options={fenceTraps}
                error={errors.fenceTrap}
            />
            <SingleCheckbox
                prompt="Is it a recapture?"
                value={isRecapture}
                setValue={setIsRecapture}
            />
            <ToeCodeInput
                toeCode={toeCode}
                setToeCode={setToeCode}
                speciesCode={speciesCode}
                isRecapture={isRecapture}
                setIsRecapture={setIsRecapture}
                setUpdatedToeCodes={setUpdatedToeCodes}
                speciesToeCodes={speciesToeCodes}
                siteToeCodes={siteToeCodes}
            />
            <NumberInput label="SVL (mm)" value={svl} setValue={setSvl} placeholder="0.0 mm" />
            <NumberInput label="VTL (mm)" value={vtl} setValue={setVtl} placeholder="0.0 mm" />
            <SingleCheckbox
                prompt="Regen tail?"
                value={regenTail}
                setValue={setRegenTail}
            />
            <NumberInput
                isDisabled={regenTail}
                label="OTL (mm)"
                value={otl}
                setValue={setOtl}
                placeholder="0.0 mm"
                inputValidation="vtl"
                upperBound={vtl}
            />
            <SingleCheckbox
                prompt="Is it a hatchling?"
                value={isHatchling}
                setValue={setIsHatchling}
            />
            <NumberInput
                error={errors.mass}
                label="Mass (g)"
                value={massGrams}
                setValue={setMassGrams}
            />
            <Dropdown
                error={errors.sex}
                value={sex}
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
            <Button prompt="Finished?" clickHandler={() => verifyForm()} />
            {confirmationModalIsOpen && (
                <ConfirmationModal
                    data={{
                        speciesCode,
                        trap,
                        isRecapture,
                        toeCode,
                        svl,
                        vtl,
                        regenTail,
                        otl,
                        isHatchling,
                        massGrams,
                        sex,
                        isDead,
                        comments,
                    }}
                    completeCapture={completeCapture}
                    setConfirmationModalIsOpen={setConfirmationModalIsOpen}
                    modalType="lizard"
                />
            )}
        </FormWrapper>
    );
}
