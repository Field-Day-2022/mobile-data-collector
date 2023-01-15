/* eslint-disable react-hooks/exhaustive-deps */
import { collection } from 'firebase/firestore';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import CollectData from './pages/CollectData';
import { db, auth } from './index';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    signOut,
} from 'firebase/auth';
import { useAtom } from 'jotai';
import { currentFormName, currentPageName, notificationText } from './utils/jotai';
import Home from './pages/Home';
import PastSessionData from './pages/PastSessionData';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion';
import Notification from './components/Notification';
import { useEffect } from 'react';

function App() {
    const [currentPage, setCurrentPage] = useAtom(currentPageName);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);
    const [notification, setNotification] = useAtom(notificationText);

    const [user] = useAuthState(auth);

    const [answerSet, answerSetLoading, answerSetError, answerSetSnapshot] = useCollectionData(
        collection(db, 'AnswerSet')
    );

    const [toeCodeSnapshot, toeCodeLoading, toeCodeError] = useCollection(
        collection(db, 'ToeClipCodes')
    );

    const [testtoeCodeSnapshot, testtoeCodeLoading, testtoeCodeError] = useCollection(
        collection(db, 'TestToeClipCodes')
    );

    // if (testtoeCodeSnapshot) console.log(testtoeCodeSnapshot.metadata.hasPendingWrites)

    // if (answerSetSnapshot) console.log(`Retrieved answer set from ${answerSetSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)
    // if (toeCodeSnapshot) console.log(`Retrieved live toe codes from ${toeCodeSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)
    // if (testtoeCodeSnapshot) console.log(`Retrieved test toe codes from ${testtoeCodeSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)

    // if (answerSetSnapshot) console.log(answerSet);

    useEffect(() => {
        if (answerSetSnapshot && toeCodeSnapshot && testtoeCodeSnapshot) {
            if (
                answerSetSnapshot.metadata.fromCache &&
                toeCodeSnapshot.metadata.fromCache &&
                testtoeCodeSnapshot.metadata.fromCache
            ) {
                setNotification('Syncing with local storage');
            } else {
                setNotification(`Syncing with remote storage`);
            }
        }
    }, [answerSetSnapshot, toeCodeSnapshot, testtoeCodeSnapshot]);

    if (answerSetError || toeCodeError || testtoeCodeError) {
        return <h1>Error</h1>;
    }

    if (answerSetLoading || toeCodeLoading || testtoeCodeLoading) {
        return <h1>Loading data...</h1>;
    }

    // onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //         console.log(`logged in!`)
    //         console.log(user);
    //     } else {
    //         signInWithRedirect(auth, provider)
    //             .then(result => console.log("signed in!"))
    //             .catch(error => console.error(error))
    //     }
    // })

    return (
        <motion.div className="font-openSans  overflow-hidden  absolute  flex  flex-col  items-center  text-center  justify-start  inset-0  bg-white">
            {user ? (
                <motion.div className="flex flex-col overflow-visible items-center h-full w-full pr-0 bg-gradient-to-r from-slate-300/25 rounded-lg text-black">
                    <button onClick={() => signOut(auth)}>logout</button>
                    <Notification />
                    <Navbar />
                    <div className="divider mb-0 pb-0 mt-0 h-1 bg-asu-gold/75" />
                    {currentPage === 'Home' && <Home />}
                    {currentPage === 'History' && <PastSessionData />}
                    {currentPage === 'Collect Data' && <CollectData />}
                </motion.div>
            ) : (
                <div className="flex items-center h-screen w-full justify-center">
                    <button
                        className="text-black border-asu-maroon px-4 py-2 border-2 rounded-xl"
                        onClick={() => {
                            signInWithRedirect(auth, new GoogleAuthProvider())
                                .then(() => console.log('signed in'))
                                .catch((err) => console.error(err));
                        }}
                    >
                        Sign in
                    </button>
                </div>
            )}
        </motion.div>
    );
}

export default App;
