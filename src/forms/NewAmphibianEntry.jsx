import { useState } from 'react';
import { useAtom } from 'jotai'

import { currentFormName, currentSessionData } from '../utils/jotai';
import { updateData } from '../utils/functions';

import {
  amphibianFenceTraps as fenceTraps,
  amphibianSpecies as species,
  sexOptions
} from '../utils/hardCodedData'

import NumberInput from '../components/NumberInput';
import FormWrapper from '../components/FormWrapper';
import Dropdown from '../components/Dropdown';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

export default function NewAmphibianEntry() {
  const [ speciesCode, setSpeciesCode ] = useState()
  const [ trap, setTrap ] = useState()
  const [ hdBody, setHdBody ] = useState('')
  const [ mass,  setMass] = useState('')
  const [ sex, setSex] = useState()
  const [ isDead, setIsDead ] = useState(false)
  const [ comments, setComments ] = useState('')

  const [currentData, setCurrentData] = useAtom(currentSessionData)
  const [currentForm, setCurrentForm] = useAtom(currentFormName);
  
  // todo: input validation

  const completeCapture = () => {
    const date = new Date()
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
        dateTime: date.toUTCString()
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
        label="HD-Body"
        value={hdBody}
        setValue={setHdBody}
        placeholder="HD-Body"
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