import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import NumberInput from '../components/NumberInput';
import Dropdown from '../components/Dropdown';
import FormWrapper from '../components/FormWrapper';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import { currentFormName, currentSessionData } from '../utils/jotai';
import { updateData } from '../utils/functions';
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

export default function NewArthropodEntry() {
    const [trap, setTrap] = useState();
    const [predator, setPredator] = useState(false);
    const [arthropodData, setArthropodData] = useState();
    const [comments, setComments] = useState('');
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [arthropodSpeciesList, setArthropodSpeciesList] = useState([]);
    const [fenceTraps, setFenceTraps] = useState([]);

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);

    // todo: input validation

    useEffect(() => {
        const getAnswerFormDataFromFirestore = async () => {
            const speciesSnapshot = await getDocsFromCache(
                query(
                    collection(db, 'AnswerSet'),
                    where('set_name', '==', 'arthropodSpeciesList')
                )
            )
            setArthropodSpeciesList(speciesSnapshot.docs[0].data().arthropodSpeciesArray);
            const fenceTrapsSnapshot = await getDocsFromCache(
                query(collection(db, 'AnswerSet'), where('set_name', '==', 'Fence Traps'))
            );
            let fenceTrapsArray = [];
            for (const answer of fenceTrapsSnapshot.docs[0].data().answers) {
                fenceTrapsArray.push(answer.primary);
            }
            setFenceTraps(fenceTrapsArray);
        }
        getAnswerFormDataFromFirestore();
    }, [])


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
            {arthropodSpeciesList.map((item) => (
                <NumberInput
                    key={item}
                    label={item}
                    placeholder="# of critters"
                    setValue={(value) => setArthropodData({ ...arthropodData, [item]: value })}
                />
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
