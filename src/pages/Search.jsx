import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { getDocsFromCache, collection, query, where } from 'firebase/firestore';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../index';
import { useAtomValue } from 'jotai';
import { appMode } from '../utils/jotai';

export default function Search() {
    const [search, setSearch] = useState('');
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

    const [currentProject, setCurrentProject] = useState('Project');
    const [currentSite, setCurrentSite] = useState('Site');
    const [currentArray, setCurrentArray] = useState('Array');
    const [sites, setSites] = useState([]);
    const [arrays, setArrays] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const environment = useAtomValue(appMode);

    useEffect(() => {
        const handleResize = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const searchTableColumnLabels = useMemo(
        () => [
            'Date',
            'Site',
            'Array',
            'Fence Trap',
            'Species Code',
            'Toe Clip Code',
            'Recapture',
            'SVL',
            'VTL',
            'OTL',
            'Mass',
            'Sex',
            'Dead',
            'Comments',
        ],
        [],
    );

    const searchTableColumnLabelKeys = useMemo(
        () => [
            'dateTime',
            'site',
            'array',
            'fenceTrap',
            'speciesCode',
            'toeClipCode',
            'recapture',
            'svlMm',
            'vtlMm',
            'otlMm',
            'massG',
            'sex',
            'dead',
            'comments',
        ],
        [],
    );

    const getSites = async (projectName) => {
        if (projectName !== currentProject) setCurrentSite('Site');
        let sitesSnapshot = null;

        try {
            if (projectName === 'Gateway') {
                sitesSnapshot = await getDocsFromCache(
                    query(collection(db, 'AnswerSet'), where('set_name', '==', 'GatewaySites')),
                );
            } else if (projectName === 'San Pedro') {
                sitesSnapshot = await getDocsFromCache(
                    query(collection(db, 'AnswerSet'), where('set_name', '==', 'San PedroSites')),
                );
            } else if (projectName === 'Virgin River') {
                sitesSnapshot = await getDocsFromCache(
                    query(
                        collection(db, 'AnswerSet'),
                        where('set_name', '==', 'Virgin RiverSites'),
                    ),
                );
            }
            if (sitesSnapshot?.docs?.length > 0) {
                let tempSites = [];
                for (const site of sitesSnapshot.docs[0].data().answers) {
                    tempSites.push(site.primary);
                }

                if (
                    tempSites.length !== sites.length ||
                    !tempSites.every((site, index) => site === sites[index])
                ) {
                    setSites(tempSites);
                }
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            console.error('Error fetching sites');
        }
    };

    const getArrays = async (projectName, siteName) => {
        if (projectName !== currentProject || siteName !== currentSite) {
            setCurrentArray('Array');
        }
        let arraysSnapshot = null;
        const set_name = `${projectName}${siteName}Array`;

        try {
            arraysSnapshot = await getDocsFromCache(
                query(collection(db, 'AnswerSet'), where('set_name', '==', set_name)),
            );
            if (arraysSnapshot?.docs?.length > 0) {
                let tempArrays = [];
                for (const array of arraysSnapshot.docs[0].data().answers) {
                    tempArrays.push(array.primary);
                }

                if (
                    tempArrays.length !== arrays.length ||
                    !tempArrays.every((array, index) => array === arrays[index])
                ) {
                    setArrays(tempArrays);
                }
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            console.error('Error fetching arrays');
        }
    };

    const filteredEntries = useCallback(
        (entries, search) => {
            const getKey = (column) => {
                const index = searchTableColumnLabels.indexOf(column);
                return index !== -1 ? searchTableColumnLabelKeys[index] : null;
            };

            const getValue = (entry, column) => {
                const fieldKey = getKey(column);
                if (!fieldKey) return 'N/A';
                const field = entry?.[fieldKey];
                return field !== undefined && field !== null ? field : 'N/A';
            };

            if (!search || search.trim() === '') {
                return entries;
            }

            const searchTerms = search
                .split('+')
                .map((term) => term.trim().toLowerCase())
                .filter(Boolean);

            return entries.filter((entry) => {
                return searchTerms.every((term) =>
                    searchTableColumnLabels.some((label) => {
                        const entryValue = getValue(entry, label)?.toString().toLowerCase();
                        return entryValue.includes(term);
                    }),
                );
            });
        },
        [searchTableColumnLabels, searchTableColumnLabelKeys],
    );

    const retrieveLizardEntries = async () => {
        const collectionName =
            environment === 'live' ? `${currentProject}Data` : `Test${currentProject}Data`;
        const lizardDataRef = collection(db, collectionName);
        const q = query(lizardDataRef, where('site', '==', currentSite));
        try {
            const lizardEntriesSnapshot = await getDocsFromCache(q);
            console.log(environment);
            console.log(currentArray);
            console.log(collectionName);

            if (lizardEntriesSnapshot?.docs?.length > 0) {
                const tempArray = lizardEntriesSnapshot.docs.map((doc) => doc.data());
                const filteredResults = filteredEntries(tempArray, search);
                if (
                    filteredResults.length !== searchResults.length ||
                    !filteredResults.every((result, index) => result === searchResults[index])
                ) {
                    setSearchResults(filteredResults);
                }
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            console.error('Error fetching lizard entries');
        }
        setSearchIsOpen(true);
    };

    const handleProjectChange = (newProject) => {
        if (newProject !== currentProject) {
            setCurrentProject(newProject);
            setArrays([]);
            setCurrentArray('Array');
            getSites(newProject);
        }
        document.activeElement.blur();
    };

    const handleSiteChange = (newSite) => {
        if (newSite !== currentSite) {
            setCurrentSite(newSite);
            setCurrentArray('Array');
            getArrays(currentProject, newSite);
        }
        document.activeElement.blur();
    };

    const handleArrayChange = (newArray) => {
        if (newArray !== currentArray) {
            setCurrentArray(newArray);
        }
        document.activeElement.blur();
    };

    const historyContainerVariant = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
        },
    };

    const historyVariant = {
        hidden: {
            scale: 0,
            y: '50%',
        },
        visible: {
            scale: [0, 1],
            y: ['60%', '0%'],
            transition: {
                type: 'spring',
                duration: 0.25,
            },
        },
    };

    return (
        <motion.div>
            <div className="dropdown flex justify-center items-center relative">
                <label
                    tabIndex={0}
                    className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
                >
                    {currentProject}
                </label>
                <ul
                    tabIndex={0}
                    className="
        dropdown-content 
        absolute
        top-auto
        translate-y-1/2
        p-2 
        shadow 
        bg-white
        rounded-box 
        w-48
        text-asu-maroon
        z-50
        "
                >
                    <li
                        onClick={() => handleProjectChange('Gateway')}
                        className="border-b-2 border-black/25"
                    >
                        <button className="flex justify-center text-xl">Gateway</button>
                    </li>
                    <li
                        onClick={() => handleProjectChange('San Pedro')}
                        className="border-b-2 border-black/25"
                    >
                        <button className="flex justify-center text-xl">San Pedro</button>
                    </li>
                    <li onClick={() => handleProjectChange('Virgin River')}>
                        <button className="flex justify-center text-xl">Virgin River</button>
                    </li>
                </ul>
            </div>

            <div className="dropdown flex justify-center items-center relative">
                <label
                    tabIndex={0}
                    className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
                >
                    {currentSite !== 'Site' ? `Site ${currentSite}` : currentSite}
                </label>
                {sites && (
                    <ul
                        tabIndex={0}
                        className="
            dropdown-content 
            absolute
            top-auto
            translate-y-1/2
            pl-2
            pr-2
            shadow 
            bg-white 
            overflow-y-auto 
            max-h-72 
            text-asu-maroon 
            rounded-box 
            w-36
            z-50
            "
                    >
                        {sites.map((site, index) => (
                            <li
                                onClick={() => handleSiteChange(site)}
                                className={
                                    index < sites.length - 1 ? 'border-b-2 border-black/50' : ''
                                }
                                key={`${site}-${index}`}
                            >
                                <button className="flex flex-col justify-center text-xl p-2">
                                    {site}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="dropdown flex justify-center items-center relative">
                <label
                    tabIndex={0}
                    className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
                >
                    {currentArray !== 'Array' ? `Array ${currentArray}` : currentArray}
                </label>
                {arrays && (
                    <ul
                        tabIndex={0}
                        className="
            dropdown-content 
            absolute
            top-auto
            translate-y-1/2
            p-2 
            shadow 
            bg-white 
            text-asu-maroon 
            rounded-box 
            w-28
            z-50
            "
                    >
                        {arrays.map((array, index) => (
                            <li
                                onClick={() => handleArrayChange(array)}
                                className={
                                    index < arrays.length - 1 ? 'border-b-2 border-black/50' : ''
                                }
                                key={`${array}-${index}`}
                            >
                                <button className="flex justify-center text-xl">{array}</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <TextInput
                prompt="Search Database:"
                placeholder="Example: ASTI+A1B2"
                value={search}
                setValue={setSearch}
            />
            <Button
                prompt="Search"
                clickHandler={() => {
                    retrieveLizardEntries();
                }}
            />
            <AnimatePresence onExitComplete={() => setSearchResults([])}>
                {searchIsOpen && (
                    <motion.div
                        className="absolute h-screen w-screen top-0 left-0 bg-black/20 z-50"
                        variants={historyContainerVariant}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        {isPortrait ? (
                            <PortraitTable
                                historyVariant={historyVariant}
                                searchResults={searchResults}
                                searchTableColumnLabels={searchTableColumnLabels}
                                searchTableColumnLabelKeys={searchTableColumnLabelKeys}
                                setSearchIsOpen={setSearchIsOpen}
                            />
                        ) : (
                            <LandscapeTable
                                setSearchIsOpen={setSearchIsOpen}
                                searchTableColumnLabels={searchTableColumnLabels}
                                searchResults={searchResults}
                                searchTableColumnLabelKeys={searchTableColumnLabelKeys}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const PortraitTable = ({
    historyVariant,
    searchResults,
    searchTableColumnLabels,
    searchTableColumnLabelKeys,
    setSearchIsOpen,
}) => {
    return (
        <motion.div
            className="absolute h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] shadow-2xl top-0 left-0 bg-white border-2 border-asu-maroon rounded-2xl m-5 p-1 flex flex-col items-center"
            variants={historyVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <h1 className="text-3xl">Search Results</h1>

            <motion.div className="border-2 border-black w-full h-full mb-2 rounded-xl shadow-lg overflow-y-auto">
                <table className="text-center text-sm w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            {searchTableColumnLabels.map((label, index, array) => (
                                <td
                                    key={`${label}-${index}`}
                                    className={
                                        index < array.length - 1
                                            ? 'border-r-[1px] border-b-2 border-black'
                                            : 'border-r-0 border-b-2 border-black'
                                    }
                                >
                                    {label}
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.length === 0 ? (
                            <tr>
                                <td colSpan={searchTableColumnLabels.length}>
                                    <p className="text-center text-lg">No results found</p>
                                </td>
                            </tr>
                        ) : (
                            searchResults.map((entry, rowIndex) => (
                                <tr key={`${entry.id}-${rowIndex}`}>
                                    {searchTableColumnLabelKeys.map((key, index, array) => {
                                        let itemToDisplay = entry[key] ?? 'N/A';
                                        if (key === 'dateTime') {
                                            const date = new Date(entry[key]).toLocaleDateString();
                                            itemToDisplay = date;
                                        }
                                        if (itemToDisplay === 'false') {
                                            itemToDisplay = 'No';
                                        }
                                        if (itemToDisplay === 'true') {
                                            itemToDisplay = 'Yes';
                                        }
                                        return (
                                            <td
                                                key={`${key}-${rowIndex}-${index}`}
                                                className={
                                                    index < array.length - 1
                                                        ? 'border-r-[1px] border-b-[1px] border-black'
                                                        : 'border-b-[1px] border-black'
                                                }
                                            >
                                                {itemToDisplay}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </motion.div>

            <button
                className="border-2 text-xl border-asu-maroon rounded-xl w-1/2 px-4 py-1 mb-2 mt-auto"
                onClick={() => setSearchIsOpen(false)}
            >
                Close
            </button>
        </motion.div>
    );
};

const LandscapeTable = ({
    setSearchIsOpen,
    searchTableColumnLabels,
    searchResults,
    searchTableColumnLabelKeys,
}) => (
    <motion.div className="absolute h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] shadow-2xl top-0 left-0 bg-white border-2 border-asu-maroon rounded-2xl m-5 p-1 flex flex-col items-center">
        <h1 className="text-3xl">Search Results</h1>

        <motion.div className="border-2 border-black w-full h-full mb-2 rounded-xl shadow-lg overflow-y-auto">
            <table className="text-center text-sm w-full table-auto border-collapse">
                <thead>
                    <tr>
                        {searchTableColumnLabels.map((label, index, array) => (
                            <td
                                key={`${label}-${index}`}
                                className={
                                    index < array.length - 1
                                        ? 'border-r-[1px] border-b-2 border-black'
                                        : 'border-r-0 border-b-2 border-black'
                                }
                            >
                                {label}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {searchResults.length === 0 ? (
                        <tr>
                            <td colSpan={searchTableColumnLabels.length}>
                                <p className="text-center text-lg">No results found</p>
                            </td>
                        </tr>
                    ) : (
                        searchResults.map((entry, rowIndex) => (
                            <tr key={`${entry.id}-${rowIndex}`}>
                                {searchTableColumnLabelKeys.map((key, index, array) => {
                                    let itemToDisplay = entry[key] ?? 'N/A';
                                    if (key === 'dateTime') {
                                        const date = new Date(entry[key]).toLocaleDateString();
                                        itemToDisplay = date;
                                    }
                                    if (itemToDisplay === 'false') {
                                        itemToDisplay = 'No';
                                    }
                                    if (itemToDisplay === 'true') {
                                        itemToDisplay = 'Yes';
                                    }
                                    return (
                                        <td
                                            key={`${key}-${rowIndex}-${index}`}
                                            className={
                                                index < array.length - 1
                                                    ? 'border-r-[1px] border-b-[1px] border-black'
                                                    : 'border-b-[1px] border-black'
                                            }
                                        >
                                            {itemToDisplay}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </motion.div>
        <button
            className="border-2 text-xl border-asu-maroon rounded-xl w-1/2 px-4 py-1 mb-2 mt-auto"
            onClick={() => setSearchIsOpen(false)}
        >
            Close
        </button>
    </motion.div>
);
