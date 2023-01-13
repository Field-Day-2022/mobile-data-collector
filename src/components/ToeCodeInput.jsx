import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentSessionData } from '../utils/jotai';
import { db } from '../index';
import {
    collection,
    getDocFromCache,
    getDocs,
    getDocsFromCache,
    query,
    where,
    doc,
    getDocsFromServer,
} from 'firebase/firestore';
import Dropdown from './Dropdown';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import SingleCheckbox from './SingleCheckbox';

export default function ToeCodeInput({
    toeCode,
    setToeCode,
    speciesCode,
    isRecapture,
    setIsRecapture,
    setUpdatedToeCodes,
    toeCodes,
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
    // const [toeCodes, setToeCodes] = useState();
    const [preexistingToeClipCodes, setPreexistingToeClipCodes] = useState([]);
    const [errorMsg, setErrorMsg] = useState();
    const [isValid, setIsValid] = useState(false);
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [ recaptureHistoryIsOpen, setRecaptureHistoryIsOpen ] = useState(false);
    const [ historyButtonText, setHistoryButtonText ] = useState("History");
    const [ previousLizardEntries, setPreviousLizardEntries ] = useState([])

    const recaptureHistoryControls = useAnimationControls();
    const recaptureHistoryContainerControls = useAnimationControls();
    const errorMsgControls = useAnimationControls();

    // console.log(toeCodes)

    // console.log(preexistingToeClipCodes)

    // useEffect(() => {
    //     const fetchToeCodes = async () => {
    //         let toeCodesSnapshot;
    //         try {
    //             toeCodesSnapshot = await getDocFromCache(
    //                 doc(db, 'TestToeClipCodes', currentData.site)
    //             );
    //             console.log('getting toe codes from test');
    //             setToeCodes(toeCodesSnapshot.data());
    //         } catch (e) {
    //             console.log('getting toe codes from live');
    //             toeCodesSnapshot = await getDocsFromCache(
    //                 query(collection(db, 'ToeClipCodes'), where('SiteCode', '==', currentData.site))
    //             );
    //             setToeCodes(toeCodesSnapshot.docs[0].data());
    //             // console.log('retreiving toe codes from ' + currentData.site)
    //             // console.log(toeCodes)
    //         }
    //     };
    //     fetchToeCodes();
    // }, []);

    // useEffect(() => {
    //     if (toeCodes) {
    //         let tempArray = []
    //         setPreexistingToeClipCodes([]);
    //         for (const toeClipCode in toeCodes[currentData.array][speciesCode]) {
    //             if (
    //                 toeCodes[currentData.array][speciesCode][toeClipCode] !== 'date' &&
    //                 toeClipCode !== 'SpeciesCode' &&
    //                 toeClipCode !== 'ArrayCode' &&
    //                 toeClipCode !== 'SiteCode'
    //             ) {
    //                 tempArray.push(toeClipCode);
    //                 // setPreexistingToeClipCodes((preexistingToeClipCodes) => [
    //                 //     ...preexistingToeClipCodes,
    //                 //     toeClipCode,
    //                 // ]);
    //                 // console.log(toeClipCode)
    //             }
    //         }
    //         setPreexistingToeClipCodes(tempArray);
    //         console.log(`All preexisting toe codes from this species(${speciesCode}), array(${currentData.array}), and site(${currentData.site})`);
    //         console.log(preexistingToeClipCodes);
    //     }
    // }, [toeCodes]);

    useEffect(() => {
        checkToeCodeValidity();
    }, [toeCode, isRecapture]);
    

    const errorMsgVariant = {
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                type: 'spring',
            },
        },
        hidden: {
            scale: 0,
            opacity: 0,
            transition: {
                duration: 0.5,
                type: 'spring',
                delay: 1,
            },
        },
    };

    const triggerErrorMsgAnimation = async (msg) => {
        setErrorMsg(msg);
        await errorMsgControls.start('visible');
        await errorMsgControls.start('hidden');
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

    const generateNewToeCode = () => {
        for (const toeClipCode in toeCodes[currentData.array][speciesCode]) {
            if (
                toeClipCode.slice(0, toeCode.length) === toeCode &&
                toeCodes[currentData.array][speciesCode][toeClipCode] === 'date'
            ) {
                // console.log(toeClipCode, toeCodes[currentData.array][speciesCode][toeClipCode])
                setToeCode(toeClipCode);
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

    const checkToeCodeValidity = () => {
        if (toeCode.length < 2) {
            setIsValid(false);
            setErrorMsg('Toe Clip Code needs to be at least 2 characters long');
        } else if (toeCode.length % 2) {
            setIsValid(false);
            setErrorMsg('Toe Clip Code must have an even number of characters');
        } else {
            if (isRecapture) {
                if (preexistingToeClipCodes.includes(toeCode)) {
                    setIsValid(true);
                } else {
                    setErrorMsg(
                        'Toe Clip Code is not previously recorded, please uncheck the recapture box to record a new entry'
                    );
                    setIsValid(false);
                }
            } else {
                if (preexistingToeClipCodes.includes(toeCode)) {
                    setErrorMsg(
                        'Toe Clip Code is already taken, choose another or check recapture box to record a recapture'
                    );
                    setIsValid(false);
                } else {
                    setIsValid(true);
                }
            }
        }
    };

    const generateToeCodesObj = () => {
        let updatedToeCodeObject = toeCodes;
        updatedToeCodeObject[currentData.array][speciesCode][toeCode] = Date.now();
        // console.log(updatedToeCodeObject)
        setUpdatedToeCodes(updatedToeCodeObject);
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


    /* 
    Recapture History should contain: 
    Current Site, species, and toecode

    For each entry display: 
        - date
        - array
        - recapture
        - SVL
        - VTL
        - Regen Tail
        - OTL
        - Hatchling
        - Mass
        - Sex
        - Dead

    */
    const findPreviousLizardEntries = async () => {
        setHistoryButtonText("Querying...")
        const lizardDataRef = collection(db, "LizardData");
        const q = query
        (
            lizardDataRef, 
            where("toeClipCode", "==", toeCode),
            where("site", "==", currentData.site),
            where('array', '==', currentData.array),
            where("speciesCode", "==", speciesCode),
        );
        const lizardEntriesSnapshot = await getDocsFromCache(q)
        let tempArray = [];
        console.log(`Previous entries from selected toecode(${toeCode}), site(${currentData.site}), array(${currentData.array}), and speciesCode(${speciesCode})`)
        for (const doc of lizardEntriesSnapshot.docs) {
            console.log(doc.data())
            tempArray.push(doc.data())
        }
        setPreviousLizardEntries(tempArray)
        setRecaptureHistoryIsOpen(true);
        setHistoryButtonText("History");
    };

    const recaptureHistoryContainerVariant = {
        hidden: {
            opacity: 0,
        }, 
        visible: {
            opacity: 1,
        }
    }

    const recaptureHistoryVariant = {
        hidden: {
            scale: 0,
            y: '50%',
        },
        visible: {
            scale: [0, 1],
            y: ['60%', '0%'],
            transition: {
                type: "spring",
                duration: .25,
            }
        }
    }

    const lizardHistoryLabelArray = [
        "Date",
        "Mass",
        "SVL",
        "OTL",
        "VTL",
        "Recapture",
        "Dead",
        "Hatchling",
        "Regen Tail",
        "Array",
        "Sex",
    ]

    // console.log(previousLizardEntries.length)
    // console.log(previousLizardEntries)
    // console.log(previousLizardEntries[0])

    return (
        <AnimatePresence>
        <motion.div>
            <AnimatePresence>
            {recaptureHistoryIsOpen && <motion.div className="absolute h-screen w-screen top-0 left-0 bg-black/20 z-50"
                variants={recaptureHistoryContainerVariant}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <motion.div
                    className="absolute h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] shadow-2xl top-0 left-0 bg-white border-2 border-asu-maroon rounded-2xl m-5 p-1 flex flex-col items-center"
                    variants={recaptureHistoryVariant}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <h1 className="text-3xl">Recapture History</h1>
                    <motion.div
                        className="flex items-center space-x-2 justify-center w-full border-black border-0 justify-items-center max-w-md"
                    >
                        <motion.div className="flex w-16 flex-col items-center">
                            <p className="text-sm text-black/75 italic leading-none">Site</p>
                            <motion.div className="w-full bg-black h-[1px]"/>
                            <p className="text-md text-black font-semibold leading-tight">{currentData.site}</p>
                        </motion.div>
                        <motion.div className="flex w-20 flex-col items-center">
                            <p className="text-sm text-black/75 italic leading-none">Species</p>
                            <motion.div className="w-full bg-black h-[1px]"/>
                            <p className="text-md text-black font-semibold leading-tight">{speciesCode ?? 'N/A'}</p>
                        </motion.div>
                        <motion.div className="flex w-28 flex-col items-center">
                            <p className="text-sm text-black/75 italic leading-none">Toe Clip Code</p>
                            <motion.div className="w-full bg-black h-[1px]"/>
                            <p className="text-md text-black font-semibold leading-tight">{toeCode}</p>
                        </motion.div>
                    </motion.div>


                    <motion.div className="flex flex-row border-2 border-black w-full h-full mb-2 rounded-xl shadow-lg"> 
                        <table className="text-left text-sm h-full border-r-[2px] border-black table-auto border-collapse">
                            <thead>
                            {lizardHistoryLabelArray.map((item, index, array) => {
                               return <tr key={item}><td className={`${index < array.length - 1 ? "border-b border-black whitespace-nowrap" : ""}`}>{item}</td></tr>
                            })}
                            </thead>
                        </table>
                        <div className="overflow-x-auto">
                            <table className="text-center text-sm h-full border-black table-auto border-collapse">
                            <tbody>
                                {lizardHistoryLabelArray.map((item, labelIndex, array) => {
                                    let key = '';
                                    if (item === "Date") key = "dateTime"
                                    if (item === "Mass") key = "massG"
                                    if (item === "SVL") key = "svlMm"
                                    if (item === "OTL") key = "otlMm"
                                    if (item === "VTL") key = "vtlMm"
                                    if (item === "Recapture") key = "recapture"
                                    if (item === "Dead") key = "dead"
                                    if (item === "Hatchling") key = "hatchling"
                                    if (item === "Regen Tail") key = "regenTail"
                                    if (item === "Array") key = "array"
                                    if (item === "Sex") key = "sex"
                                    let tdArray = [];
                                    for (let i = 0; i < previousLizardEntries.length; i++) {
                                        let itemToDisplay = ''
                                        if (key === "dateTime") {
                                            const date = new Date(previousLizardEntries[i][key]).toLocaleDateString();
                                            itemToDisplay = date;
                                        } else {
                                            itemToDisplay = previousLizardEntries[i][key] ?? "N/A"
                                            if (itemToDisplay === "false") itemToDisplay = "No"
                                            if (itemToDisplay === "true") itemToDisplay = "Yes"
                                        }

                                        
                                        if (i < previousLizardEntries.length - 1) {
                                            tdArray.push(
                                                <td key={`${itemToDisplay}${i}`} className={`${labelIndex < array.length - 1 ? "border-b border-r border-black" : "border-r border-black"}`}>{itemToDisplay}</td>
                                            )
                                        } else {
                                            tdArray.push(
                                                <td key={`${itemToDisplay}${i}`} className={`${labelIndex < array.length - 1 ? "border-b border-black" : "border-black"}`}>{itemToDisplay}</td>
                                            )
                                        }
                                    }
                                    return (
                                        <tr key={`${labelIndex}label`}>
                                            {tdArray}
                                        </tr>
                                    )
                                })}
                            </tbody>
                            </table>
                        </div>
                    </motion.div>


                    <button className="border-2 text-xl border-asu-maroon rounded-xl w-1/2 px-4 py-1 mb-2 mt-auto"
                        onClick={() => setRecaptureHistoryIsOpen(false)}
                    >Close</button>

                </motion.div>
            </motion.div>}
            </AnimatePresence>


            {toeCodes && (
                <label
                    htmlFor="my-modal-4"
                    className="btn capitalize text-xl text-asu-maroon bg-white border-asu-maroon border-[1px] font-normal hover:bg-white/50"
                >
                    {toeCode ? `Toe-Clip Code: ${toeCode}` : 'Toe-Clip Code'}
                </label>
            )}
            <input
                type="checkbox"
                id="my-modal-4"
                className="
          modal-toggle
          "
            />

            <motion.div className="modal z-40">
                <div className="modal-box  w-11/12  max-w-sm bg-white/90 border-asu-maroon border-[1px] flex flex-col items-center min-h-screen max-h-screen p-1">
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
                        {isRecapture && toeCodes ? (
                            <Button prompt={historyButtonText} handler={() => {
                                findPreviousLizardEntries();
                            }} />
                        ) : (
                            <Button prompt="Generate New" handler={() => generateNewToeCode()} />
                        )}
                        <button
                            className={`bg-asu-maroon brightness-100 p-5 rounded-xl  text-2xl  capitalize  text-asu-gold z-10 m-1 active:brightness-50 active:scale-90 transition select-none`}
                        >
                            {isValid ? (
                                <label htmlFor="my-modal-4" onClick={() => generateToeCodesObj()}>
                                    Close
                                </label>
                            ) : (
                                <p onClick={() => triggerErrorMsgAnimation(errorMsg)}>Close</p>
                            )}
                        </button>
                    </div>
                </div>
                <motion.div
                    className="toast toast-top left-0 w-full"
                    animate={errorMsgControls}
                    variants={errorMsgVariant}
                    initial="hidden"
                >
                    <div className="alert bg-red-800/90 text-white text-xl">
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