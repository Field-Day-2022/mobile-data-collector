/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, memo, useRef } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import CollectData from './pages/CollectData';
import { db } from './index';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    appMode,
    currentPageName,
    lizardDataLoadedAtom,
    lizardLastEditTime,
    triggerUpdateOnLastEditTime,
} from './utils/jotai';
import Home from './pages/Home';
import PastSessionData from './pages/PastSessionData';
import Navbar from './components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import Notification from './components/Notification';
import { ScaleLoader } from 'react-spinners';
import {
    checkForServerData,
    syncDeletedEntries,
    updateLizardLastEditTime,
} from './utils/functions';
import AboutUs from './pages/AboutUs';

function App() {
    const [answerSetLoading, setAnswerSetLoading] = useState(true);
    const currentPage = useAtomValue(currentPageName);
    const setLizardDataLoaded = useSetAtom(lizardDataLoadedAtom);
    const [lastEditTime, setLastEditTime] = useAtom(lizardLastEditTime);
    const environment = useAtomValue(appMode);
    const dataFetchedRef = useRef(false);
    const [lastEditUpdateTrigger, setLastEditUpdateTrigger] = useAtom(triggerUpdateOnLastEditTime);
    const [previousLastEditTime, setPreviousLastEditTime] = useState(null);
    const lastEditRef = useRef(lastEditTime);

    useEffect(() => {
        lastEditRef.current = lastEditTime;
    }, [lastEditTime]);

    useEffect(() => {
        if (previousLastEditTime < lastEditTime && lastEditUpdateTrigger === true) {
            updateLizardLastEditTime(lastEditTime);
            setPreviousLastEditTime(lastEditTime);
            setLastEditUpdateTrigger(false);
        }
    }, [lastEditUpdateTrigger]);

    const createFirestoreListeners = () => {
        onSnapshot(doc(db, 'Metadata', 'LizardData'), (snapshot) => {
            const lastEditTime = lastEditRef.current; // https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559
            console.log(`server: ${snapshot.data().lastEditTime}; local: ${lastEditTime}`);
            if (snapshot.data().lastEditTime !== lastEditTime) {
                console.log(
                    `fetching new/modified lizard data from ${new Date(
                        lastEditTime,
                    ).toLocaleString()} to ${new Date(
                        snapshot.data().lastEditTime,
                    ).toLocaleString()}`,
                );
                setLizardDataLoaded(false);
                checkForServerData(
                    lastEditTime,
                    snapshot.data().lastEditTime,
                    setLizardDataLoaded,
                    environment,
                );
                setLastEditTime(snapshot.data().lastEditTime);
            }
            if (snapshot.data().deletedEntries) {
                setLizardDataLoaded(false);
                syncDeletedEntries(snapshot.data().deletedEntries, setLizardDataLoaded);
            }
            if (lastEditTime === snapshot.data().lastEditTime) setLizardDataLoaded(true);
        });

        onSnapshot(collection(db, 'AnswerSet'), (snapshot) => {
            setAnswerSetLoading(false);
        });
    };

    useEffect(() => {
        if (dataFetchedRef.current) return; // to avoid excessive function calls during development
        dataFetchedRef.current = true;
        createFirestoreListeners();
    }, []);

    return (
        <motion.div className="font-openSans overflow-hidden absolute flex flex-col items-center text-center justify-start inset-0 bg-white">
            <AnimatePresence mode="wait">
                {answerSetLoading ? (
                    <LoadingScreen />
                ) : (
                    <AppWrapper>
                        {currentPage === 'Home' && <Home />}
                        {currentPage === 'History' && <PastSessionData />}
                        {currentPage === 'Collect Data' && <CollectData />}
                        {currentPage === 'About Us' && <AboutUs />}
                    </AppWrapper>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default memo(App);

const AppWrapper = ({ children }) => (
    <motion.div
        key="appDiv"
        className="flex flex-col overflow-visible items-center h-full w-full rounded-lg text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
        <Notification />
        <Navbar />
        <div className="divider mb-0 pb-0 mt-0 h-1 bg-asu-gold/75" />
        {children}
    </motion.div>
);

const LoadingScreen = () => (
    <motion.div
        className="inset-0 h-screen flex flex-col items-center justify-around"
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <h1 className="text-3xl text-black">Field Day</h1>

        <svg className="stroke-2 stroke-asu-maroon fill-none h-1/2" viewBox="0 0 512 512">
            <path d="M333.21 14.08c.18-.6 1.51-.5 1.89 0 1.88 2.47 2.6 8.95 3.37 13.51.91 5.43 1.09 10.98 1.92 16.43.23 1.48 1.42 3.24 2.68 3.94.63.35 2.84-1.15 3.62-2.3 2.83-4.16 5.28-8.59 8.06-12.79.92-1.4 1.93-3.39 3.63-3.63.49-.07 1.08.26 1.3.7.77 1.56-.29 3.53-.85 5.15-1.69 4.92-3.74 9.72-5.36 14.66-1.23 3.75.05 5.1 3.89 4.26 4.31-.93 8.54-2.23 12.86-3.14 1.17-.25 3.21-.59 3.77.56.57 1.18-.9 2.69-1.96 3.41-1.54 1.07-1.54 1.07-2.37 1.53-4.26 2.38-8.6 4.62-12.75 7.17-1.3.8-2.09 2.44-3.11 3.7 1.39.84 2.7 1.94 4.21 2.45 1.77.6 3.78.48 5.56 1.06 1.5.49 3.98.74 4.22 2.33.26 1.77-1.86 3.41-3.74 3.84-.82.19-1.82.37-2.72.65-6.3 1.89-12.82 3.29-18.84 5.86-7.01 3-12.11 8.51-15.07 15.63-3.94 9.45-2.79 13.57 6.95 16.73 9.49 3.08 19.58 4.41 29.47 6.11 5.88 1.01 11.41-.95 15.89-4.7 8.8-7.38 17.23-15.18 25.9-22.72 8.46-7.35 16.97-14.01 28.85-15.91 14.59-2.34 28.93-.79 43.33.39 6.7.55 10.67 8.2 7.72 14.38-3.51 7.38-7.35 14.69-11.94 21.42-2.85 4.17-6.84 8.12-11.22 10.57-8.21 4.6-17.13 7.92-25.65 11.99-10.63 5.07-21.52 9.75-31.56 15.82-4.32 2.61-8.04 7.83-9.8 12.68-3.63 9.98-4.58 20.57-2.13 31.18.87 3.77 2.94 6.12 7.01 5.12 4.89-1.2 9.82-2.48 14.47-4.37 9.64-3.93 17.11-9.76 18.06-21.41.31-3.82-.43-10.54 3.92-11.77 1.65-.47 2.12 1.4 2.19 1.84.53 3.23.82 6.5 1.41 9.72.23 1.27.75 2.74 1.66 3.51.41.35 2.26-.58 3.15-1.3 3.56-2.86 6.94-5.95 10.52-8.78 1.13-.89 2.63-2.28 4.06-1.84.38.12.81.66.63 1.02-3.16 6.15-7.76 10.5-12.11 16.39 9.84 1.96 23.32-10.24 24.71-4.49.49 2.05-6.58 4.49-10.06 6.29-3.56 1.84-7.11 3.71-9.28 9.27 4.68 0 8.38-.05 12.08.01 6.28.11 12.57.22 18.85.54 1.02.05 2.81.65 2.96 1.81.17 1.3-1.61 2.24-2.7 2.82-1.2.64-2.73.79-4.13.88-7.86.48-15.73.85-23.6 1.34-1.74.11-3.85-.28-5.19.86-.4.34-.67 1-.5 1.5.91 2.72 4.46 3.71 7.06 4.89 3.11 1.41 6.82 2.77 4.92 6.61-.6 1.21-5.71.97-8.41.19-5.74-1.66-11.32-3.93-16.82-6.29-4.47-1.92-8.89-2.45-13.27-.36-8.52 4.07-17 8.24-25.35 12.64-9.84 5.19-18.45 3.06-22.39-7.31-2.86-7.51-3.48-15.86-5.2-23.82-.67-3.08-1.62-6.1-2.44-9.15-4.12.67-6.08 2.58-7.98 4.83-16.56 19.62-33.1 39.27-49.13 59.32-8.99 11.24-6.44 16.9 7.63 20.3 6.88 1.66 13.66 3.8 20.37 6.04 5.25 1.76 7.93 5.29 8.18 11.3.49 11.5-5.3 19.86-12.57 27.55-5.74 6.07-12 11.63-17.79 17.65-1.22 1.27-1.4 3.54-2.06 5.34 1.99.47 4.1 1.63 5.94 1.28 5.25-.98 10.36-2.73 15.59-3.83 1.6-.34 4.41-.87 5.16.71.79 1.67-1.54 3.6-2.88 4.66-2.07 1.64-4.77 2.45-6.96 3.96-1.16.8-2.63 2.47-2.46 3.49.18 1.08 2.04 2.28 3.38 2.66 2.56.73 5.26 1.09 7.89 1.39 2.93.34 7.26.65 7.28 3.32.02 2.79-4.62 3.22-7.56 3.54-2.8.3-5.64.78-8.47 1.13l-.3 1.47c1.46 1.27 2.87 2.59 4.39 3.8 4.81 3.82 9.76 7.48 14.41 11.48 1.02.88 2.5 3.2 1.51 4.44-.91 1.14-3.13.19-4.32-.44-6.14-3.21-12.12-6.74-18.26-9.95-1.21-.64-2.89-.4-4.35-.56.02 1.46-.42 3.13.14 4.33 2.32 5 4.73 9.97 7.49 14.74 6.06 10.5 8.63 21.6 6.07 33.56-.5 2.36-.9 6.88-3.4 6.67-2.42-.2-1.88-4.55-2.22-6.92-1.02-7.26-.46-15.02-2.86-21.75-4.17-11.71-13.09-20.62-21.3-29.77-.5-.56-1.58-.59-3.2-1.15.64 4.63 1.32 8.59 1.64 12.58.11 1.33.25 3.72-1.13 4.12-1.4.41-2.62-1.7-3.21-2.9-1.52-3.08-3.06-6.27-3.82-9.6-1.53-6.75-2.56-13.61-3.76-20.43-2.36-13.42-.76-25.71 9.91-35.56 2.89-2.66 5.55-5.62 8.02-8.68 2.66-3.3 5.26-6.71 7.35-10.38 1.73-3.03 1.35-6.14-2.14-8.1-12.36-6.96-26.82-2.06-31.47 11.26-2.63 7.55-3.72 15.62-5.92 23.33-3.88 13.62-8.28 27.09-12.1 40.72-5.55 19.83-12.72 38.99-23.37 56.64-15.25 25.25-33.74 47.75-59.77 62.5-18.22 10.33-38.08 14.99-59.22 11.31-34.5-6-59.12-25.99-77.18-55.02-9.65-15.52-15.93-32.45-20.25-50.18-3.98-16.32-6.01-32.8-5.04-49.6.09-1.61.06-3.83 1.44-4.76.37-.25.98-.17 1.34.1 1.34 1 1.37 3.08 1.73 4.7a441.76 441.76 0 0 1 3.19 15.72c5.17 28.33 13.94 55.3 30.7 79.08 14.95 21.21 34.97 34.87 60.99 38.38 7.37.99 15.19 1.1 22.48-.21 17.26-3.1 31.37-12.18 43.61-24.75 25.8-26.48 44.22-56.96 51.18-93.56 4.08-21.47 7.78-43.05 10.39-64.74 1.83-15.25-.34-16.7-14.9-22.49-12.19-4.84-17.2-4.6-17.63 13.13-.17 7 1.51 14.05 2.5 21.06 1.47 10.43 2.5 20.76-4.28 30.01-7.34 10.02-14.6 20.11-22.1 30.01-.8 1.05-3.17 2.52-4.47 1.58-1.3-.94-.5-3.44.11-4.76 1.65-3.56 4.16-6.76 5.58-10.39.88-2.24 1.44-6.17.24-7.28-1.59-1.48-5.28-1.79-7.65-1.13-9.39 2.64-18.62 5.84-27.9 8.88-5.58 1.83-10.01 4.92-12.78 10.44-2.32 4.63-5.2 9.02-8.25 13.22-.96 1.33-3.24 3.31-4.91 2.5-1.73-.84-1.33-3.81-1.13-5.62.22-1.94 1.29-3.89 2.34-5.63 3.01-5 5.7-10.31 9.46-14.68 2.82-3.28 6.79-6.06 10.8-7.71 6.22-2.56 12.96-3.85 19.4-5.93 3.55-1.14 6.93-2.79 10.39-4.22-.12-.71-.25-1.43-.37-2.14-3.62-.33-7.23-.74-10.85-.98-5.34-.35-10.7-.44-16.02-.96-1.29-.13-3.68-.86-3.67-2.32 0-1.43 2.32-2.09 3.59-2.26 4.36-.59 8.79-.72 13.17-1.16 4.08-.41 8.14-.99 12.21-1.5l.24-2.07c-1.83-.86-3.6-1.91-5.51-2.53-3.89-1.25-7.94-2.07-11.77-3.49-1.37-.51-3.77-1.81-3.42-3.39.35-1.55 3.02-1.71 4.43-1.58 6.26.59 12.48 1.64 18.74 2.32 1.73.19 3.54-.34 5.31-.53-.67-1.8-1.06-3.79-2.08-5.36-1.54-2.36-3.7-4.32-5.23-6.68-.64-.98-1.38-2.92-.48-3.87.9-.95 2.79-.26 3.88.25 1.53.71 2.77 2.04 4.13 3.11 2.47 1.95 4.84 4.05 7.45 5.8 1.16.78 2.8.86 4.22 1.26.32-1.46.93-2.93.88-4.37-.1-2.83-.65-5.63-.86-8.46-.93-12.07-2.11-24.13-2.58-36.22-.31-7.94 2.53-11.43 10.39-11.76 11.6-.49 23.29-.32 34.86.57 12.2.93 12.86.91 18.05-10.02 4.4-9.25 8.72-18.59 13.93-27.38 6.81-11.48 13.43-23.25 24.77-31.28 7.97-5.64 15.71-11.6 23.47-17.52 11.4-8.71 11.04-13.96-1.12-21.53-6.68-4.16-13.53-8.16-19.69-13.02-6.81-5.37-7.91-11.93-4.56-19.92 4.55-10.84 12.11-19.55 20.4-27.55 3.47-3.35 4.56-6.65 3.24-10.92-.79-2.53-1.98-4.95-3.14-7.35-1.72-3.54-3.67-6.97-5.32-10.54-.38-.82-.64-2.39.14-3.06.87-.75 2.55-.19 3.38.37 1.68 1.13 2.95 2.85 4.58 4.07 1.79 1.34 3.79 2.38 5.7 3.56.33-2.35.97-4.7.94-7.05-.12-9.77-1.06-24 .57-29.37z" />
        </svg>

        <div>
            <ScaleLoader loading={true} color={'#8C1D40'} width={8} radius={15} height={40} />

            <p className="mt-10 text-black text-xl">Initializing app...</p>
        </div>
    </motion.div>
);
