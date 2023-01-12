import { useState } from 'react';
import { useAtom } from 'jotai'

import NumberInput from '../components/NumberInput';
import Dropdown from '../components/Dropdown';
import FormWrapper from '../components/FormWrapper';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

import { currentFormName, currentSessionData } from '../utils/jotai';
import { updateData } from '../utils/functions';
//TODO: species list for snakes
import {
    mammalSpeciesList as species,
    sexOptions,
    mammalFenceTraps as fenceTraps
} from "../utils/hardCodedData";

// NOTE: this is a placeholder
// need to add SVL & VTL - this is just a start and I don't want to add merge conflicts


//TODO: update species codes for snakes
//TODO: add VTL and STL
export default function NewSnakeEntry() {
    const [ speciesCode, setSpeciesCode] = useState()
    const [trap, setTrap] = useState();
    const [mass,setMass] = useState('');
    const [ sex, setSex] = useState()
    const [isDead, setIsDead] = useState()
    const [comments, setComments] = useState('')

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);

    const completeCapture = () => {
        updateData(
            'snake',
            {
                speciesCode,
                trap,
                mass,
                sex,
                isDead,
                comments
            },
            setCurrentData,
            currentData,
            setCurrentForm
        )
    }

    return (
        <FormWrapper>
            <Dropdown
                value={speciesCode}
                setValue={setSpeciesCode}
                placeholder="Species Code"
                options={species}
            />
            <Dropdown
                value={trap}
                setValue={setTrap}
                placeholder="Fence Trap"
                options={fenceTraps}
            />
            <NumberInput
                label="SVL (mm)"
                value={mass}
                setValue={setMass}
                placeholder="ex: 1.2"
            />
            <NumberInput
                label="VTL (mm)"
                value={mass}
                setValue={setMass}
                placeholder="ex: 1.2"
            />
            <NumberInput
                label="Mass (g)"
                value={mass}
                setValue={setMass}
                placeholder="ex: 1.2"
            />
            <Dropdown
                value={sex}
                setValue={setSex}
                placeholder="Sex"
                options={sexOptions}
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
                clickHandler={completeCapture}
            />
        </FormWrapper>
    )

}
