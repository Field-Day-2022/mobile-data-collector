import { useState } from 'react'
import { useAtom } from 'jotai'

import { currentFormName, currentSessionData } from '../utils/jotai'
import { updateData } from '../utils/functions'

import {
  lizardSpeciesList as species,
  amphibianFenceTraps as fenceTraps
} from '../utils/hardCodedData'

import FormWrapper from '../components/FormWrapper'
import Dropdown from '../components/Dropdown'
import SingleCheckbox from '../components/SingleCheckbox'
import ToeCodeInput from '../components/ToeCodeInput'

export default function NewLizardEntry() {
  const [ speciesCode, setSpeciesCode ] = useState()
  const [ trap, setTrap ] = useState()
  const [ isRecapture, setIsRecapture ] = useState()
  const [ toeCode, setToeCode ] = useState('A1B2C4')
  const [ svl, setSvl ] = useState()
  const [ vtl, setVtl ] = useState()
  const [ regenTail, setRegenTail ] = useState()
  const [ otl, setOtl ] = useState()
  const [ isHatchling, setIsHatchling ] = useState()
  const [ mass, setMass ] = useState()
  const [ sex, setSex ] = useState()
  const [ isDead, setIsDead ] = useState()
  const [ comments, setComments ] = useState()

  const [currentData, setCurrentData] = useAtom(currentSessionData)
  const [currentForm, setCurrentForm] = useAtom(currentFormName);
  
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
      <SingleCheckbox 
        prompt="Is it dead?"
        value={isDead}
        setValue={setIsDead}
      />
      <ToeCodeInput 
        toeCode={toeCode}
        setToeCode={setToeCode}
      />
    </FormWrapper>
  )
}