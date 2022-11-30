import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { collection, setDoc, query, where, doc, getDocsFromCache } from 'firebase/firestore'
import { db } from '../index'


import { currentFormName, currentSessionData } from '../utils/jotai';
import { updateData } from '../utils/functions';

import FormWrapper from '../components/FormWrapper';
import Dropdown from '../components/Dropdown';
import SingleCheckbox from '../components/SingleCheckbox';
import ToeCodeInput from '../components/ToeCodeInput';
import NumberInput from '../components/NumberInput';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

export default function NewLizardEntry() {
  const [speciesCode, setSpeciesCode] = useState();
  const [trap, setTrap] = useState();
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
  const [updatedToeCodes, setUpdatedToeCodes] = useState()
  const [ lizardSpeciesList, setLizardSpeciesList ] = useState([])
  const [ fenceTraps, setFenceTraps ] = useState([])

  // TODO: add input validation logic for svl, vtl, otl, and mass

  const [currentData, setCurrentData] = useAtom(currentSessionData);
  const [currentForm, setCurrentForm] = useAtom(currentFormName);

  const sexOptions = [
    'Male',
    'Female',
    'Undefined'
  ]

  useEffect(() => {
    const getAnswerFormDataFromFirestore = async () => {
      const speciesSnapshot = await getDocsFromCache(
        query(
          collection(db, "AnswerSet"),
          where("set_name", "==", `${currentData.project}LizardSpecies`)
        )
      )
      let speciesCodesArray = []
      for (const answer of speciesSnapshot.docs[0].data().answers) {
        speciesCodesArray.push(answer.primary)
      }
      setLizardSpeciesList(speciesCodesArray)
      const fenceTrapsSnapshot = await getDocsFromCache(
        query(
          collection(db, "AnswerSet"),
          where("set_name", "==", "Fence Traps")
        )
      )
      let fenceTrapsArray = []
      for (const answer of fenceTrapsSnapshot.docs[0].data().answers) {
        fenceTrapsArray.push(answer.primary)
      }
      setFenceTraps(fenceTrapsArray)
    }
    getAnswerFormDataFromFirestore()
  }, [])

  const sendToeCodeDataToFirestore = async () => {
    await setDoc(doc(db, "TestToeClipCodes", currentData.site), updatedToeCodes)
  }

  const completeCapture = () => {
    const date = new Date()
    sendToeCodeDataToFirestore()
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
        placeholder='Species Code'
        options={lizardSpeciesList}
      />
      <Dropdown
        value={trap}
        setValue={setTrap}
        placeholder='Fence Trap'
        options={fenceTraps}
      />
      <SingleCheckbox
        prompt='Is it a recapture?'
        value={isRecapture}
        setValue={setIsRecapture}
      />
      {speciesCode && <ToeCodeInput
          toeCode={toeCode}
          setToeCode={setToeCode}
          speciesCode={speciesCode}
          isRecapture={isRecapture}
          setIsRecapture={setIsRecapture}
          setUpdatedToeCodes={setUpdatedToeCodes}
      />}
      {toeCode && <NumberInput 
        label="SVL (mm)"
        value={svl}
        setValue={setSvl}
        placeholder="0.0 mm"
      />}
      {svl && <NumberInput 
        label="VTL (mm)"
        value={vtl}
        setValue={setVtl}
        placeholder="0.0 mm"
      />}
      {vtl && <SingleCheckbox 
        prompt="Regen tail?"
        value={regenTail}
        setValue={setRegenTail}
      />}
      {vtl && <NumberInput 
        label="OTL (mm)"
        value={otl}
        setValue={setOtl}
        placeholder="0.0 mm"
      />}
      {otl && <SingleCheckbox 
        prompt="Is it a hatchling?"
        value={isHatchling}
        setValue={setIsHatchling}
      />}
      {otl && <NumberInput 
        label="Mass (g)"
        value={mass}
        setValue={setMass}
      />}
      {mass && <Dropdown 
        value={sex}
        setValue={setSex}
        placeholder="Sex"
        options={sexOptions}
      />}
      {sex && <SingleCheckbox 
        prompt="Is it dead?"
        value={isDead}
        setValue={setIsDead}
      />}
      {sex && <TextInput 
        prompt="Comments"
        placeholder="any thoughts?"
        value={comments}
        setValue={setComments}
      />}
      {sex && <Button 
        prompt="Finished?"
        clickHandler={completeCapture}
      />}
    </FormWrapper>
  );
}
