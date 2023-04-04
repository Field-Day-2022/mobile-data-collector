/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { 
    currentFormName, 
    currentSessionData, 
    notificationText, 
    appMode,
    lizardDataLoadedAtom,
    lizardLastEditTime
} from '../utils/jotai';
import FormWrapper from '../components/FormWrapper';
import Dropdown from '../components/Dropdown';
import SingleCheckbox from '../components/SingleCheckbox';
import ToeCodeInput from '../components/ToeCodeInput';
import NumberInput from '../components/NumberInput';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import { ScaleLoader } from 'react-spinners';
import { 
    getLizardAnswerFormDataFromFirestore, 
    verifyLizardForm,
    completeLizardCapture,
    verifyForm
} from '../utils/functions'

export default function NewLizardEntry() {
    const lizardErrors = {
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
    }
    const [speciesCode, setSpeciesCode] = useState('');
    const [trap, setTrap] = useState('');
    const [isRecapture, setIsRecapture] = useState(false);
    const [toeCode, setToeCode] = useState('');
    const [svl, setSvl] = useState('');
    const [vtl, setVtl] = useState('');
    const [regenTail, setRegenTail] = useState(false);
    const [otl, setOtl] = useState('');
    const [isHatchling, setIsHatchling] = useState(false);
    const [mass, setMass] = useState('');
    const [sex, setSex] = useState('');
    const [isDead, setIsDead] = useState(false);
    const [comments, setComments] = useState('');
    const [lizardSpeciesList, setLizardSpeciesList] = useState([]);
    const [fenceTraps, setFenceTraps] = useState([]);
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [errors, setErrors] = useState(lizardErrors);
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const setCurrentForm = useSetAtom(currentFormName);
    const setNotification = useSetAtom(notificationText);
    const lizardDataLoaded = useAtomValue(lizardDataLoadedAtom);
    const environment = useAtomValue(appMode)
    const setLastEditTime = useSetAtom(lizardLastEditTime);

    const sexOptions = ['Male', 'Female', 'Unknown'];

    useEffect(() => {
        getLizardAnswerFormDataFromFirestore(currentData, setLizardSpeciesList, setFenceTraps);
    }, []);

    useEffect(() => {
        if (otl > vtl && Number(otl) && Number(vtl)) setOtl(vtl)
    }, [ vtl ])
    
    useEffect(() => {
        if (!regenTail) setOtl('')
    }, [ regenTail ])

    return (
        ((lizardDataLoaded)) ?
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
            />
            <NumberInput 
                label="SVL (mm)" 
                value={svl} 
                setValue={setSvl} 
                placeholder="0 mm" 
                error={errors.svl}
            />
            <NumberInput 
                label="VTL (mm)" 
                value={vtl} 
                setValue={setVtl} 
                placeholder="0 mm" 
                error={errors.svl}
            />
            <SingleCheckbox prompt="Regen tail?" value={regenTail} setValue={setRegenTail} />
            <NumberInput
                isDisabled={!regenTail}
                label="OTL (mm)"
                value={otl}
                setValue={setOtl}
                placeholder="0 mm"
                inputValidation="vtl"
                upperBound={vtl}
                error={errors.otl}
            />
            <SingleCheckbox
                prompt="Is it a hatchling?"
                value={isHatchling}
                setValue={setIsHatchling}
            />
            <NumberInput
                error={errors.mass}
                label="Mass (g)"
                value={mass}
                setValue={setMass}
                placeholder={'0.0 g'}
                inputValidation='mass'
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
            <Button 
                prompt="Finished?" 
                clickHandler={() =>  {
                    if (regenTail) {
                        verifyForm(
                            lizardErrors,
                            {
                                sex,
                                mass,
                                speciesCode,
                                trap,
                                svl,
                                vtl,
                                otl,
                            },
                            setNotification,
                            setConfirmationModalIsOpen,
                            setErrors
                        )
                    } else {
                        verifyForm(
                            lizardErrors,
                            {
                                sex,
                                mass,
                                speciesCode,
                                trap,
                                svl,
                                vtl,
                            },
                            setNotification,
                            setConfirmationModalIsOpen,
                            setErrors
                        )
                    }
                }}
            />
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
                        mass,
                        sex,
                        isDead,
                        comments,
                    }}
                    completeCapture={() => completeLizardCapture(
                        setCurrentData,
                        currentData,
                        setCurrentForm,
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
                            mass,
                            sex,
                            isDead,
                            comments,
                        },
                        environment,
                        setLastEditTime
                    )}
                    setConfirmationModalIsOpen={setConfirmationModalIsOpen}
                    modalType="lizard"
                />
            )}
        </FormWrapper>
        :
        <div>
            <ScaleLoader
                loading={true}
                color={'#8C1D40'}
                width={8}
                radius={15}
                height={40}
            />
            <p className="mt-10 text-black text-xl">Loading lizard data...</p>
        </div>
        
    );
}
