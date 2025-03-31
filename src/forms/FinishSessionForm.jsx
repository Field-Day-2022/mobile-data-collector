import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
    currentFormName,
    currentSessionData,
    pastSessionData,
    editingPrevious,
    pastEntryIndex,
    currentPageName,
    notificationText,
    appMode,
    sessionObject,
} from '../utils/jotai';

import { db } from '../index';

import {
    collection,
    setDoc,
    doc,
    addDoc,
    writeBatch,
    getDocsFromCache,
    updateDoc,
    arrayRemove,
} from 'firebase/firestore';

import FormWrapper from '../components/FormWrapper';
import Dropdown from '../components/Dropdown';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { getStandardizedDateTimeString } from '../utils/functions';

export const FinishSessionForm = () => {
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const setCurrentForm = useSetAtom(currentFormName);
    const [pastSessions, setPastSessions] = useAtom(pastSessionData);
    const [isEditingPrevious, setIsEditingPrevious] = useAtom(editingPrevious);
    const entryIndex = useAtomValue(pastEntryIndex);
    const setCurrentPage = useSetAtom(currentPageName);
    const setNotification = useSetAtom(notificationText);
    const [trapStatus, setTrapStatus] = useState('');
    const [comments, setComments] = useState('');
    const environment = useAtomValue(appMode);
    const [answerSet, setAnswerSet] = useState([]);
    const [pastSessionObj, setPastSessionObj] = useAtom(sessionObject);

    useEffect(() => {
        const getAnswerSet = async () => {
            const answerSetSnapshot = await getDocsFromCache(collection(db, 'AnswerSet'));
            let tempAnswerSetArray = [];
            answerSetSnapshot.docs.forEach((document) => {
                tempAnswerSetArray.push(document.data());
            });
            setAnswerSet(tempAnswerSetArray);
        };
        getAnswerSet();
    }, []);

    useEffect(() => {
        if (isEditingPrevious) {
            setComments(pastSessionObj.commentsAboutTheArray);
            setTrapStatus(pastSessionObj.trapStatus);
        }
    }, [isEditingPrevious]);

    const uploadSessionData = async (sessionObj) => {
        if (isEditingPrevious) {
            console.log(entryIndex);
            const sessionId = pastSessions[entryIndex].sessionId;
            
            // Format collection name by removing spaces consistently 
            let collectionName = `Test${currentData.project.replace(/\s/g, '')}Session`;
            if (environment === 'live') {
                collectionName = `${currentData.project.replace(/\s/g, '')}Session`;
            }
            
            console.log(`Updating existing entry with id ${sessionId} in ${collectionName}`);
            await setDoc(doc(db, collectionName, sessionId), sessionObj);
            console.log('Successfully overwritten');
            setNotification('Successfully added to session');
            
            // Update past sessions entry
            setPastSessions((pastSessions) =>
                pastSessions.map((session) => {
                    if (session.sessionId === sessionId) {
                        return {
                            uploaded: true,
                            sessionId,
                            sessionData: currentData,
                            sessionObj,
                        };
                    } else {
                        return session;
                    }
                }),
            );
            setIsEditingPrevious(false);
        } else {
            // Add to past sessions with proper collection name handling
            setPastSessions([
                ...pastSessions,
                {
                    uploaded: false,
                    sessionData: currentData,
                    sessionObj,
                },
            ]);
            
            // Format collection name consistently
            let collectionName = `Test${currentData.project.replace(/\s/g, '')}Session`;
            if (environment === 'live') {
                collectionName = `${currentData.project.replace(/\s/g, '')}Session`;
            }
            
            console.log(`Uploading new entry to ${collectionName}`);
            const docRef = await addDoc(collection(db, collectionName), sessionObj);
            console.log('uploading and adding session id');
            
            // Update past sessions with upload status
            setPastSessions((pastSessions) =>
                pastSessions.map((session) => {
                    if (session.sessionData.sessionDateTime === currentData.sessionDateTime) {
                        return {
                            uploaded: true,
                            sessionId: docRef.id,
                            sessionData: currentData,
                            sessionObj,
                        };
                    } else {
                        return session;
                    }
                }),
            );
            setNotification('Successfully added new session');
        }
    };

   // Modify the collection name handling for uploadBatchedEntryData
const uploadBatchedEntryData = async (entryDataArray) => {
    // Use the exact project name with spaces preserved
    let collectionName = `Test${currentData.project}Data`;
    if (environment === 'live') {
        collectionName = `${currentData.project}Data`;
    }
    
    console.log(`Uploading to ${collectionName}`);
    console.log("Entry data array:", entryDataArray);  // Add this line
    
    if (entryDataArray.length === 0) {
        console.warn("No entries to upload");
        return;
    }
    
    const dataBatch = writeBatch(db);
    for (const entryObject of entryDataArray) {
        // Ensure all required fields have values
        for (const key in entryObject) {
            if (!entryObject[key]) {
                entryObject[key] = 'N/A';
            }
        }
        
        let taxa = entryObject.taxa;
        if (taxa === 'N/A') {
            taxa = 'Arthropod';
        }
        
        const entryId = `${currentData.site}${taxa}${entryObject.entryId}`;
        console.log(`Creating document: ${entryId}`);
        dataBatch.set(doc(db, collectionName, entryId), entryObject);
        
        if (taxa === 'Lizard') {
            await updateDoc(doc(db, 'Metadata', 'LizardData'), {
                deletedEntries: arrayRemove({
                    entryId,
                    collectionId: collectionName,
                }),
            });
        }
    }
    
    await dataBatch.commit();
    console.log('batch(es) written successfully');
    console.log(entryDataArray);
};

const finishSession = () => {
    const sessionDateTime = new Date(currentData.sessionEpochTime);
    const sessionObj = {
        array: currentData.array,
        commentsAboutTheArray: comments,
        dateTime: currentData.sessionDateTime,
        handler: currentData.handler,
        noCaptures: currentData.captureStatus === 'withoutCaptures' ? 'true' : 'false',
        recorder: currentData.recorder,
        site: currentData.site,
        trapStatus: trapStatus,
        year: sessionDateTime.getFullYear().toString(),
        sessionId: currentData.sessionEpochTime,
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
        hymb: 'N/A',
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
        noCapture: 'N/A',
        lastEdit: 'N/A',
        sessionId: currentData.sessionEpochTime,
    };
    
    let dataArray = [];
    
    // Process lizard data
    if (currentData.lizard && currentData.lizard.length > 0) {
        console.log(`Processing ${currentData.lizard.length} lizard entries`);
        for (const dataEntry of currentData.lizard) {
            console.log("Full lizard entry data:", dataEntry);
            
            // Get genus and species if not already in the entry
            if (!dataEntry.genus || !dataEntry.species) {
                const [genus, species] = getGenusSpecies(
                    currentData.project,
                    'Lizard',
                    dataEntry.speciesCode
                ) || ['N/A', 'N/A'];
                dataEntry.genus = genus || 'N/A';
                dataEntry.species = species || 'N/A';
            }
            
            // Copy the entry as is to preserve all fields
            const obj = structuredClone(dataObjTemplate);
            for (const key in dataEntry) {
                if (dataEntry[key] !== undefined) {
                    obj[key] = dataEntry[key];
                }
            }
            
            // Ensure these critical fields are set
            obj.taxa = 'Lizard';
            obj.sessionId = currentData.sessionEpochTime;
            
            dataArray.push(obj);
        }
    }
    
    // Process amphibian data
    if (currentData.amphibian && currentData.amphibian.length > 0) {
        for (const dataEntry of currentData.amphibian) {
            const [genus, species] = getGenusSpecies(
                currentData.project,
                'Amphibian',
                dataEntry.speciesCode,
            ) || ['N/A', 'N/A'];
            const entryDate = new Date(dataEntry.dateTime);
            const year = entryDate.getFullYear();
            const obj = structuredClone(dataObjTemplate);
            obj.array = currentData.array;
            obj.dateTime = dataEntry.dateTime;
            obj.lastEdit = entryDate.getTime();
            obj.dead = dataEntry.isDead ? 'true' : 'false';
            obj.fenceTrap = dataEntry.trap;
            obj.genus = genus;
            obj.hdBody = dataEntry.hdBody;
            obj.massG = dataEntry.mass;
            obj.sessionDateTime = getStandardizedDateTimeString(sessionDateTime);
            obj.sex = dataEntry.sex.charAt(0);
            obj.site = currentData.site;
            obj.species = species;
            obj.speciesCode = dataEntry.speciesCode;
            obj.taxa = 'Amphibian';
            obj.year = year.toString();
            obj.comments = dataEntry.comments;
            obj.entryId = dataEntry.entryId;
            dataArray.push(obj);
        }
    }
    
    // Process snake data
    if (currentData.snake && currentData.snake.length > 0) {
        for (const dataEntry of currentData.snake) {
            const [genus, species] = getGenusSpecies(
                currentData.project,
                'Snake',
                dataEntry.speciesCode,
            ) || ['N/A', 'N/A'];
            const entryDate = new Date(dataEntry.dateTime);
            const year = entryDate.getFullYear();
            const obj = structuredClone(dataObjTemplate);
            obj.array = currentData.array;
            obj.comments = dataEntry.comments;
            obj.dateTime = dataEntry.dateTime;
            obj.lastEdit = entryDate.getTime();
            obj.dead = dataEntry.isDead ? 'true' : 'false';
            obj.fenceTrap = dataEntry.trap;
            obj.genus = genus;
            obj.massG = dataEntry.mass;
            obj.sessionDateTime = getStandardizedDateTimeString(sessionDateTime);
            obj.sex = dataEntry.sex.charAt(0);
            obj.site = currentData.site;
            obj.species = species;
            obj.speciesCode = dataEntry.speciesCode;
            obj.svlMm = dataEntry.svl;
            obj.taxa = 'Snake';
            obj.vtlMm = dataEntry.vtl;
            obj.year = year.toString();
            obj.noCapture = dataEntry.noCapture;
            obj.entryId = dataEntry.entryId;
            dataArray.push(obj);
        }
    }
    
    // Process arthropod data
    if (currentData.arthropod && currentData.arthropod.length > 0) {
        for (const dataEntry of currentData.arthropod) {
            const [genus, species] = getGenusSpecies(
                currentData.project,
                'Snake',
                dataEntry.speciesCode,
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
            obj.lastEdit = entryDate.getTime();
            obj.sessionDateTime = getStandardizedDateTimeString(sessionDateTime);
            obj.year = year.toString();
            obj.comments = dataEntry.comments;
            for (const key in dataEntry.arthropodData) {
                obj[key] = String(dataEntry.arthropodData[key]);
            }
            obj.fenceTrap = dataEntry.trap;
            obj.taxa = 'Arthropod';
            obj.entryId = dataEntry.entryId;
            dataArray.push(obj);
        }
    }
    
    // Process mammal data
    if (currentData.mammal && currentData.mammal.length > 0) {
        for (const dataEntry of currentData.mammal) {
            const [genus, species] = getGenusSpecies(
                currentData.project,
                'Mammal',
                dataEntry.speciesCode,
            ) || ['N/A', 'N/A'];
            const entryDate = new Date(dataEntry.dateTime);
            const year = entryDate.getFullYear();
            const obj = structuredClone(dataObjTemplate);
            obj.array = currentData.array;
            obj.dateTime = dataEntry.dateTime;
            obj.lastEdit = entryDate.getTime();
            obj.fenceTrap = dataEntry.trap;
            obj.genus = genus;
            obj.sessionDateTime = getStandardizedDateTimeString(sessionDateTime);
            obj.site = currentData.site;
            obj.species = species;
            obj.speciesCode = dataEntry.speciesCode;
            obj.taxa = 'Mammal';
            obj.year = year.toString();
            obj.comments = dataEntry.comments;
            obj.dead = dataEntry.isDead ? 'true' : 'false';
            obj.massG = dataEntry.mass;
            obj.sex = dataEntry.sex.charAt(0);
            obj.entryId = dataEntry.entryId;
            dataArray.push(obj);
        }
    }
    
    console.log(dataArray);
    uploadSessionData(sessionObj);
    uploadBatchedEntryData(dataArray);
    setCurrentPage('Collect Data');
    setCurrentForm('New Data');
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
    setPastSessionObj({});
};

    const getGenusSpecies = (project, taxa, speciesCode) => {
        for (const set of answerSet) {
            console.log(`${project}${taxa}Species`);
            if (set.set_name === `${project}${taxa}Species`) {
                console.log(set);
                for (const answer of set.answers) {
                    if (answer.primary === speciesCode) {
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
