
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai'
import {collection, setDoc, query, where, doc, getDocsFromCache } from 'firebase/firestore';
import { db } from '../index'



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


export default function NewSnakeEntry() {
    const [ speciesCode, setSpeciesCode] = useState()
    const [trap, setTrap] = useState();
    const [mass,setMass] = useState('');
    const [ sex, setSex] = useState()
    const [isDead, setIsDead] = useState()
    const [comments, setComments] = useState('')
    const [svl, setSvl] = useState('');
    const [vtl, setVtl] = useState('');
    const [ snakeSpeciesList, setSnakeSpeciesList ] = useState([])
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);

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
                comments
            },
            setCurrentData,
            currentData,
            setCurrentForm
        )
    }
    useEffect(() => {
        const getAnswerFormDataFromFirestore = async () => {
            const speciesSnapshot = await getDocsFromCache(
                query(
                    collection(db, "AnswerSet"),
                    where("set_name", "==", `${currentData.project}SnakeSpecies`)
                )
            )
            let speciesCodesArray = []
            for (const answer of speciesSnapshot.docs[0].data().answers) {
                speciesCodesArray.push(answer.primary)
            }
            setSnakeSpeciesList(speciesCodesArray)
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
//TODO: run tests with Isaiah - to figure out what's going wrong
}
