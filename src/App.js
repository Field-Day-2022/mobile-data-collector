import { collection } from 'firebase/firestore'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import CollectData from "./pages/CollectData";
import { db } from './index';
import { useAtom } from 'jotai';
import { currentPageName } from './utils/jotai';
import AppWrapper from './components/AppWrapper';
import Home from './pages/Home';
import PastSessionData from './pages/PastSessionData';
import Navbar from './components/Navbar';

function App() {

  const [ currentPage, setCurrentPage ] = useAtom(currentPageName)

  const [
    answerSet,
    answerSetLoading, 
    answerSetError, 
    answerSetSnapshot, 
  ] = useCollectionData(collection(db, 'AnswerSet'))

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

  if (answerSetSnapshot) console.log(`Retrieved answer set from ${answerSetSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)
  if (toeCodeSnapshot) console.log(`Retrieved live toe codes from ${toeCodeSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)
  if (testtoeCodeSnapshot) console.log(`Retrieved test toe codes from ${testtoeCodeSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)

  if (answerSetError || toeCodeError || testtoeCodeError) {
    return (
      <AppWrapper>
        <h1>Error</h1>
      </AppWrapper>
    )
  }

  if (answerSetLoading || toeCodeLoading || testtoeCodeLoading) {
    return (
      <AppWrapper>
        <h1>Loading data...</h1>
      </AppWrapper>
    )
  }
  
  return (
    <AppWrapper>
      <Navbar />
      {currentPage === 'Home' && <Home />}
      {currentPage === 'PastSessionData' && <PastSessionData />}
      {currentPage === 'CollectData' && <CollectData />}
    </AppWrapper>
  );
}

export default App;
