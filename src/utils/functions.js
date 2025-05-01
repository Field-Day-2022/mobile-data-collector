import {
    collection,
    where,
    query,
    getCountFromServer,
    writeBatch,
    doc,
    getDocsFromCache,
    getDocsFromServer,
    setDoc,
    getDocFromCache,
    updateDoc,
    getDocFromServer,
    arrayRemove,
    arrayUnion,
} from 'firebase/firestore';
import { db } from '../index';

export const updateData = (species, incomingData, setCurrentData, currentData, setCurrentForm) => {
    setCurrentData({
        ...currentData,
        [species]: [...currentData[species], incomingData],
    });
    setCurrentForm('New Data Entry');
};

export const changeStringsToNumbers = (obj) => {
    console.log('changing strings to numbers');
    for (const key in obj) {
        obj[key] = Number(obj[key]);
    }
    console.log(obj);
    return obj;
};

export const updatePreexistingArthropodData = (
    incomingData,
    setCurrentData,
    currentData,
    setCurrentForm,
) => {
    let tempArthropod = currentData.arthropod;
    let matchesPreviousFenceTrap = false;
    for (const arthropodEntry of tempArthropod) {
        console.log(`comparing ${arthropodEntry.trap} and ${incomingData.trap}`);
        if (arthropodEntry.trap === incomingData.trap) {
            matchesPreviousFenceTrap = true;
            console.log(arthropodEntry);
            for (const arthropodSpecies in arthropodEntry.arthropodData) {
                arthropodEntry.arthropodData[arthropodSpecies] =
                    Number(arthropodEntry.arthropodData[arthropodSpecies]) +
                    Number(incomingData.arthropodData[arthropodSpecies]);
            }
        }
    }
    if (!matchesPreviousFenceTrap) {
        setCurrentData({
            ...currentData,
            arthropod: [...currentData.arthropod, incomingData],
        });
    } else {
        setCurrentData({
            ...currentData,
            arthropod: tempArthropod,
        });
    }
    setCurrentForm('New Data Entry');
};

export const numReadsFirstTimeUser = async () => {
    const collectionArray = ['GatewayData', 'SanPedroData', 'VirginRiverData'];
    let netCount = 0;
    for (const collectionName of collectionArray) {
        const srcColRef = collection(db, collectionName);
        const q = query(srcColRef, where('taxa', '==', 'Lizard'));
        const snapshot = await getCountFromServer(q);
        console.log(
            `Count of lizard entry documents in ${collectionName}: ${snapshot.data().count}`,
        );
        netCount += snapshot.data().count;
    }
    console.log(`Net count of lizard entries: ${netCount}`);
    const answerSetColl = collection(db, 'AnswerSet');
    const answerSetSnapshot = await getCountFromServer(answerSetColl);
    console.log(`Number of answer set documents: ${answerSetSnapshot.data().count}`);
    netCount += answerSetSnapshot.data().count;
    console.log(`Total number of reads for first-time user: ${netCount}`);
};

export const checkForServerData = async (
    latestClientTime,
    latestServerTime,
    setLizardDataLoaded,
    environment,
) => {
    console.log(
        `comparing local: ${new Date(latestClientTime).toLocaleTimeString()} and ${new Date(
            latestServerTime,
        ).toLocaleTimeString()}`,
    );
    if (latestClientTime === 0) {
        await downloadAllLizardDataFromServer(environment);
        setLizardDataLoaded(true);
    } else if (latestClientTime < latestServerTime) {
        await downloadLatestLizardDataFromServer(latestClientTime, environment);
        setLizardDataLoaded(true);
    }
};

export const downloadAllLizardDataFromServer = async () => {
    const collections = [
        'GatewayData',
        'VirginRiverData',
        'SanPedroData',
        'TestGatewayData',
        'TestVirginRiverData',
        'TestSanPedroData',
    ];
    for (const collectionName of collections) {
        const incomingLizardData = await getDocsFromServer(
            query(collection(db, collectionName), where('taxa', '==', 'Lizard')),
        );
        console.log(`fresh lizard data downloaded from ${collectionName}:`);
        console.log(incomingLizardData);
    }
};

export const downloadLatestLizardDataFromServer = async (latestClientTime) => {
    const collections = [
        'GatewayData',
        'VirginRiverData',
        'SanPedroData',
        'TestGatewayData',
        'TestVirginRiverData',
        'TestSanPedroData',
    ];
    console.log(`getting all documents with a lastEdit > ${latestClientTime}`);
    for (const collectionName of collections) {
        const incomingLizardData = await getDocsFromServer(
            query(
                collection(db, collectionName),
                where('lastEdit', '>', latestClientTime),
                where('taxa', '==', 'Lizard'),
            ),
        );
        if (!incomingLizardData.empty) {
            console.log(`fresh lizard data downloaded from ${collectionName}:`);
            incomingLizardData.forEach((documentSnapshot) => {
                console.log(new Date(documentSnapshot.data().entryId).toLocaleTimeString());
            });
        }
    }
};

const fetchDocFromServer = async (entryId, collectionId) => {
    console.log(`Syncing ${entryId} with server...`);
    try {
        const docSnap = await getDocFromServer(doc(db, collectionId, entryId));
        if (docSnap.exists()) {
            console.log(
                `Unexpected: document ${docSnap.id} exists on server, removing from deletedEntries`,
            );
            await updateDoc(doc(db, 'Metadata', 'LizardData'), {
                deletedEntries: arrayRemove({
                    entryId,
                    collectionId,
                }),
            })
                .then(() => console.log('Success!'))
                .catch((err) => console.error(`Error: ${err}`));
        } else {
            console.log(`${entryId} does not exist on server, local db is now synced`);
        }
    } catch (exc) {
        console.error(exc);
    }
};

export const syncDeletedEntries = async (deletedEntries, setLizardDataLoaded) => {
    for (const { entryId, collectionId } of deletedEntries) {
        let entryData = null;
        try {
            entryData = await getDocFromCache(doc(db, collectionId, entryId));
        } catch (e) {
            if (e.toString().includes('Failed to get document from cache')) continue;
            else console.error(e);
        }
        if (entryData === null) continue;
        if (entryData.exists()) {
            console.log(`${entryId} exists in local db and deletedEntries... `);
            fetchDocFromServer(entryId, collectionId);
        }
    }
    setLizardDataLoaded(true);
};

export const getLizardAnswerFormDataFromFirestore = async (
    currentData,
    setLizardSpeciesList,
    setFenceTraps,
) => {
    const speciesSnapshot = await getDocsFromCache(
        query(
            collection(db, 'AnswerSet'),
            where('set_name', '==', `${currentData.project}LizardSpecies`),
        ),
    );
    let speciesCodesArray = [];
    for (const answer of speciesSnapshot.docs[0].data().answers) {
        speciesCodesArray.push(answer.primary);
    }
    setLizardSpeciesList(speciesCodesArray);
    const fenceTrapsSnapshot = await getDocsFromCache(
        query(collection(db, 'AnswerSet'), where('set_name', '==', 'Fence Traps')),
    );
    let fenceTrapsArray = [];
    for (const answer of fenceTrapsSnapshot.docs[0].data().answers) {
        fenceTrapsArray.push(answer.primary);
    }
    setFenceTraps(fenceTrapsArray);
};

export const verifyForm = (
    blankErrors,
    entryData,
    setNotification,
    setConfirmationModalIsOpen,
    setErrors,
    setContinueAnyways,
) => {
    let tempErrors = blankErrors;
    let errorExists = false;
    for (const key in entryData) {
        if (entryData[key] === '') {
            tempErrors[key] = 'Required';
            errorExists = true;
        } else if (entryData[key] === '0') {
            tempErrors[key] = 'Must not be 0';
        }
    }
    if (entryData.speciesCode !== '' && entryData.trap !== '') {
        setContinueAnyways(true);
    }
    if (errorExists) {
        setNotification('Errors in form');
    } else {
        setConfirmationModalIsOpen(true);
    }
    setErrors(tempErrors);
};

export const verifyArthropodForm = (
    trap,
    setNotification,
    setConfirmationModalIsOpen,
    setErrors,
) => {
    let tempErrors = {
        trap: '',
    };
    if (trap === '') tempErrors.trap = 'Required';
    let errorExists = false;
    if (tempErrors.trap !== '') errorExists = true;
    if (errorExists) setNotification('Errors in form');
    else {
        setConfirmationModalIsOpen(true);
    }
    setErrors(tempErrors);
};

export const verifyLizardForm = (
    sex,
    mass,
    speciesCode,
    trap,
    setNotification,
    setConfirmationModalIsOpen,
    setErrors,
) => {
    let tempErrors = {
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
    };
    if (sex === '') tempErrors.sex = 'Required';
    if (mass === '') tempErrors.mass = 'Required';
    if (speciesCode === '') tempErrors.speciesCode = 'Required';
    if (trap === '') tempErrors.fenceTrap = 'Required';

    let errorExists = false;
    for (const key in tempErrors) {
        if (tempErrors[key] !== '') errorExists = true;
    }
    if (errorExists) {
        setNotification('Errors in form');
    } else {
        setConfirmationModalIsOpen(true);
    }
    setErrors(tempErrors);
    console.log(tempErrors);
    console.log([trap, speciesCode]);
};

export const completeLizardCapture = async (
    setCurrentData,
    currentData,
    setCurrentForm,
    lizardData,
    environment,
    triggerLastEditUpdate,
    setLastEditTime,
) => {
    const date = new Date();
    console.log('setting new last edit time to ', date.getTime());
    setLastEditTime(date.getTime());
    const lizardDataWithTimes = {
        ...lizardData,
        dateTime: getStandardizedDateTimeString(currentData.sessionEpochTime),
        sessionDateTime: getStandardizedDateTimeString(currentData.sessionEpochTime),
        lastEdit: date.getTime(),
        entryId: date.getTime(),
    };
    const collectionName =
        environment === 'live'
            ? `${currentData.project.replace(/\s/g, '')}Data`
            : `Test${currentData.project.replace(/\s/g, '')}Data`;
    const lizardEntry = await createLizardEntry(currentData, lizardDataWithTimes);
    updateData('lizard', lizardEntry, setCurrentData, currentData, setCurrentForm);
    await setDoc(
        doc(db, collectionName, `${currentData.site}Lizard${date.getTime()}`),
        lizardEntry,
    );
    triggerLastEditUpdate();
};

export const updateLizardLastEditTime = async (newLastEditTime) => {
    console.log(`updating server lastEditTime to ${newLastEditTime}`);
    await updateDoc(doc(db, 'Metadata', 'LizardData'), {
        lastEditTime: newLastEditTime,
    });
};

export const getStandardizedDateTimeString = (dateString) => {
    const tempDate = new Date(dateString);
    return `${tempDate.getFullYear()}/${(tempDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${tempDate
        .getDate()
        .toString()
        .padStart(2, '0')} ${tempDate.toLocaleTimeString('en-US', {
        hourCycle: 'h23',
    })}`;
};

const createLizardEntry = async (currentData, dataEntry) => {
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
        noCapture: 'N/A',
        lastEdit: 'N/A',
        sessionId: currentData.sessionEpochTime,
    };
    const { genus, species } = await getGenusSpecies(
        currentData.project,
        'Lizard',
        dataEntry.speciesCode,
    );
    const entryDate = new Date(dataEntry.dateTime);
    const year = entryDate.getFullYear().toString();
    const obj = structuredClone(dataObjTemplate);
    obj.array = currentData.array || 'N/A';
    obj.dateTime = dataEntry.dateTime || 'N/A';
    obj.lastEdit = dataEntry.lastEdit;
    obj.entryId = dataEntry.entryId;
    obj.dead = dataEntry.isDead ? 'true' : 'false';
    obj.fenceTrap = dataEntry.trap || 'N/A';
    obj.genus = genus || 'N/A';
    obj.hatchling = dataEntry.isHatchling ? 'true' : 'false';
    obj.massG = dataEntry.mass || 'N/A';
    obj.otlMm = dataEntry.otl || 'N/A';
    obj.recapture = dataEntry.isRecapture ? 'true' : 'false';
    obj.regenTail = dataEntry.regenTail ? 'true' : 'false';
    obj.sessionDateTime = dataEntry.sessionDateTime;
    obj.sex = dataEntry.sex || 'N/A';
    obj.site = currentData.site || 'N/A';
    obj.species = species || 'N/A';
    obj.speciesCode = dataEntry.speciesCode || 'N/A';
    obj.svlMm = dataEntry.svl || 'N/A';
    obj.taxa = 'Lizard' || 'N/A';
    obj.toeClipCode = dataEntry.toeCode || 'N/A';
    obj.vtlMm = dataEntry.vtl || 'N/A';
    obj.year = year || 'N/A';
    obj.comments = dataEntry.comments || 'N/A';
    return obj;
};

export const getCollectionSessionName = (project, environment) => {
    let collectionName = `Test${project.replace(/\s/g, '')}Session`;
    if (environment === 'live') collectionName = `${project.replace(/\s/g, '')}Session`;
    return collectionName;
};

export const getCollectionDataName = (project, environment) => {
    let collectionName = `Test${project.replace(/\s/g, '')}Data`;
    if (environment === 'live') collectionName = `${project.replace(/\s/g, '')}Data`;
    return collectionName;
};

export const deleteLizardEntries = async (currentData, environment) => {
    const collectionName = getCollectionDataName(currentData.project, environment);
    console.log(`deleting from ${collectionName}`);
    const idsToDelete = [];
    for (const lizardEntry of currentData.lizard) {
        const lizardId = `${currentData.site}Lizard${lizardEntry.entryId}`;
        idsToDelete.push(lizardId);
    }
    console.log(idsToDelete);
    const batch = writeBatch(db);
    for (const lizardId of idsToDelete) {
        batch.delete(doc(db, collectionName, lizardId));
        batch.update(doc(db, 'Metadata', 'LizardData'), {
            deletedEntries: arrayUnion({
                collectionId: collectionName,
                entryId: lizardId,
            }),
        });
    }
    await batch.commit();
    console.log('complete');
};

const getGenusSpecies = async (project, taxa, speciesCode) => {
    const docsSnapshot = await getDocsFromCache(
        query(collection(db, 'AnswerSet'), where('set_name', '==', `${project}${taxa}Species`)),
    );
    const answerSet = docsSnapshot.docs[0].data();
    // console.log(speciesCode)
    // console.log(answerSet)
    for (const answer of answerSet.answers) {
        if (answer.primary === speciesCode) {
            // console.log(answer.secondary.Genus)
            return { genus: answer.secondary.Genus, species: answer.secondary.Species };
        }
    }
    return { genus: 'N/A', species: 'N/A' };
};
