/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { 
    currentFormName, 
    currentSessionData, 
    notificationText, 
    appMode,
    toeCodeLoadedAtom,
    lizardDataLoadedAtom,
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
    getAnswerFormDataFromFirestore, 
    fetchToeCodes, 
    verifyLizardForm,
    completeLizardCapture,
} from '../utils/functions'

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
    const [mass, setMass] = useState('');
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
    const [currentToeClipCodesSnapshot, setCurrentToeClipCodesSnapshot] = useState();
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const setCurrentForm = useSetAtom(currentFormName);
    const setNotification = useSetAtom(notificationText);
    const environment = useAtomValue(appMode);
    const toeCodeLoaded = useAtomValue(toeCodeLoadedAtom);
    const lizardDataLoaded = useAtomValue(lizardDataLoadedAtom);

    const sexOptions = ['Male', 'Female', 'Unknown'];

    // just to give an idea of the dynamic shape (even though this isn't typescript)
    // interface SiteToeCodes {
    //     sites: Array<{
    //         [speciesCode]: string,
    //     }>
    // }

    useEffect(() => {
        getAnswerFormDataFromFirestore(currentData, setLizardSpeciesList, setFenceTraps);
        fetchToeCodes(currentData, environment, setSiteToeCodes, setCurrentToeClipCodesSnapshot);
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
                }
            }
            setSpeciesToeCodes(tempArray);
            console.log(
                `All preexisting toe codes from this species(${speciesCode}), array(${currentData.array}), and site(${currentData.site})`
            );
            console.log(tempArray);
        }
    }, [speciesCode]);
    
    return (
        ((toeCodeLoaded && lizardDataLoaded)) ?
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
            <SingleCheckbox prompt="Regen tail?" value={regenTail} setValue={setRegenTail} />
            <NumberInput
                isDisabled={!regenTail}
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
                value={mass}
                setValue={setMass}
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
            <Button prompt="Finished?" clickHandler={() => 
                verifyLizardForm(
                    sex,
                    mass,
                    speciesCode,
                    trap,
                    setNotification,
                    setConfirmationModalIsOpen,
                    setErrors
                )
            }/>
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
                    completeCapture={completeLizardCapture(
                        environment,
                        currentToeClipCodesSnapshot,
                        updatedToeCodes,
                        setNotification,
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
                        }
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
