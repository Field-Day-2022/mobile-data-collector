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
    for (const arthropodEntry of tempArthropod) {
        if (arthropodEntry.trap === incomingData.trap) {
            for (const arthropodSpecies in arthropodEntry.arthropodData) {
                arthropodEntry.arthropodData[arthropodSpecies] +=
                    incomingData.arthropodData[arthropodSpecies];
            }
        }
    }
    setCurrentData({
        ...currentData,
        arthropod: tempArthropod,
    });
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
        query(collection(db, 'LizardData'), where('dateTime', '>=', latestClientTime))
    );
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

export const fetchToeCodes = async (
    currentData,
    environment,
    setSiteToeCodes,
    setCurrentToeClipCodesSnapshot
) => {
    let toeCodesSnapshot;
    if (environment === 'test') {
        console.log('retrieving toe codes in test mode...');
        try {
            toeCodesSnapshot = await getDocsFromCache(
                query(collection(db, 'TestToeClipCodes'), where('SiteCode', '==', currentData.site))
            );
            if (toeCodesSnapshot.empty()) throw Error;
            else {
                console.log(
                    'test toe codes for this site/array/species combination already exists, retrieving...'
                );
                console.log(toeCodesSnapshot.docs[0]);
                setSiteToeCodes(toeCodesSnapshot.docs[0].data());
            }
        } catch (e) {
            console.log(
                'test toe codes for this site/array/species combination does not already exist, pulling from live'
            );
            toeCodesSnapshot = await getDocsFromCache(
                query(collection(db, 'ToeClipCodes'), where('SiteCode', '==', currentData.site))
            );
            setSiteToeCodes(toeCodesSnapshot.docs[0].data());
        }
    } else if (environment === 'live') {
        console.log('retrieving toe codes in live mode...');
        toeCodesSnapshot = await getDocsFromCache(
            query(collection(db, 'ToeClipCodes'), where('SiteCode', '==', currentData.site))
        );
        setSiteToeCodes(toeCodesSnapshot.docs[0].data());
    }
    setCurrentToeClipCodesSnapshot(toeCodesSnapshot.docs[0]);
};

export const sendToeCodeDataToFirestore = async (
    environment,
    currentToeClipCodesSnapshot,
    updatedToeCodes,
    setNotification
) => {
    let toeCodeCollection = 'TestToeClipCodes';
    if (environment === 'live') toeCodeCollection = 'ToeClipCodes';
    await setDoc(doc(db, toeCodeCollection, currentToeClipCodesSnapshot.id), updatedToeCodes);
    setNotification(`Successfully set toe clip code entry to ${toeCodeCollection}`);
};

export const verifyLizardForm = (
    sex,
    massGrams,
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
    if (massGrams === '') tempErrors.mass = 'Required';
    if (speciesCode === '') tempErrors.speciesCode = 'Required';
    if (trap === '') tempErrors.fenceTrap = 'Required';
    let errorExists = false;
    for (const key in tempErrors) {
        if (tempErrors[key] !== '') errorExists = true;
    }
    if (errorExists) {
        setNotification('Errors in form');
    } else {
        setNotification('Form is valid');
        setConfirmationModalIsOpen(true);
    }
    setErrors(tempErrors);
    console.log(tempErrors);
    console.log([trap, speciesCode]);
};

export const completeLizardCapture = (
    environment,
    currentToeClipCodesSnapshot,
    updatedToeCodes,
    setNotification,
    setCurrentData,
    currentData,
    setCurrentForm,
    lizardData
) => {
    const date = new Date();
    sendToeCodeDataToFirestore(
        environment,
        currentToeClipCodesSnapshot,
        updatedToeCodes,
        setNotification
    );
    updateData(
        'lizard',
        {
            ...lizardData,
            dateTime: date.toISOString(),
        },
        setCurrentData,
        currentData,
        setCurrentForm
    );
};
