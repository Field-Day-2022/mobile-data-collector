import {
    currentSessionData,
    pastSessionData,
    editingPrevious,
    currentPageName,
    currentFormName,
    pastEntryIndex,
} from '../utils/jotai';
import { useAtom } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PastSessionData() {
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [pastData, setPastData] = useAtom(pastSessionData);
    const [isEditingPrevious, setIsEditingPrevious] = useAtom(editingPrevious);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);
    const [currentPage, setCurrentPage] = useAtom(currentPageName);
    const [entryIndex, setEntryIndex] = useAtom(pastEntryIndex);

    const [isOpen, setIsOpen] = useState([]);
    const [openEntry, setOpenEntry] = useState();

    const liVariant = {
        open: {
            height: '410px',
        },
        closed: {
            height: '60px',
        },
    };

    const deleteSessionsBeforeToday = () => {
        const now = new Date();
        const nowDateCode = `${now.getDate()}${now.getMonth()}${now.getFullYear()}`;
        setPastData(
            pastData.filter((value) => {
                const sessionDate = new Date(value.sessionData.sessionDateTime);
                const sessionDateCode = `${sessionDate.getDate()}${sessionDate.getMonth()}${sessionDate.getFullYear()}`;
                return (nowDateCode === sessionDateCode);
            })
        );
    };

    useEffect(() => {
        setIsOpen(new Array(pastData.length).fill(false));
        deleteSessionsBeforeToday();
    }, []);

    // console.log(isOpen)

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
            for (const dataEntry of pastData[openEntry].sessionData[critter]) {
                count++;
            }
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
            <h1 className="text-xl">{`All previous sessions from today (${new Date().getMonth() + 1}-${new Date().getDate()})`}</h1>
            {pastData.map((sessionEntry, index) => {
                const date = new Date(sessionEntry.sessionData.sessionDateTime);
                const displayDate = date.toLocaleTimeString();
                const displayString = `${displayDate} - ${sessionEntry.sessionData.site}`
                const today = new Date();
                if (today.getDate() === date.getDate()) {
                    return (
                        <motion.li
                            key={index}
                            className="bg-white/90 p-4 border-2 border-asu-maroon m-2 rounded-2xl w-5/6"
                            variants={liVariant}
                            initial={false}
                            animate={isOpen[index] ? 'open' : 'closed'}
                            onClick={() => {
                                setOpenEntry(index);
                                let array = new Array(pastData.length).fill(false);
                                array[index] = !isOpen[index];
                                setIsOpen(array);
                            }}
                            custom={index}
                        >
                            {displayString}
                            <AnimatePresence mode='popLayout'>
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
                                                            'arthropod'
                                                        )}
                                                    />
                                                    <EntryTableRow
                                                        entryType={'Amphibian'}
                                                        entryNumber={getNumberCrittersRecorded(
                                                            'amphibian'
                                                        )}
                                                    />
                                                    <EntryTableRow
                                                        entryType={'Lizard'}
                                                        entryNumber={getNumberCrittersRecorded(
                                                            'lizard'
                                                        )}
                                                    />
                                                    <EntryTableRow
                                                        entryType={'Mammal'}
                                                        entryNumber={getNumberCrittersRecorded(
                                                            'mammal'
                                                        )}
                                                    />
                                                    <EntryTableRow
                                                        entryType={'Snake'}
                                                        entryNumber={getNumberCrittersRecorded(
                                                            'snake'
                                                        )}
                                                    />
                                                </tbody>
                                            </table>
                                        </motion.div>
                                        <motion.button
                                            className="text-white bg-asu-maroon mt-2 text-lg rounded-xl p-2"
                                            variants={item}
                                            onClick={() => {
                                                setIsEditingPrevious(true);
                                                setCurrentData(pastData[openEntry].sessionData);
                                                setCurrentPage('Collect Data');
                                                setCurrentForm('New Data Entry');
                                                setEntryIndex(index);
                                            }}
                                        >
                                            Reopen this session?
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="h-20"/>
                        </motion.li>
                    );
                } else {
                    return null;
                }
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
