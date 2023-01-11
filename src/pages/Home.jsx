import { db } from '../index';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';

export default function Home() {

    const clickMeHandler = async () => {
        const collectionArray = ["GatewayData", "SanPedroData", "VirginRiverData"]
        let netCount = 0;
        for (const collectionName of collectionArray) {
            const srcColRef = collection(db, collectionName);
            const q = query(srcColRef, where("taxa", "==", "Lizard"));
            const snapshot = await getCountFromServer(q);
            console.log(`Count of lizard entry documents in ${collectionName}: ${snapshot.data().count}`)
            netCount += snapshot.data().count;
        }
        console.log(`Net count of lizard entries: ${netCount}`);
        const answerSetColl = collection(db, "AnswerSet");
        const answerSetSnapshot = await getCountFromServer(answerSetColl);
        console.log(`Number of answer set documents: ${answerSetSnapshot.data().count}`);
        netCount += answerSetSnapshot.data().count;
        const toeCodeColl = collection(db, "ToeClipCodes");
        const toeCodeSnapshot = await getCountFromServer(toeCodeColl);
        console.log(`Number of toe code documents: ${toeCodeSnapshot.data().count}`);
        netCount += toeCodeSnapshot.data().count;
        console.log(`Net number of first-time reads per user: ${netCount}`)
    }
    
    return (
        <div>
            <h1>Home component!</h1>
            <button onClick={() => clickMeHandler()}>Click me!</button>
        </div>
    );
}
