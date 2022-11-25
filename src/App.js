import { collection } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import CollectData from "./pages/CollectData";

import { db } from './index';

function App() {

  const [
    answerSetSnapshot, 
    answerSetLoading, 
    answerSetError 
  ] = useCollection(collection(db, 'AnswerSet'))

  const [
    toeCodeSnapshot,
    toeCodeLoading,
    toeCodeError
  ] = useCollection(collection(db, 'ToeClipCodes'))

  const [
    testtoeCodeSnapshot,
    testtoeCodeLoading,
    testtoeCodeError
  ] = useCollection(collection(db, 'TestToeClipCodes'))

  if (answerSetSnapshot && toeCodeSnapshot) console.log(`Retrieved answer sets from ${answerSetSnapshot?.metadata.fromCache ? 'cache' : 'server'} and toe clip codes from ${toeCodeSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)

  return (
    <div className="font-openSans overflow-hidden absolute flex flex-col items-center text-center pt-5 pb-5 justify-center inset-0 bg-gradient-to-tr from-asu-maroon to-asu-gold">
      {(answerSetError || toeCodeError) && <h1>Error</h1>}
      {(answerSetLoading || toeCodeLoading) && <h1>Loading data...</h1>}
      {(answerSetSnapshot && toeCodeSnapshot && testtoeCodeSnapshot) && <CollectData />}
    </div>
  );
}

export default App;
