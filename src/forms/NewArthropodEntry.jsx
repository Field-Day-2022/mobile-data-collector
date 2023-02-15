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
    arthropodSpeciesList as species,
    arthropodFenceTraps as fenceTraps,
    arthropodSpeciesList,
} from '../utils/hardCodedData';

export default function NewArthropodEntry() {
    const [trap, setTrap] = useState();
    const [predator, setPredator] = useState(false);
    const [arthropodData, setArthropodData] = useState();
    const [comments, setComments] = useState('');
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);

    useEffect(() => {
        let initialArthropodData = {};
        for (const speciesItem of species) {
            initialArthropodData[speciesItem] = 0;
        }
        setArthropodData(initialArthropodData)
    }, []);

    // todo: input validation
    // todo: dynamic answer set loading

    const completeCapture = () => {
        const date = new Date();
        updateData(
            'arthropod',
            {
                trap,
                predator,
                arthropodData,
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
                value={trap}
                setValue={setTrap}
                placeholder="Fence Trap"
                options={fenceTraps}
            />
            <SingleCheckbox prompt="Predator?" value={predator} setValue={setPredator} />
            {species.map((item) => (
                <PlusMinusButtons
                    key={item}
                    onNumberChange={(changeAmount) =>
                        setArthropodData((arthropodData) => {
                            if (arthropodData[item] + changeAmount < 0) {
                                return ({...arthropodData})
                            } else {
                                return ({
                                    ...arthropodData,
                                    [item]: arthropodData[item] + changeAmount,
                                })
                            }
                            
                        })
                    }
                >
                    <NumberInput
                        value={arthropodData && arthropodData[item]}
                        key={item}
                        label={item}
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
