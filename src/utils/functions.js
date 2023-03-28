/* eslint-disable no-loop-func */
import {
    collection,
    where,
    query,
    getCountFromServer,
    writeBatch,
    doc,
    getDocs,
    getDocsFromCache,
    getDocsFromServer,
    orderBy,
    limit,
    setDoc,
    getDocFromCache,
    updateDoc,
    deleteDoc,
    getDocFromServer,
    arrayRemove,
} from 'firebase/firestore';
import { db } from '../index';

const NA = 'N/A';

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
    setCurrentForm
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
            `Count of lizard entry documents in ${collectionName}: ${snapshot.data().count}`
        );
        netCount += snapshot.data().count;
    }
    console.log(`Net count of lizard entries: ${netCount}`);
    const answerSetColl = collection(db, 'AnswerSet');
    const answerSetSnapshot = await getCountFromServer(answerSetColl);
    console.log(`Number of answer set documents: ${answerSetSnapshot.data().count}`);
    netCount += answerSetSnapshot.data().count;
    const toeCodeColl = collection(db, 'ToeClipCodes');
    const toeCodeSnapshot = await getCountFromServer(toeCodeColl);
    console.log(`Number of toe code documents: ${toeCodeSnapshot.data().count}`);
    netCount += toeCodeSnapshot.data().count;
    console.log(`Net number of first-time reads per user: ${netCount}`);
    const lizardDataColl = collection(db, 'LizardData');
    const lizardDataSnapshot = await getCountFromServer(lizardDataColl);
    console.log(`Count of lizard entries in LizardData: ${lizardDataSnapshot.data().count}`);
};

export const populateLizardCollection = async () => {
    console.log('Begin populateLizardCollection');
    const collectionArray = ['GatewayData', 'SanPedroData', 'VirginRiverData'];
    let lizardDataArray = [];
    for (const collectionName of collectionArray) {
        const coll = collection(db, collectionName);
        const q = query(coll, where('taxa', '==', 'Lizard'));
        const snapshot = await getDocs(q);
        snapshot.forEach((document) => {
            lizardDataArray.push(document.data());
        });
    }
    console.log(lizardDataArray.length);
    console.log(lizardDataArray[0]);
    let numOps = 0;
    let batch = writeBatch(db);
    let i = 0;
    while (true) {
        if (i === 7752) {
            await batch.commit();
            console.log(`Wrote batch to document number ${i}`);
            console.log(`Exiting...`);
            break;
        }
        if (numOps < 500) {
            const documentId = new Date(lizardDataArray[i].dateTime).getTime();
            // console.log(documentId);
            batch.set(doc(db, 'LizardData', `${documentId}`), lizardDataArray[i]);
            i++;
            numOps++;
        } else {
            await batch.commit();
            console.log(`Wrote batch to document number ${i}`);
            batch = writeBatch(db);
            numOps = 0;
        }
    }
};

export const changeLizardDataTimesToEpochTime = async () => {
    console.log('initiating...');
    const lizardColl = await getDocsFromCache(collection(db, 'LizardData'));
    let documentCounter = 0;
    let leaveLoop = false;
    while (true) {
        const batch = writeBatch(db);
        for (let j = 0; j < 500; j++) {
            const lastEdit = new Date(lizardColl.docs[documentCounter].data().dateTime).getTime();
            batch.set(
                doc(
                    db,
                    'TestLizardData',
                    `${lizardColl.docs[documentCounter].data().site}${
                        lizardColl.docs[documentCounter].data().taxa
                    }${new Date(lizardColl.docs[documentCounter].data().dateTime).getTime()}`
                ),
                {
                    ...lizardColl.docs[documentCounter].data(),
                    lastEdit: lastEdit || '',
                }
            );
            if (documentCounter === 7756) {
                leaveLoop = true;
                break;
            } else {
                documentCounter++;
            }
        }
        console.log(`writing batch to doc number ${documentCounter}`);
        await batch.commit();
        if (leaveLoop) break;
    }
    console.log('complete');
};

export const checkForServerData = async (
    latestClientTime,
    latestServerTime,
    setLizardDataLoaded,
    environment
) => {
    console.log(`comparing ${latestClientTime} and ${latestServerTime}`);
    if (latestClientTime === 0) {
        await downloadAllLizardDataFromServer(environment);
        setLizardDataLoaded(true);
    } else if (latestClientTime < latestServerTime) {
        await downloadLatestLizardDataFromServer(latestClientTime, environment);
        setLizardDataLoaded(true);
    }
};

export const downloadAllLizardDataFromServer = async (environment) => {
    const collections = ['GatewayData', 'VirginRiverData', 'SanPedroData'];
    if (environment === 'test') {
        collections.forEach((value, index) => {
            collections[index] = `Test${value}`;
        });
    }
    for (const collectionName of collections) {
        const incomingLizardData = await getDocsFromServer(
            query(collection(db, collectionName), where('taxa', '==', 'Lizard'))
        );
        console.log('fresh lizard data downloaded:');
        console.log(incomingLizardData);
    }
};

export const downloadLatestLizardDataFromServer = async (latestClientTime, environment) => {
    const collections = ['GatewayData', 'VirginRiverData', 'SanPedroData'];
    if (environment === 'test') {
        collections.forEach((value, index) => {
            collections[index] = `Test${value}`;
        });
    }
    for (const collectionName of collections) {
        const incomingLizardData = await getDocsFromServer(
            query(
                collection(db, collectionName),
                where('lastEdit', '>=', latestClientTime),
                where('taxa', '==', 'Lizard')
            )
        );
        if (!incomingLizardData.empty) {
            console.log(`fresh lizard data downloaded from ${collectionName}:`);
            console.log(incomingLizardData);
        }
    }
};

const fetchDocFromServer = async (entryId, collectionId) => {
    console.log(`Syncing ${entryId} with server...`);
    try {
        const docSnap = await getDocFromServer(doc(db, collectionId, entryId));
        if (docSnap.exists()) {
            console.log(
                `Unexpected: document ${docSnap.id} exists on server, removing from deletedEntries`
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
    setFenceTraps
) => {
    const speciesSnapshot = await getDocsFromCache(
        query(
            collection(db, 'AnswerSet'),
            where('set_name', '==', `${currentData.project}LizardSpecies`)
        )
    );
    let speciesCodesArray = [];
    for (const answer of speciesSnapshot.docs[0].data().answers) {
        speciesCodesArray.push(answer.primary);
    }
    setLizardSpeciesList(speciesCodesArray);
    const fenceTrapsSnapshot = await getDocsFromCache(
        query(collection(db, 'AnswerSet'), where('set_name', '==', 'Fence Traps'))
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
    setErrors
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
    setErrors
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
    setErrors
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
    setLastEditTime
) => {
    const date = new Date();
    const lizardDataWithTimes = {
        ...lizardData,
        dateTime: date.toISOString(),
        lastEdit: date.getTime(),
    };
    const collectionName =
        environment === 'live'
            ? `${currentData.project.replace(/\s/g, '')}Data`
            : `Test${currentData.project.replace(/\s/g, '')}Data`;
    const lizardEntry = await createLizardEntry(currentData, lizardDataWithTimes);
    updateData('lizard', lizardEntry, setCurrentData, currentData, setCurrentForm);
    await setDoc(
        doc(db, collectionName, `${currentData.site}Lizard${date.getTime()}`),
        lizardEntry
    ).then((docRef) => {
        console.log('successfully added new lizard entry:');
        reloadCachedLizardData(collectionName, `${currentData.site}Lizard${date.getTime()}`);
    });
    setLastEditTime(lizardDataWithTimes.lastEdit);
    setTimeout(async () => {
        await updateDoc(doc(db, 'Metadata', 'LizardData'), {
            lastEditTime: lizardDataWithTimes.lastEdit,
        });
    }, 1000);
};

const createLizardEntry = async (currentData, dataEntry) => {
    const dataObjTemplate = {
        aran: NA,
        array: NA,
        auch: NA,
        blat: NA,
        cclMm: NA,
        chil: NA,
        cole: NA,
        comments: NA,
        crus: NA,
        dateTime: NA,
        dead: NA,
        derm: NA,
        diel: NA,
        dipt: NA,
        fenceTrap: NA,
        genus: NA,
        hatchling: NA,
        hdBody: NA,
        hete: NA,
        hyma: NA,
        lepi: NA,
        mant: NA,
        massG: NA,
        micro: NA,
        orth: NA,
        otlMm: NA,
        plMm: NA,
        predator: NA,
        pseu: NA,
        recapture: NA,
        regenTail: NA,
        scor: NA,
        sessionDateTime: NA,
        sex: NA,
        site: NA,
        soli: NA,
        species: NA,
        speciesCode: NA,
        svlMm: NA,
        taxa: NA,
        thys: NA,
        toeClipCode: NA,
        unki: NA,
        vtlMm: NA,
        year: NA,
        noCapture: NA,
        lastEdit: NA,
    };
    const { genus, species } = await getGenusSpecies(
        currentData.project,
        'Lizard',
        dataEntry.speciesCode
    );
    // console.log(genus, species)
    const entryDate = new Date(dataEntry.dateTime);
    const year = entryDate.getFullYear();
    const obj = structuredClone(dataObjTemplate);
    obj.array = currentData.array || NA;
    obj.dateTime = dataEntry.dateTime || NA;
    obj.lastEdit = entryDate.getTime() || NA;
    obj.dead = dataEntry.isDead || NA;
    obj.fenceTrap = dataEntry.trap || NA;
    obj.genus = genus || NA;
    obj.hatchling = dataEntry.isHatchling || NA;
    obj.massG = dataEntry.mass || NA;
    obj.otlMm = dataEntry.otl || NA;
    obj.recapture = dataEntry.isRecapture || NA;
    obj.regenTail = dataEntry.regenTail || NA;
    obj.sessionDateTime = currentData.sessionDateTime || NA;
    obj.sex = dataEntry.sex || NA;
    obj.site = currentData.site || NA;
    obj.species = species || NA;
    obj.speciesCode = dataEntry.speciesCode || NA;
    obj.svlMm = dataEntry.svl || NA;
    obj.taxa = 'Lizard' || NA;
    obj.toeClipCode = dataEntry.toeCode || NA;
    obj.vtlMm = dataEntry.vtl || NA;
    obj.year = year || NA;
    obj.comments = dataEntry.comments || NA;
    return obj;
};

const getGenusSpecies = async (project, taxa, speciesCode) => {
    const docsSnapshot = await getDocsFromCache(
        query(collection(db, 'AnswerSet'), where('set_name', '==', `${project}${taxa}Species`))
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
    return { genus: NA, species: NA };
};

const reloadCachedLizardData = async (collectionName, docId) => {
    const document = await getDocFromCache(doc(db, collectionName, docId));
    console.log('retrieved cached lizard entry:');
    console.log(document);
};
