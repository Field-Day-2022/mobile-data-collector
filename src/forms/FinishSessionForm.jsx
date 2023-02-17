import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
    currentFormName,
    currentSessionData,
    pastSessionData,
    editingPrevious,
    pastEntryIndex,
    currentPageName,
    notificationText,
    appMode
} from '../utils/jotai';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../index';

import {
    collection,
    setDoc,
    query,
    where,
    doc,
    getDocs,
    addDoc,
    writeBatch,
} from 'firebase/firestore';

import FormWrapper from '../components/FormWrapper';
import Dropdown from '../components/Dropdown';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

export const FinishSessionForm = () => {
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);
    const [pastSessions, setPastSessions] = useAtom(pastSessionData);
    const [isEditingPrevious, setIsEditingPrevious] = useAtom(editingPrevious);
    const [entryIndex, setEntryIndex] = useAtom(pastEntryIndex);
    const [currentPage, setCurrentPage] = useAtom(currentPageName);
    const [notification, setNotification] = useAtom(notificationText);
    const [trapStatus, setTrapStatus] = useState('');
    const [comments, setComments] = useState('');
    const [environment, setEnvironment] = useAtom(appMode);

    const [answerSet, answerSetLoading, answerSetError, answerSetSnapshot] = useCollectionData(
        collection(db, 'AnswerSet')
    );

    const uploadSessionData = async (sessionObj) => {
        if (isEditingPrevious) {
            console.log(entryIndex);
            const sessionId = pastSessions[entryIndex].sessionId;
            let collectionName = `Test${currentData.project}Session`;
            if (environment === 'live') collectionName = `${currentData.project}Session`
            console.log(
                `Updating existing entry with id ${sessionId} in ${collectionName}`
            );
            await setDoc(doc(db, collectionName, sessionId), sessionObj);
            console.log('Successfully overwritten');
            setNotification('Successfully added to session');
            setPastSessions((pastSessions) =>
                pastSessions.map((session) => {
                    if (session.sessionId === sessionId) {
                        return {
                            sessionId,
                            sessionData: currentData,
                        };
                    } else {
                        return session;
                    }
                })
            );
            setIsEditingPrevious(false);
        } else {
            setPastSessions([
                ...pastSessions,
                {
                    uploaded: false,
                    sessionData: currentData,
                }
            ])
            let collectionName = `Test${currentData.project}Session`;
            if (environment === 'live') collectionName = `${currentData.project}Session`
            console.log(`Uploading new entry to ${collectionName}`);
            const docRef = await addDoc(
                collection(db, collectionName),
                sessionObj
            )
            console.log('uploading and adding session id')
            setPastSessions((pastSessions) =>
                pastSessions.map((session) => {
                    if (session.sessionData.sessionDateTime === currentData.sessionDateTime) {
                        return {
                            uploaded: true,
                            sessionId: docRef.id,
                            sessionData: currentData,
                        };
                    } else {
                        return session;
                    }
                })
            );
            setNotification('Successfully added new session');
        }
    };

    const uploadBatchedEntryData = async (entryDataArray) => {
        let collectionName = `Test${currentData.project}Data`;
        let lizardCollection = 'TestLizardData'
        if (environment === 'live') {
            collectionName = `${currentData.project}Data`
            lizardCollection = 'LizardData'
        }
        console.log(`Uploading to ${collectionName}`);
        const dataBatch = writeBatch(db);
        const lizardBatch = writeBatch(db);
        for (const entryObject of entryDataArray) {
            for (const key in entryObject) {
                if (!entryObject[key]) {
                    entryObject[key] = 'N/A';
                }
            }
            const timestamp = new Date(entryObject.dateTime);
            const entryId = `${currentData.site}${entryObject.taxa}${timestamp.getTime()}`;
            dataBatch.set(doc(db, collectionName, entryId), entryObject);
            if (entryObject.taxa === "Lizard")
                lizardBatch.set(doc(db, lizardCollection, entryId), entryObject);
        }
        await dataBatch.commit();
        await lizardBatch.commit();
        console.log('batch(es) written successfully');
        console.log(entryDataArray);
    };

    // TODO: consider fine tuning the data that is uploaded to eliminate N/A fields where they aren't needed

    const finishSession = () => {
        const date = new Date();
        const sessionObj = {
            array: currentData.array,
            commentsAboutTheArray: comments,
            dateTime: date.toLocaleString(),
            handler: currentData.handler,
            noCaptures: currentData.captureStatus,
            recorder: currentData.recorder,
            site: currentData.site,
            trapStatus: trapStatus,
            year: date.getFullYear(),
        };
        console.log(sessionObj);
        const dataObjTemplate = {
            aran: 'N/A',
            array: 'N/A',
            auch: 'N/A',
            blat: 'N/A',
            cclMm: 'N/A',
            chil: 'N/A',
            cole: 'N/A',
            comments: 'N/A',
            crus: 'N/A',
            dateTime: 'N/A',
            dead: 'N/A',
            derm: 'N/A',
            diel: 'N/A',
            dipt: 'N/A',
            fenceTrap: 'N/A',
            genus: 'N/A',
            hatchling: 'N/A',
            hdBody: 'N/A',
            hete: 'N/A',
            hyma: 'N/A',
            lepi: 'N/A',
            mant: 'N/A',
            massG: 'N/A',
            micro: 'N/A',
            orth: 'N/A',
            otlMm: 'N/A',
            plMm: 'N/A',
            predator: 'N/A',
            pseu: 'N/A',
            recapture: 'N/A',
            regenTail: 'N/A',
            scor: 'N/A',
            sessionDateTime: 'N/A',
            sex: 'N/A',
            site: 'N/A',
            soli: 'N/A',
            species: 'N/A',
            speciesCode: 'N/A',
            svlMm: 'N/A',
            taxa: 'N/A',
            thys: 'N/A',
            toeClipCode: 'N/A',
            unki: 'N/A',
            vtlMm: 'N/A',
            year: 'N/A',
        };
        let dataArray = [];
        if (currentData.amphibian) {
            for (const dataEntry of currentData.amphibian) {
                const [genus, species] = getGenusSpecies(
                    currentData.project,
                    'Amphibian',
                    dataEntry.speciesCode
                ) || ['N/A', 'N/A'];
                const entryDate = new Date(dataEntry.dateTime);
                const year = entryDate.getFullYear();
                const obj = structuredClone(dataObjTemplate);
                obj.array = currentData.array;
                obj.dateTime = dataEntry.dateTime;
                obj.dead = dataEntry.isDead;
                obj.fenceTrap = dataEntry.trap;
                obj.genus = genus;
                obj.hdBody = dataEntry.hdBody;
                obj.massG = dataEntry.massG;
                obj.sessionDateTime = currentData.sessionDateTime;
                obj.sex = dataEntry.sex;
                obj.site = currentData.site;
                obj.species = species;
                obj.speciesCode = dataEntry.speciesCode;
                obj.taxa = 'Amphibian';
                obj.year = year;
                obj.comments = dataEntry.comments;
                dataArray.push(obj);
            }
        }
        if (currentData.lizard) {
            for (const dataEntry of currentData.lizard) {
                const [genus, species] = getGenusSpecies(
                    currentData.project,
                    'Lizard',
                    dataEntry.speciesCode
                ) || ['N/A', 'N/A'];
                const entryDate = new Date(dataEntry.dateTime);
                const year = entryDate.getFullYear();
                const obj = structuredClone(dataObjTemplate);
                obj.array = currentData.array;
                obj.dateTime = dataEntry.dateTime;
                obj.dead = dataEntry.isDead;
                obj.fenceTrap = dataEntry.trap;
                obj.genus = genus;
                obj.hatchling = dataEntry.isHatchling;
                obj.massG = dataEntry.mass;
                obj.otlMMm = dataEntry.otl;
                obj.recapture = dataEntry.isRecapture;
                obj.regenTail = dataEntry.regenTail;
                obj.sessionDateTime = currentData.sessionDateTime;
                obj.sex = dataEntry.sex;
                obj.site = currentData.site;
                obj.species = species;
                obj.speciesCode = dataEntry.speciesCode;
                obj.svlMm = dataEntry.svl;
                obj.taxa = 'Lizard';
                obj.toeClipCode = dataEntry.toeCode;
                obj.vtlMm = dataEntry.vtl;
                obj.year = year;
                obj.comments = dataEntry.comments;
                dataArray.push(obj);
            }
        }
        if (currentData.snake) {
            for (const dataEntry of currentData.snake) {
                const [genus, species] = getGenusSpecies(
                    currentData.project,
                    'Snake',
                    dataEntry.speciesCode
                ) || ['N/A', 'N/A'];
                const entryDate = new Date(dataEntry.dateTime);
                const year = entryDate.getFullYear();
                const obj = structuredClone(dataObjTemplate);
                obj.array = currentData.array;
                obj.comments = dataEntry.comments;
                obj.dateTime = dataEntry.dateTime;
                obj.dead = dataEntry.isDead;
                obj.fenceTrap = dataEntry.trap;
                obj.genus = genus;
                obj.massG = dataEntry.mass;
                obj.sessionDateTime = currentData.sessionDateTime;
                obj.sex = dataEntry.sex;
                obj.site = currentData.site;
                obj.species = species;
                obj.speciesCode = dataEntry.speciesCode;
                obj.svlMm = dataEntry.svl;
                obj.taxa = 'Snake';
                obj.vtlMm = dataEntry.vtl;
                obj.year = year;
                dataArray.push(obj);
            }
        }
        if (currentData.arthropod) {
            for (const dataEntry of currentData.arthropod) {
                const [genus, species] = getGenusSpecies(
                    currentData.project,
                    'Snake',
                    dataEntry.speciesCode
                ) || ['N/A', 'N/A'];
                const entryDate = new Date(dataEntry.dateTime);
                const year = entryDate.getFullYear();
                const obj = structuredClone(dataObjTemplate);
                obj.trap = dataEntry.trap;
                obj.predator = dataEntry.predator;
                obj.genus = genus;
                obj.species = species;
                obj.site = currentData.site;
                obj.array = currentData.array;
                obj.dateTime = dataEntry.dateTime;
                obj.sessionDateTime = currentData.sessionDateTime;
                obj.year = year;
                obj.comments = currentData.comments;
                for (const key in dataEntry.arthropodData) {
                    obj[key] = dataEntry.arthropodData[key];
                }
                obj.fenceTrap = dataEntry.trap;
                obj.taxa = 'Arthropod';
                dataArray.push(obj);
            }
        }
        if (currentData.mammal) {
            for (const dataEntry of currentData.mammal) {
                const [genus, species] = getGenusSpecies(
                    currentData.project,
                    'Amphibian',
                    dataEntry.speciesCode
                ) || ['N/A', 'N/A'];
                const entryDate = new Date(dataEntry.dateTime);
                const year = entryDate.getFullYear();
                const obj = structuredClone(dataObjTemplate);
                obj.array = currentData.array;
                obj.dateTime = dataEntry.dateTime;
                obj.fenceTrap = dataEntry.trap;
                obj.genus = genus;
                obj.sessionDateTime = currentData.sessionDateTime;
                obj.site = currentData.site;
                obj.species = species;
                obj.speciesCode = dataEntry.speciesCode;
                obj.taxa = 'Mammal';
                obj.year = year;
                obj.comments = dataEntry.comments;
                obj.dead = dataEntry.isDead;
                obj.massG = dataEntry.mass;
                obj.sex = dataEntry.sex;
                dataArray.push(obj);
            }
        }
        console.log(dataArray);
        uploadSessionData(sessionObj);
        uploadBatchedEntryData(dataArray);
        setCurrentPage('Home');
        setCurrentForm('');
        setCurrentData({
            captureStatus: '',
            array: '',
            project: '',
            site: '',
            handler: '',
            recorder: '',
            arthropod: [],
            amphibian: [],
            lizard: [],
            mammal: [],
            snake: [],
        });
    };

    const getGenusSpecies = (project, taxa, speciesCode) => {
        for (const set of answerSet) {
            if (set.set_name === `${project}${taxa}Species`) {
                // console.log(set)
                for (const answer of set.answers) {
                    if (answer.primary === speciesCode) {
                        // console.log(answer.secondary.Genus)
                        return [answer.secondary.Genus, answer.secondary.Species];
                    }
                }
            }
        }
    };

    return (
        <FormWrapper>
            <Dropdown
                value={trapStatus}
                setValue={setTrapStatus}
                placeholder="Trap Status"
                options={['OPEN', 'CHECKED', 'CHECKED & CLOSED']}
            />
            {trapStatus && (
                <TextInput
                    prompt="Comments"
                    placeholder="any thoughts about this array?"
                    value={comments}
                    setValue={setComments}
                />
            )}
            {trapStatus && <Button prompt="Done" clickHandler={finishSession} />}
        </FormWrapper>
    );
};
