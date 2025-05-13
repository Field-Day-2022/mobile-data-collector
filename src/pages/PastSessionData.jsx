import {
    currentSessionData,
    pastSessionData,
    editingPrevious,
    currentPageName,
    currentFormName,
    pastEntryIndex,
    sessionObject,
    notificationText,
} from '../utils/jotai';
import { useAtom, useSetAtom } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PastSessionData() {
    const setCurrentData = useSetAtom(currentSessionData);
    const [pastData, setPastData] = useAtom(pastSessionData);
    const setIsEditingPrevious = useSetAtom(editingPrevious);
    const setCurrentForm = useSetAtom(currentFormName);
    const setCurrentPage = useSetAtom(currentPageName);
    const setEntryIndex = useSetAtom(pastEntryIndex);
    const setCurrentSessionObject = useSetAtom(sessionObject);
    const [isOpen, setIsOpen] = useState([]);
    const [openEntry, setOpenEntry] = useState();
    const setNotification = useSetAtom(notificationText);

    const liVariant = {
        open: {
            height: '430px',
            transition: {
                type: 'spring',
                bounce: 0.25,
            },
        },
        closed: {
            height: '60px',
            transition: {
                type: 'spring',
                bounce: 0.25,
                when: '',
            },
        },
    };

    useEffect(() => {
        setIsOpen(new Array(pastData.length).fill(false));
        setPastData(
            pastData.sort(
                (a, b) => b.sessionData.sessionEpochTime - a.sessionData.sessionEpochTime,
            ),
        );
    }, []);

    const getNumberCrittersRecorded = (critter) => {
        let count = 0;
        if (critter === 'arthropod') {
            for (const dataEntry of pastData[openEntry].sessionData[critter]) {
                for (const key in dataEntry.arthropodData) {
                    count += Number(dataEntry.arthropodData[key]);
                }
            }
        } else if (
            critter === 'amphibian' ||
            critter === 'lizard' ||
            critter === 'mammal' ||
            critter === 'snake'
        ) {
            count += pastData[openEntry].sessionData[critter].length;
        }
        return count;
    };

    const container = {
        hidden: {
            opacity: 0,
            transition: {
                duration: 0.05,
            },
        },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.01,
            },
        },
    };

    const item = {
        hidden: {
            opacity: 0,
        },
        show: {
            opacity: 1,
        },
    };

    return (
        <motion.ul
            layout
            className="relative
        w-full
        flex
        flex-col
        items-center
        h-full
        max-h-[calc(100%-3em)]
        overflow-x-hidden 
        overflow-y-auto 
        scrollbar-thin 
        scrollbar-thumb-asu-maroon 
        scrollbar-thumb-rounded-full 
        rounded-lg 
      "
        >
            <h1 className="text-2xl underline underline-offset-8 font-bold">Session History</h1>
            {pastData.map((sessionEntry, index) => {
                const displayString = `${new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                }).format(
                    new Date(sessionEntry.sessionData.sessionEpochTime),
                )} - ${sessionEntry.sessionData.site}`;
                return (
                    <motion.li
                        key={index}
                        className="bg-white border-2 border-asu-maroon m-2 rounded-xl w-5/6"
                        variants={liVariant}
                        initial={'closed'}
                        animate={isOpen[index] ? 'open' : 'closed'}
                        onClick={() => {
                            setOpenEntry(index);
                            let array = new Array(pastData.length).fill(false);
                            array[index] = !isOpen[index];
                            setIsOpen(array);
                        }}
                        custom={index}
                    >
                        <motion.div
                            className={
                                !isOpen[index]
                                    ? 'flex flex-row justify-around text-lg text-center items-center transition border-b-0 h-full'
                                    : 'flex flex-row justify-around text-lg text-center items-center transition border-b-[1px] border-b-black'
                            }
                        >
                            <motion.p>
                                Uploaded to server? {sessionEntry.uploaded ? '✔️' : '❌'}
                            </motion.p>
                            <motion.p>{displayString}</motion.p>
                        </motion.div>
                        <AnimatePresence mode="sync">
                            {isOpen[index] && (
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="flex flex-col items-center"
                                >
                                    <motion.p
                                        className="text-lg"
                                        variants={item}
                                    >{`Project: ${pastData[openEntry].sessionData.project}`}</motion.p>
                                    <motion.p
                                        className="text-lg"
                                        variants={item}
                                    >{`Site: ${pastData[openEntry].sessionData.site}`}</motion.p>
                                    <motion.p
                                        className="text-lg"
                                        variants={item}
                                    >{`Array: ${pastData[openEntry].sessionData.array}`}</motion.p>
                                    <motion.div className="rounded-3xl" variants={item}>
                                        <table className="table table-compact glass rounded-3xl">
                                            <thead className="border-b-[3px] border-slate-200">
                                                <tr>
                                                    <th className="bg-transparent rounded-tl-3xl text-center">
                                                        Critter
                                                    </th>
                                                    <th className="bg-transparent rounded-tr-3xl text-center">
                                                        Number
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                <EntryTableRow
                                                    entryType={'Arthropod'}
                                                    entryNumber={getNumberCrittersRecorded(
                                                        'arthropod',
                                                    )}
                                                />
                                                <EntryTableRow
                                                    entryType={'Amphibian'}
                                                    entryNumber={getNumberCrittersRecorded(
                                                        'amphibian',
                                                    )}
                                                />
                                                <EntryTableRow
                                                    entryType={'Lizard'}
                                                    entryNumber={getNumberCrittersRecorded(
                                                        'lizard',
                                                    )}
                                                />
                                                <EntryTableRow
                                                    entryType={'Mammal'}
                                                    entryNumber={getNumberCrittersRecorded(
                                                        'mammal',
                                                    )}
                                                />
                                                <EntryTableRow
                                                    entryType={'Snake'}
                                                    entryNumber={getNumberCrittersRecorded('snake')}
                                                />
                                            </tbody>
                                        </table>
                                    </motion.div>
                                    <motion.button
                                        className="text-white bg-asu-maroon mt-2 text-lg rounded-xl p-2"
                                        variants={item}
                                        onClick={() => {
                                            const currentMonthDay = `${new Date().getMonth()}${new Date().getDate()}`;
                                            const sessionMonthDay = `${new Date(
                                                pastData[openEntry].sessionData.sessionEpochTime,
                                            ).getMonth()}${new Date(
                                                pastData[openEntry].sessionData.sessionEpochTime,
                                            ).getDate()}`;
                                            console.log(currentMonthDay, sessionMonthDay);
                                            if (currentMonthDay === sessionMonthDay) {
                                                setIsEditingPrevious(true);
                                                setCurrentData(pastData[openEntry].sessionData);
                                                setCurrentSessionObject(
                                                    pastData[openEntry].sessionObj,
                                                );
                                                setCurrentPage('Collect Data');
                                                setCurrentForm('New Data Entry');
                                                setEntryIndex(index);
                                            } else {
                                                setNotification(
                                                    'Can only edit sessions from today',
                                                );
                                                setEntryIndex(-1);
                                            }
                                        }}
                                    >
                                        Reopen this session?
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="h-20" />
                    </motion.li>
                );
            })}
        </motion.ul>
    );
}

const EntryTableRow = ({ entryType, entryNumber }) => {
    return (
        <tr>
            <td className="bg-transparent text-lg p-1">{entryType}</td>
            <td className="bg-transparent text-lg p-1">{entryNumber}</td>
        </tr>
    );
};
