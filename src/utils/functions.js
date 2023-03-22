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
} from 'firebase/firestore';
import { db } from '../index';

export const updateData = (species, incomingData, setCurrentData, currentData, setCurrentForm) => {
    setCurrentData({
        ...currentData,
        [species]: [...currentData[species], incomingData],
    });
    setCurrentForm('New Data Entry');
};

export const updatePreexistingArthropodData = 
(
    incomingData, 
    setCurrentData, 
    currentData, 
    setCurrentForm
) => {
    let tempArthropod = currentData.arthropod;
    for (const arthropodEntry of tempArthropod) {
        if (arthropodEntry.trap === incomingData.trap) {
            for (const arthropodSpecies in arthropodEntry.arthropodData) {
                arthropodEntry.arthropodData[arthropodSpecies] += incomingData.arthropodData[arthropodSpecies];
            }
        }
    }
    setCurrentData({
        ...currentData,
        arthropod: tempArthropod,
    });
    setCurrentForm('New Data Entry');
}

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
                    `${lizardColl.docs[documentCounter].data().site}${lizardColl.docs[documentCounter].data().taxa}${new Date(lizardColl.docs[documentCounter].data().dateTime).getTime()}`
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

export const checkForServerData = async (latestClientTime, latestServerTime, setLizardDataLoaded) => {
    console.log(`comparing ${latestClientTime} and ${latestServerTime}`);
    if (latestClientTime < latestServerTime) {
        await downloadLatestLizardDataFromServer(latestClientTime);
        setLizardDataLoaded(true);
    }
};

export const downloadLatestLizardDataFromServer = async (latestClientTime) => {
    const incomingLizardData = await getDocsFromServer(
        query(
            collection(db, 'LizardData'),
            where('dateTime', '>=', latestClientTime)
        )
    );
    console.log(incomingLizardData);
};