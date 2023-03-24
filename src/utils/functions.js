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
} from 'firebase/firestore';
import { db } from '../index';

export const updateData = (species, incomingData, setCurrentData, currentData, setCurrentForm) => {
    setCurrentData({
        ...currentData,
        [species]: [...currentData[species], incomingData],
    });
    setCurrentForm('New Data Entry');
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
            for (const arthropodSpecies in arthropodEntry.arthropodData) {
                arthropodEntry.arthropodData[arthropodSpecies] +=
                    incomingData.arthropodData[arthropodSpecies];
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
    setLizardDataLoaded
) => {
    console.log(`comparing ${latestClientTime} and ${latestServerTime}`);
    if (latestClientTime < latestServerTime) {
        await downloadLatestLizardDataFromServer(latestClientTime);
        setLizardDataLoaded(true);
    }
};

export const downloadLatestLizardDataFromServer = async (latestClientTime) => {
    const incomingLizardData = await getDocsFromServer(
        query(collection(db, 'TestLizardData'), where('lastEdit', '>=', latestClientTime))
    );
    console.log('fresh lizard data downloaded:')
    console.log(incomingLizardData);
};

export const getAnswerFormDataFromFirestore = async (
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
        setNotification('Form is valid');
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
        // setNotification('Form is valid');
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
    environment
) => {
    const date = new Date();
    const lizardDataWithTimes = {
        ...lizardData,
        dateTime: date.toISOString(),
        lastEdit: date.getTime(),
    } 
    updateData(
        'lizard',
        lizardDataWithTimes,
        setCurrentData,
        currentData,
        setCurrentForm
    );
    const collectionName = environment === 'live' ? 'LizardData' : 'TestLizardData';
    const lizardEntry = await createLizardEntry(currentData, lizardDataWithTimes);
    await setDoc(doc(db, collectionName, `${currentData.site}Lizard${date.getTime()}`), lizardEntry)
    .then(docRef => {
        console.log('successfully added new lizard entry:')
        reloadCachedLizardData(collectionName, `${currentData.site}Lizard${date.getTime()}`)
    })
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
    };
    const {genus, species} = await getGenusSpecies(
        currentData.project,
        'Lizard',
        dataEntry.speciesCode
    );
    // console.log(genus, species)
    const entryDate = new Date(dataEntry.dateTime);
    const year = entryDate.getFullYear();
    const obj = structuredClone(dataObjTemplate);
    obj.array = currentData.array;
    obj.dateTime = dataEntry.dateTime;
    obj.lastEdit = entryDate.getTime();
    obj.dead = dataEntry.isDead;
    obj.fenceTrap = dataEntry.trap;
    obj.genus = genus;
    obj.hatchling = dataEntry.isHatchling;
    obj.massG = dataEntry.mass;
    obj.otlMm = dataEntry.otl;
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
    return obj;
}

const getGenusSpecies = async (project, taxa, speciesCode) => {
    const docsSnapshot = await getDocsFromCache(query(
        collection(db, "AnswerSet"),
        where('set_name', '==', `${project}${taxa}Species`)
    ));
    const answerSet = docsSnapshot.docs[0].data();
    // console.log(speciesCode)
    // console.log(answerSet)
    for (const answer of answerSet.answers) {
        if (answer.primary === speciesCode) {
            // console.log(answer.secondary.Genus)
            return {genus: answer.secondary.Genus, species: answer.secondary.Species};
        }
    }
    return {genus: "N/A", species: "N/A"}
}

const reloadCachedLizardData = async (collectionName, docId) => {
    const document = await getDocFromCache(doc(db, collectionName, docId))
    console.log('retrieved cached lizard entry:')
    console.log(document)
}