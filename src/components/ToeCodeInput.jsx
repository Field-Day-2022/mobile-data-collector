import { useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { appMode, currentSessionData, notificationText } from '../utils/jotai';
import { db } from '../index';
import {
    collection,
    deleteDoc,
    getDocsFromCache,
    query,
    where,
    doc,
} from 'firebase/firestore';
import { motion, useAnimationControls, AnimatePresence, useCycle } from 'framer-motion';
import SingleCheckbox from './SingleCheckbox';

export default function ToeCodeInput({
    toeCode,
    setToeCode,
    speciesCode,
    isRecapture,
    setIsRecapture,
}) {
    const [selected, setSelected] = useState({
        a: false,
        b: false,
        c: false,
        d: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    });
    const [errorMsg, setErrorMsg] = useState();
    const [isValid, setIsValid] = useState(false);
    const currentData = useAtomValue(currentSessionData);
    const [recaptureHistoryIsOpen, setRecaptureHistoryIsOpen] = useState(false);
    const [historyButtonText, setHistoryButtonText] = useState('History');
    const [previousLizardEntries, setPreviousLizardEntries] = useState([]);

    // const recaptureHistoryControls = useAnimationControls();
    // const recaptureHistoryContainerControls = useAnimationControls();
    const errorMsgControls = useAnimationControls();

    const environment = useAtomValue(appMode)
    const setNotification = useSetAtom(notificationText);

    useEffect(() => {
        checkToeCodeValidity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toeCode, isRecapture]);

    const errorMsgVariant = {
        visible: {
            y: '0',
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                type: 'spring',
            },
        },
        hidden: {
            y: '-100%',
            scale: 0,
            opacity: 0,
            transition: {
                duration: 0.5,
                type: 'spring',
                delay: 2,
            },
        },
    };

    const triggerErrorMsgAnimation = async (msg) => {
        setErrorMsg(msg);
        errorMsgControls.set('hidden');
        errorMsgControls.start('visible')
        .then(() => {
            errorMsgControls.start('hidden');
        })
    };

    const letters = ['A', 'B', 'C', 'D'];
    const numbers = [1, 2, 3, 4, 5];

    const formattedToeCodes = toeCode
        ? toeCode.split('').reduce((total, current, index, array) => {
              if (index % 2 && index < array.length - 1) {
                  return `${total}${current}-`;
              } else {
                  return `${total}${current}`;
              }
          })
        : 'EX: A1-B2-C3';

    const generateNewToeCode = async () => {
        if (toeCode.includes('C4') || toeCode.includes('D4')) {
            triggerErrorMsgAnimation('App does not generate toe clip codes with C4 or D4');
        }
        console.log(`Environment: ${environment}`)
        const collectionName = environment === 'live' ? 
            `${currentData.project.replace(/\s/g, '')}Data` 
            : 
            `Test${currentData.project.replace(/\s/g, '')}Data`;
        const lizardSnapshot = await getDocsFromCache(query(
            collection(db, collectionName),
            where('site', '==', currentData.site),
            where('array', '==', currentData.array),
            where('speciesCode', '==', speciesCode)
        ));
        console.log(`${collectionName} from site ${currentData.site} and array ${currentData.array} with species code ${speciesCode}`)
        const toeCodesArray = [];
        lizardSnapshot.docs.forEach(document => {
            toeCodesArray.push(document.data().toeClipCode)
        })
        console.log(toeCodesArray)
        const toeCodesTemplateSnapshot = await getDocsFromCache(query(
            collection(db, 'AnswerSet'),
            where('set_name', '==', 'toe clip codes')
        ));
        for (const templateToeCode of toeCodesTemplateSnapshot.docs[0].data().answers) {
            if (
                !toeCodesArray.includes(templateToeCode.primary) && 
                !templateToeCode.primary.includes('C4') &&
                !templateToeCode.primary.includes('D4')
            ) {
                setToeCode(templateToeCode.primary);
                setSelected({
                    a: false,
                    b: false,
                    c: false,
                    d: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                });
                return;
            }
        }
    };

    const checkToeCodeValidity = async () => {
        if (toeCode.length < 2) {
            setIsValid(false);
            setErrorMsg('Toe Clip Code needs to be at least 2 characters long');
        } else if (toeCode.length % 2) {
            setIsValid(false);
            setErrorMsg('Toe Clip Code must have an even number of characters');
        } else {
            const collectionName = environment === 'live' ? 
                `${currentData.project.replace(/\s/g, '')}Data` 
                : 
                `Test${currentData.project.replace(/\s/g, '')}Data`;
            const lizardSnapshot = await getDocsFromCache(query(
                collection(db, collectionName),
                where('toeClipCode', '==', toeCode),
                where('site', '==', currentData.site),
                where('array', '==', currentData.array),
                where('speciesCode', '==', speciesCode)
            ));
            if (isRecapture) {
                if (lizardSnapshot.size > 0) {
                    setIsValid(true);
                } else {
                    setErrorMsg(
                        'Toe Clip Code is not previously recorded, please uncheck the recapture box to record a new entry'
                    );
                    setIsValid(false);
                }
            } else {
                if (lizardSnapshot.size > 0) {
                    setErrorMsg(
                        'Toe Clip Code is already taken, choose another or check recapture box'
                    );
                    setIsValid(false);
                } else {
                    setIsValid(true);
                }
            }
        }
    };

    const handleClick = (source) => {
        if (source !== 'backspace' && toeCode.length !== 8) {
            if (Number(source)) {
                if (toeCode.length === 0) {
                    triggerErrorMsgAnimation('Error: Toe Clip Codes must begin with a letter');
                    return;
                }
                if (!Number(toeCode.charAt(toeCode.length - 1))) {
                    setToeCode(`${toeCode}${source}`);
                    setSelected({
                        a: false,
                        b: false,
                        c: false,
                        d: false,
                        1: false,
                        2: false,
                        3: false,
                        4: false,
                        5: false,
                    });
                }
            } else {
                if (Number(toeCode.charAt(toeCode.length - 1)) || toeCode.length === 0) {
                    // console.log("letter pressed")
                    if (toeCode.length >= 2 && source <= toeCode.charAt(toeCode.length - 2)) {
                        triggerErrorMsgAnimation(
                            source < toeCode.charAt(toeCode.length - 2)
                                ? 'Error: Letters must be in alphabetical order'
                                : 'Error: Can only clip one toe per foot'
                        );
                        return;
                    }
                    setToeCode(`${toeCode}${source}`);
                    setSelected({ ...selected, [source]: !selected[source] });
                }
            }
        } else if (source === 'backspace') {
            setToeCode(toeCode.substring(0, toeCode.length - 1));
            setSelected({
                a: false,
                b: false,
                c: false,
                d: false,
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
            });
            if (!Number(toeCode.charAt(toeCode.length - 2)) && toeCode.charAt(toeCode.length - 2)) {
                setSelected({ ...selected, [toeCode.charAt(toeCode.length - 2)]: true });
            }
        }
    };

    const findPreviousLizardEntries = async () => {
        setHistoryButtonText('Querying...');
        const collectionName = environment === 'live' ? 
            `${currentData.project.replace(/\s/g, '')}Data` 
            : 
            `Test${currentData.project.replace(/\s/g, '')}Data`;
        const lizardDataRef = collection(db, collectionName);
        const q = query(
            lizardDataRef,
            where('toeClipCode', '==', toeCode),
            where('site', '==', currentData.site),
            where('array', '==', currentData.array),
            where('speciesCode', '==', speciesCode)
        );
        const lizardEntriesSnapshot = await getDocsFromCache(q);
        let tempArray = [];
        for (const doc of lizardEntriesSnapshot.docs) {
            console.log(doc.data());
            tempArray.push(doc.data());
        }
        // for testing scrollability of the table 
        // for (let i = 0; i < 50; i++) {
        //     tempArray.push(tempArray[0])
        // }
        setPreviousLizardEntries(tempArray);
        setRecaptureHistoryIsOpen(true);
        setHistoryButtonText('History');
    };

    const recaptureHistoryContainerVariant = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
        },
    };

    const recaptureHistoryVariant = {
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

    const lizardHistoryLabelArray = [
        'Date',
        'Array',
        'Recapture',
        'SVL',
        'VTL',
        'OTL',
        'Mass',
        'Sex',
        'Dead',
        'Comments',
    ];
    
    const lizardHistoryLabelKeys = [
        'dateTime',
        'array',
        'recapture',
        'svlMm',
        'vtlMm',
        'otlMm',
        'massG',
        'sex',
        'dead',
        'comments'
    ]

    return (
        <AnimatePresence>
            <motion.div>
                <AnimatePresence>
                    {recaptureHistoryIsOpen && (
                        <motion.div
                            className="absolute h-screen w-screen top-0 left-0 bg-black/20 z-50"
                            variants={recaptureHistoryContainerVariant}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <PortraitTable 
                                recaptureHistoryVariant={recaptureHistoryVariant}
                                currentData={currentData}
                                speciesCode={speciesCode}
                                toeCode={toeCode}
                                lizardHistoryLabelArray={lizardHistoryLabelArray}
                                previousLizardEntries={previousLizardEntries}
                                setRecaptureHistoryIsOpen={setRecaptureHistoryIsOpen}
                            />
                            <LandscapeTable 
                                currentData={currentData}
                                speciesCode={speciesCode}
                                toeCode={toeCode}
                                lizardHistoryLabelArray={lizardHistoryLabelArray}
                                previousLizardEntries={previousLizardEntries}
                                lizardHistoryLabelKeys={lizardHistoryLabelKeys}
                                setRecaptureHistoryIsOpen={setRecaptureHistoryIsOpen}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                
                    <label
                        htmlFor="my-modal-4"
                        className="btn capitalize text-xl text-black bg-white border-asu-maroon border-[1px] font-normal hover:bg-white/50"
                    >
                        {toeCode ? `Toe-Clip Code: ${toeCode}` : 'Toe-Clip Code'}
                    </label>
                
                <input
                    type="checkbox"
                    id="my-modal-4"
                    className="
          modal-toggle
          "
                />

                <motion.div className="modal z-40">
                    <div className="modal-box  w-11/12  max-w-sm bg-white border-asu-maroon border-[1px] flex flex-col items-center min-h-screen max-h-screen p-1">
                        <div className="flex flex-row">
                            <div className="flex flex-col">
                                <p className="text-sm">Toe-Clip Code:</p>
                                <p className="text-xl">{formattedToeCodes}</p>
                            </div>
                        </div>
                        <div className="w-3/4 relative">
                            <img
                                src="./toe-clip-example-img.png"
                                alt="example toe codes"
                                className="w-full z-0"
                            />
                            <div className="absolute bottom-0 w-1/2 right-0">
                                <SingleCheckbox
                                    prompt="Is it a recapture?"
                                    value={isRecapture}
                                    setValue={setIsRecapture}
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-evenly items-center">
                            {letters.map((letter) => (
                                <Button
                                    key={letter}
                                    prompt={letter}
                                    handler={() => handleClick(letter)}
                                    isSelected={selected[letter]}
                                />
                            ))}
                            <div
                                className="bg-asu-maroon rounded-xl brightness-100 text-2xl  capitalize  text-asu-gold z-10 active:brightness-50 active:scale-90 transition"
                                onClick={() => handleClick('backspace')}
                            >
                                <svg
                                    height="72"
                                    width="50"
                                    viewBox="0 0 500 500"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="nonzero"
                                        d="M 355.684 68.486 C 359.156 65.197 359.172 59.835 355.716 56.523 C 352.273 53.211 346.62 53.197 343.159 56.493 L 144.317 244.006 C 140.845 247.295 140.828 252.657 144.284 255.969 L 343.159 443.513 C 346.631 446.802 352.26 446.787 355.716 443.475 C 359.172 440.163 359.156 434.809 355.684 431.52 L 163.201 250.003 L 355.684 68.486 Z"
                                        fill="rgb(255, 198, 39)"
                                        paintOrder="fill"
                                        strokeMiterlimit={'11'}
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex mt-2 w-full justify-evenly">
                            {numbers.map((number) => (
                                <Button
                                    key={number}
                                    prompt={number}
                                    handler={() => handleClick(number)}
                                    isSelected={selected[number]}
                                />
                            ))}
                        </div>
                        <div className="flex flex-row items-center ">
                            {isRecapture ? (
                                <Button
                                    prompt={historyButtonText}
                                    handler={() => {
                                        findPreviousLizardEntries();
                                    }}
                                />
                            ) : (
                                <Button
                                    prompt="Generate New"
                                    handler={() => generateNewToeCode()}
                                />
                            )}
                            <button
                                className={`bg-asu-maroon brightness-100 p-5 rounded-xl  text-2xl  capitalize  text-asu-gold z-10 m-1 active:brightness-50 active:scale-90 transition select-none`}
                            >
                                {isValid ? (
                                    <label
                                        htmlFor="my-modal-4"
                                    >
                                        Close
                                    </label>
                                ) : (
                                    <p onClick={() => triggerErrorMsgAnimation(errorMsg)}>Close</p>
                                )}
                            </button>
                        </div>
                    </div>
                    <motion.div
                        className="toast top-10 toast-top left-0 w-full"
                        animate={errorMsgControls}
                        variants={errorMsgVariant}
                        initial="hidden"
                    >
                        <div className="alert bg-red-800 text-white text-xl">
                            <div>
                                <span>{errorMsg}</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

const Comments = ({
    commentText
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <motion.div 
            className=''
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <AnimatePresence>{isExpanded && 
            <motion.div 
                initial={{opacity: 0}}
                animate={{
                    opacity: 1,
                    y: '-100%',
                }}
                exit={{
                    opacity: 0,
                    y: '-50%',
                    transition: {
                        y: {
                            duration: .3
                        },
                        opacity: {
                            duration: .2
                        }
                    }
                }}
                className='absolute border-[1px] border-asu-maroon z-10 bg-white rounded-sm p-1'>
                <p>{commentText}</p>
            </motion.div>}</AnimatePresence>
            <p>{commentText.length > 5 ? `${commentText.slice(0, 5)}...` : commentText}</p>
            
        </motion.div>
    )
}

const PortraitTable = ({
    recaptureHistoryVariant,
    currentData,
    speciesCode,
    toeCode,
    lizardHistoryLabelArray,
    previousLizardEntries,
    setRecaptureHistoryIsOpen
}) => {
    return (
        <motion.div
            className="absolute h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] shadow-2xl top-0 left-0 bg-white border-2 border-asu-maroon rounded-2xl m-5 p-1 flex flex-col items-center landscape:hidden"
            variants={recaptureHistoryVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <h1 className="text-3xl">Recapture History</h1>

            <motion.div className="flex items-center space-x-2 justify-center w-full border-black border-0 justify-items-center max-w-md">
                <motion.div className="flex w-16 flex-col items-center">
                    <p className="text-sm text-black/75 italic leading-none">
                        Site
                    </p>
                    <motion.div className="w-full bg-black h-[1px]" />
                    <p className="text-md text-black font-semibold leading-tight">
                        {currentData.site}
                    </p>
                </motion.div>
                <motion.div className="flex w-20 flex-col items-center">
                    <p className="text-sm text-black/75 italic leading-none">
                        Species
                    </p>
                    <motion.div className="w-full bg-black h-[1px]" />
                    <p className="text-md text-black font-semibold leading-tight">
                        {speciesCode ?? 'N/A'}
                    </p>
                </motion.div>
                <motion.div className="flex w-28 flex-col items-center">
                    <p className="text-sm text-black/75 italic leading-none">
                        Toe Clip Code
                    </p>
                    <motion.div className="w-full bg-black h-[1px]" />
                    <p className="text-md text-black font-semibold leading-tight">
                        {toeCode}
                    </p>
                </motion.div>
            </motion.div>

            <motion.div className="flex flex-row border-2 border-black w-full h-full mb-2 rounded-xl shadow-lg">
                <table className="text-left text-sm h-full border-r-[2px] border-black table-auto border-collapse">
                    <thead>
                        {lizardHistoryLabelArray.map((item, index, array) => {
                            return (
                                <tr key={item}>
                                    <td
                                        className={`${
                                            index < array.length - 1
                                                ? 'border-b border-black whitespace-nowrap'
                                                : ''
                                        }`}
                                    >
                                        {item}
                                    </td>
                                </tr>
                            );
                        })}
                    </thead>
                </table>
                <div className="overflow-x-auto">
                    <table className="text-center text-sm h-full border-black table-auto border-collapse">
                        <tbody>
                            {lizardHistoryLabelArray.map(
                                (item, labelIndex, array) => {
                                    let key = '';
                                    if (item === 'Date') key = 'dateTime';
                                    if (item === 'Mass') key = 'massG';
                                    if (item === 'SVL') key = 'svlMm';
                                    if (item === 'OTL') key = 'otlMm';
                                    if (item === 'VTL') key = 'vtlMm';
                                    if (item === 'Recapture') key = 'recapture';
                                    if (item === 'Dead') key = 'dead';
                                    if (item === 'Hatchling') key = 'hatchling';
                                    if (item === 'Regen Tail')
                                        key = 'regenTail';
                                    if (item === 'Array') key = 'array';
                                    if (item === 'Sex') key = 'sex';
                                    if (item === 'Comments') key = 'comments';
                                    let tdArray = [];
                                    for (
                                        let i = 0;
                                        i < previousLizardEntries.length;
                                        i++
                                    ) {
                                        let itemToDisplay = '';
                                        if (key === 'dateTime') {
                                            const date = new Date(
                                                previousLizardEntries[i][key]
                                            ).toLocaleDateString();
                                            itemToDisplay = date;
                                        } else {
                                            itemToDisplay =
                                                previousLizardEntries[i][key] ??
                                                'N/A';
                                            if (itemToDisplay === 'false')
                                                itemToDisplay = 'No';
                                            if (itemToDisplay === 'true')
                                                itemToDisplay = 'Yes';
                                        }
                                        
                                        if (item === 'Comments') {
                                            itemToDisplay = <Comments commentText={previousLizardEntries[i][key] ?? 'N/A'}/>
                                        }

                                        if (
                                            i <
                                            previousLizardEntries.length - 1
                                        ) {
                                            tdArray.push(
                                                <td
                                                    key={`${itemToDisplay}${i}`}
                                                    className={`${
                                                        labelIndex <
                                                        array.length - 1
                                                            ? 'border-b border-r border-black'
                                                            : 'border-r border-black'
                                                    }`}
                                                >
                                                    {itemToDisplay}
                                                </td>
                                            );
                                        } else {
                                            tdArray.push(
                                                <td
                                                    key={`${itemToDisplay}${i}`}
                                                    className={`${
                                                        labelIndex <
                                                        array.length - 1
                                                            ? 'border-b border-black'
                                                            : 'border-black'
                                                    }`}
                                                >
                                                    {itemToDisplay}
                                                </td>
                                            );
                                        }
                                    }
                                    return (
                                        <tr key={`${labelIndex}label`}>
                                            {tdArray}
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <button
                className="border-2 text-xl border-asu-maroon rounded-xl w-1/2 px-4 py-1 mb-2 mt-auto"
                onClick={() => setRecaptureHistoryIsOpen(false)}
            >
                Close
            </button>
        </motion.div>
    )
}

const LandscapeTable = ({
    currentData,
    speciesCode,
    toeCode,
    lizardHistoryLabelArray,
    previousLizardEntries,
    lizardHistoryLabelKeys,
    setRecaptureHistoryIsOpen
}) => (
    <motion.div className="absolute h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] shadow-2xl top-0 left-0 bg-white border-2 border-asu-maroon rounded-2xl m-5 p-1 flex flex-col items-center portrait:hidden">
        <h1 className="text-3xl">Recapture History</h1>

        <motion.div className="flex items-center space-x-2 justify-center w-full border-black border-0 justify-items-center max-w-md">
            <motion.div className="flex w-16 flex-col items-center">
                <p className="text-sm text-black/75 italic leading-none">
                    Site
                </p>
                <motion.div className="w-full bg-black h-[1px]" />
                <p className="text-md text-black font-semibold leading-tight">
                    {currentData.site}
                </p>
            </motion.div>
            <motion.div className="flex w-20 flex-col items-center">
                <p className="text-sm text-black/75 italic leading-none">
                    Species
                </p>
                <motion.div className="w-full bg-black h-[1px]" />
                <p className="text-md text-black font-semibold leading-tight">
                    {speciesCode ?? 'N/A'}
                </p>
            </motion.div>
            <motion.div className="flex w-28 flex-col items-center">
                <p className="text-sm text-black/75 italic leading-none">
                    Toe Clip Code
                </p>
                <motion.div className="w-full bg-black h-[1px]" />
                <p className="text-md text-black font-semibold leading-tight">
                    {toeCode}
                </p>
            </motion.div>
        </motion.div>

        <motion.div className="border-2 border-black w-full h-full mb-2 rounded-xl shadow-lg overflow-y-auto">
            <table className="text-center text-sm w-full table-auto border-collapse">
                <thead>
                    <tr>
                        {lizardHistoryLabelArray.map(((label, index, array) => (
                            <td key={label} className={index < array.length - 1 ? 
                                                        'border-r-[1px] border-b-2 border-black'
                                                        :
                                                        'border-r-0 border-b-2 border-black'
                                }>{label}</td>
                        )))}
                    </tr>
                </thead>
                <tbody>
                    {previousLizardEntries.map((entry, index, array) => {
                        return (
                            <tr key={index}>
                                {lizardHistoryLabelKeys.map((key, index, array) => {
                                    let itemToDisplay = entry[key] ?? 'N/A';
                                    if (key === 'dateTime') {
                                        const date = new Date(entry[key]).toLocaleDateString();
                                        itemToDisplay = date;
                                    } 
                                    if (itemToDisplay  === 'false') {
                                        itemToDisplay = 'No';
                                    }
                                    if (itemToDisplay === 'true') {
                                        itemToDisplay = 'Yes';
                                    }
                                    return (
                                        <td 
                                            key={`${itemToDisplay}${index}`} 
                                            className={
                                                index < array.length - 1 ? 
                                                'border-r-[1px] border-b-[1px] border-black'
                                                :
                                                'border-b-[1px] border-black'
                                            }
                                        >{itemToDisplay}</td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </motion.div>
        <button
            className="border-2 text-xl border-asu-maroon rounded-xl w-1/2 px-4 py-1 mb-2 mt-auto"
            onClick={() => setRecaptureHistoryIsOpen(false)}
        >
            Close
        </button>
    </motion.div>
)

function Button({ prompt, handler, isSelected }) {
    return (
        <button
            className={
                isSelected
                    ? `bg-asu-maroon brightness-50 p-5 rounded-xl  text-2xl  capitalize  text-asu-gold z-10 m-1 active:brightness-50 active:scale-90 transition select-none`
                    : `bg-asu-maroon brightness-100 p-5 rounded-xl  text-2xl  capitalize  text-asu-gold z-10 m-1 active:brightness-50 active:scale-90 transition select-none`
            }
            onClick={handler}
        >
            {prompt}
        </button>
    );
}
