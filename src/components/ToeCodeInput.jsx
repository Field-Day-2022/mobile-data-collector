import { useState, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { appMode, currentSessionData } from '../utils/jotai';
import { db } from '../index';
import { collection, getDocsFromCache, query, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

const footOptions = ['A', 'B', 'C', 'D'];
const toeOptions = ['1', '2', '3', '4', '5'];

const getToeCodePairs = (code) => {
    const pairs = [];
    for (let index = 0; index < code.length; index += 2) {
        pairs.push({
            foot: code.charAt(index),
            toe: code.charAt(index + 1),
            toeNumber: Number(code.charAt(index + 1)),
            pair: code.slice(index, index + 2),
        });
    }
    return pairs;
};

const getCanonicalToeCode = (code) => {
    if (!code || code.length % 2) return code;
    const pairs = getToeCodePairs(code);
    const hasInvalidPair = pairs.some(
        ({ foot, toe }) => !footOptions.includes(foot) || !toeOptions.includes(toe)
    );
    if (hasInvalidPair) return code;

    return pairs
        .sort((first, second) => {
            if (first.foot === second.foot) return first.toeNumber - second.toeNumber;
            return first.foot < second.foot ? -1 : 1;
        })
        .map(({ pair }) => pair)
        .join('');
};

const getToeCodeValidationMessage = (code) => {
    if (code.length < 2) return 'Toe Clip Code needs to be at least 2 characters long';
    if (code.length % 2) return 'Toe Clip Code must have an even number of characters';

    const pairs = getToeCodePairs(code);
    const clippedToes = new Set();
    const previousToeByFoot = {};
    let previousFoot = '';

    for (const { foot, toe, toeNumber, pair } of pairs) {
        if (!footOptions.includes(foot) || !toeOptions.includes(toe)) {
            return 'Toe Clip Code contains an invalid foot or toe number';
        }
        if (previousFoot && foot < previousFoot) {
            return 'Toe Clip Code letters must be in alphabetical order';
        }
        if (clippedToes.has(pair)) {
            return 'Toe Clip Code cannot include the same toe twice';
        }
        if (previousToeByFoot[foot] !== undefined && toeNumber <= previousToeByFoot[foot]) {
            return 'Toe numbers on the same foot must be in ascending order';
        }

        clippedToes.add(pair);
        previousToeByFoot[foot] = toeNumber;
        previousFoot = foot;
    }

    return '';
};

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
    const [toeCodeBeforeEdit, setToeCodeBeforeEdit] = useState(toeCode);
    const [isRecaptureBeforeEdit, setIsRecaptureBeforeEdit] = useState(isRecapture);
    const [isCheckingValidity, setIsCheckingValidity] = useState(false);
    const [confirmUnusual, setConfirmUnusual] = useState(false);

    const modalToggleRef = useRef(null);
    const validationRequestRef = useRef(0);

    const environment = useAtomValue(appMode);

    useEffect(() => {
        checkToeCodeValidity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toeCode, isRecapture, speciesCode]);

    useEffect(() => {
        setConfirmUnusual(false);
    }, [toeCode]);

    const maxToeCodeLength = 16;

    const footLetters = toeCode.match(/[A-D]/g) ?? [];
    const hasRepeatedFoot = new Set(footLetters).size !== footLetters.length;
    const hasCriticalToe = toeCode.includes('C4') || toeCode.includes('D4');
    const hasUnusualPattern = hasRepeatedFoot || hasCriticalToe;
    const unusualPatternDetail =
        hasRepeatedFoot && hasCriticalToe
            ? 'more than one toe on a foot, and a C4/D4 toe that is important to survival'
            : hasCriticalToe
            ? 'a C4 or D4 toe, which is important to survival'
            : 'more than one toe on a foot';
    const statusMessage = !toeCode
        ? 'Enter or suggest a toe-clip code.'
        : isCheckingValidity
        ? 'Checking toe-clip code availability...'
        : errorMsg
        ? errorMsg
        : hasUnusualPattern && confirmUnusual
        ? `Unusual pattern: ${unusualPatternDetail}. Press Save again to confirm.`
        : hasUnusualPattern
        ? `Unusual pattern: ${unusualPatternDetail}. Double-check this is intentional.`
        : isValid
        ? 'Toe-clip code is valid and ready to save.'
        : 'Enter or suggest a toe-clip code.';
    const statusClassName = !toeCode
        ? 'border-black/30 bg-black/5 text-black/70'
        : isCheckingValidity
        ? 'border-black/30 bg-black/5 text-black/70'
        : errorMsg
        ? 'border-red-700 bg-red-50 text-red-800'
        : hasUnusualPattern
        ? 'border-amber-400 bg-amber-50 text-amber-800'
        : isValid
        ? 'border-green-700 bg-green-50 text-green-800'
        : 'border-black/30 bg-black/5 text-black/70';

    const formattedToeCodes = toeCode
        ? toeCode.split('').reduce((total, current, index, array) => {
              if (index % 2 && index < array.length - 1) {
                  return `${total}${current}-`;
              } else {
                  return `${total}${current}`;
              }
          })
        : 'EX: A1-B2-C3';

    const resetSelected = () => {
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
    };

    const handleToeCodeModalOpen = () => {
        if (!speciesCode) return;
        setToeCodeBeforeEdit(toeCode);
        setIsRecaptureBeforeEdit(isRecapture);
        modalToggleRef.current?.click();
    };

    const cancelToeCodeEntry = () => {
        setToeCode(toeCodeBeforeEdit);
        setIsRecapture(isRecaptureBeforeEdit);
        resetSelected();
        setErrorMsg();
        setConfirmUnusual(false);
    };

    const saveToeCodeEntry = () => {
        if (!isValid) return;
        if (hasUnusualPattern && !confirmUnusual) {
            setConfirmUnusual(true);
            return;
        }
        modalToggleRef.current?.click();
    };

    const generateNewToeCode = async () => {
        if (toeCode.includes('C4') || toeCode.includes('D4')) {
            setErrorMsg('App does not generate toe clip codes with C4 or D4');
        }
        console.log(`Environment: ${environment}`);
        const collectionName =
            environment === 'live'
                ? `${currentData.project.replace(/\s/g, '')}Data`
                : `Test${currentData.project.replace(/\s/g, '')}Data`;
        const lizardSnapshot = await getDocsFromCache(
            query(
                collection(db, collectionName),
                where('site', '==', currentData.site),
                where('speciesCode', '==', speciesCode)
            )
        );
        console.log(
            `${collectionName} from site ${currentData.site} with species code ${speciesCode}`
        );
        const toeCodesArray = [];
        lizardSnapshot.docs.forEach((document) => {
            toeCodesArray.push(getCanonicalToeCode(document.data().toeClipCode));
        });
        console.log(toeCodesArray);
        const toeCodesTemplateSnapshot = await getDocsFromCache(
            query(collection(db, 'AnswerSet'), where('set_name', '==', 'toe clip codes'))
        );

        // if current toe code is nonempty, then there is a toe that is already gone,
        // and we would like to utilize the natural toe loss in the toe clip code.
        // this will also work when toeCode = ''
        for (const templateToeCode of toeCodesTemplateSnapshot.docs[0].data().answers) {
            if (
                templateToeCode.primary.includes(toeCode) && // the template code contains the current toeCode
                !templateToeCode.primary.includes('C4') && // it does not contain "C4"
                !templateToeCode.primary.includes('D4') && // it does not contain "C4"
                !toeCodesArray.includes(templateToeCode.primary) // it has not be already used
            ) {
                setToeCode(templateToeCode.primary);
                resetSelected();
                return;
            }
        }

        console.log('no toe codes available that include what we want, grabbing first available');

        // if we got here then we don't have a template toe code that contains what we want, so just
        // grab the first available
        for (const templateToeCode of toeCodesTemplateSnapshot.docs[0].data().answers) {
            if (
                !toeCodesArray.includes(templateToeCode.primary) &&
                !templateToeCode.primary.includes('C4') &&
                !templateToeCode.primary.includes('D4')
            ) {
                setToeCode(templateToeCode.primary);
                resetSelected();
                return;
            }
        }
    };

    const checkToeCodeValidity = async () => {
        const validationRequestId = ++validationRequestRef.current;
        if (!speciesCode) {
            setIsCheckingValidity(false);
            setIsValid(false);
            setErrorMsg('Select a species before entering a toe-clip code');
            return;
        }
        const validationMessage = getToeCodeValidationMessage(toeCode);
        if (validationMessage) {
            setIsCheckingValidity(false);
            setIsValid(false);
            setErrorMsg(validationMessage);
        } else {
            setIsCheckingValidity(true);
            setIsValid(false);
            setErrorMsg();
            const canonicalToeCode = getCanonicalToeCode(toeCode);
            const collectionName =
                environment === 'live'
                    ? `${currentData.project.replace(/\s/g, '')}Data`
                    : `Test${currentData.project.replace(/\s/g, '')}Data`;
            const lizardSnapshot = await getDocsFromCache(
                query(
                    collection(db, collectionName),
                    where('site', '==', currentData.site),
                    where('speciesCode', '==', speciesCode)
                )
            );
            if (validationRequestId !== validationRequestRef.current) return;
            setIsCheckingValidity(false);
            const matchingLizardEntries = lizardSnapshot.docs.filter((document) => {
                return getCanonicalToeCode(document.data().toeClipCode) === canonicalToeCode;
            });
            if (isRecapture) {
                if (matchingLizardEntries.length > 0) {
                    setIsValid(true);
                    setErrorMsg();
                } else {
                    setErrorMsg(
                        'Toe Clip Code is not previously recorded, please uncheck the recapture box to record a new entry'
                    );
                    setIsValid(false);
                }
            } else {
                if (matchingLizardEntries.length > 0) {
                    setErrorMsg(
                        'Toe Clip Code is already taken, choose another or check recapture box'
                    );
                    setIsValid(false);
                } else {
                    setIsValid(true);
                    setErrorMsg();
                }
            }
        }
    };

    const handleClick = (source) => {
        if (source !== 'backspace' && toeCode.length < maxToeCodeLength) {
            if (Number(source)) {
                if (toeCode.length === 0) {
                    setErrorMsg('Toe Clip Codes must begin with a letter');
                    return;
                }
                if (!Number(toeCode.charAt(toeCode.length - 1))) {
                    const nextToeCode = `${toeCode}${source}`;
                    const validationMessage = getToeCodeValidationMessage(nextToeCode);
                    if (validationMessage) {
                        setErrorMsg(validationMessage);
                        return;
                    }
                    setToeCode(nextToeCode);
                    resetSelected();
                }
            } else {
                if (Number(toeCode.charAt(toeCode.length - 1)) || toeCode.length === 0) {
                    // console.log("letter pressed")
                    const previousLetter = toeCode.charAt(toeCode.length - 2);
                    if (toeCode.length >= 2 && source < previousLetter) {
                        setErrorMsg('Letters must be in alphabetical order');
                        return;
                    }
                    if (
                        toeCode.length >= 2 &&
                        source === previousLetter &&
                        toeCode.charAt(toeCode.length - 1) === '5'
                    ) {
                        setErrorMsg('No higher toe number is available on this foot');
                        return;
                    }
                    setToeCode(`${toeCode}${source}`);
                    setSelected({ ...selected, [source]: !selected[source] });
                }
            }
        } else if (source === 'backspace') {
            setToeCode(toeCode.substring(0, toeCode.length - 1));
            resetSelected();
            if (!Number(toeCode.charAt(toeCode.length - 2)) && toeCode.charAt(toeCode.length - 2)) {
                setSelected({ ...selected, [toeCode.charAt(toeCode.length - 2)]: true });
            }
        }
    };

    const findPreviousLizardEntries = async () => {
        setHistoryButtonText('Querying...');
        const collectionName =
            environment === 'live'
                ? `${currentData.project.replace(/\s/g, '')}Data`
                : `Test${currentData.project.replace(/\s/g, '')}Data`;
        const lizardDataRef = collection(db, collectionName);
        const q = query(
            lizardDataRef,
            where('site', '==', currentData.site),
            where('speciesCode', '==', speciesCode)
        );
        const lizardEntriesSnapshot = await getDocsFromCache(q);
        let tempArray = [];
        const canonicalToeCode = getCanonicalToeCode(toeCode);
        for (const doc of lizardEntriesSnapshot.docs) {
            if (getCanonicalToeCode(doc.data().toeClipCode) !== canonicalToeCode) continue;
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
        'comments',
    ];

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

                <button
                    type="button"
                    disabled={!speciesCode}
                    title={!speciesCode ? 'Select a species before entering a toe-clip code' : ''}
                    className="flex min-h-14 min-w-52 flex-col items-center justify-center rounded-lg border-2 border-asu-maroon bg-white px-4 py-2 text-black transition hover:bg-white/50 active:scale-95 disabled:cursor-not-allowed disabled:border-black/20 disabled:bg-black/5 disabled:text-black/60 disabled:hover:bg-black/5 disabled:active:scale-100"
                    onClick={handleToeCodeModalOpen}
                >
                    <span className="text-xl leading-tight">
                        {toeCode ? `Toe-Clip Code: ${toeCode}` : 'Toe-Clip Code'}
                    </span>
                    {!speciesCode && (
                        <span className="text-xs leading-tight">Select species first</span>
                    )}
                </button>

                <input
                    ref={modalToggleRef}
                    type="checkbox"
                    id="my-modal-4"
                    className="
          modal-toggle
          "
                />

                <motion.div className="toe-code-modal modal z-40">
                    <div className="toe-code-modal__panel modal-box relative flex flex-col items-center justify-start gap-1 overflow-y-auto bg-white px-2">
                        <label
                            htmlFor="my-modal-4"
                            aria-label="Cancel toe-clip code entry"
                            className="toe-code-modal__close absolute right-2 top-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-asu-maroon bg-white text-xl font-semibold leading-none text-asu-maroon active:scale-90"
                            onClick={cancelToeCodeEntry}
                        >
                            X
                        </label>
                        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-1">
                            <div
                                role="status"
                                aria-live="polite"
                                className={`toe-code-modal__status order-1 flex w-full max-w-xs items-center justify-center rounded-lg border px-2 py-1 text-center text-sm leading-tight ${statusClassName}`}
                            >
                                {statusMessage}
                            </div>
                            <div className="order-3 w-full max-w-xs">
                                <div className="toe-code-modal__code-row grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                                    <div className="flex min-w-0 flex-col items-center text-center">
                                        <p className="text-xs leading-none text-black/60">
                                            Current toe-clip code
                                        </p>
                                        <p className="mt-2 min-w-0 break-words text-xl leading-tight">
                                            {formattedToeCodes}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isRecapture}
                                        onClick={() => generateNewToeCode()}
                                        className="toe-code-modal__compact-control rounded-lg bg-asu-maroon px-3 text-sm font-semibold leading-tight text-asu-gold transition active:scale-90 active:brightness-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
                                    >
                                        Suggest Code
                                    </button>
                                </div>
                            </div>
                            <div className="toe-code-modal__image-region order-2 flex min-h-0 w-full max-w-xs flex-1 flex-col items-center">
                                <img
                                    src="./toe-code-diagram.svg"
                                    alt="Diagram showing a lizard with feed labeled A-D and toes labeled 1-5."
                                    className="toe-code-modal__image min-h-0 w-full flex-1 object-contain"
                                />
                            </div>
                        </div>
                        <div className="flex w-full flex-none flex-col items-center justify-center gap-1">
                            <div className="mt-1 grid w-full max-w-xs grid-cols-[1fr_auto] gap-2">
                                <button
                                    type="button"
                                    aria-pressed={isRecapture}
                                    onClick={() => setIsRecapture(!isRecapture)}
                                    className={`toe-code-modal__standard-control flex min-w-0 items-center justify-between gap-2 rounded-lg border-2 border-asu-maroon px-3 text-left text-asu-maroon transition active:scale-[0.98] ${
                                        isRecapture
                                            ? 'bg-asu-maroon/10'
                                            : 'bg-white hover:bg-asu-maroon/5'
                                    }`}
                                >
                                    <span className="whitespace-nowrap text-sm leading-tight">
                                        Capture type
                                    </span>
                                    <span
                                        className={`rounded px-2 py-1 text-sm font-semibold leading-tight ${
                                            isRecapture ? 'bg-white shadow-sm' : 'bg-asu-maroon/10'
                                        }`}
                                    >
                                        {isRecapture ? 'Recapture' : 'New'}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    disabled={!isRecapture || !isValid}
                                    onClick={() => findPreviousLizardEntries()}
                                    className="toe-code-modal__standard-control w-24 rounded-lg border-2 border-asu-maroon bg-white px-2 text-sm leading-tight text-asu-maroon transition active:scale-90 active:brightness-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
                                >
                                    {historyButtonText}
                                </button>
                            </div>
                            <div className="mt-2 grid w-full max-w-xs grid-cols-5 items-center gap-1">
                                {footOptions.map((letter) => (
                                    <Button
                                        key={letter}
                                        prompt={letter}
                                        handler={() => handleClick(letter)}
                                        isSelected={selected[letter]}
                                    />
                                ))}
                                <button
                                    type="button"
                                    aria-label="Delete last toe-code character"
                                    className="toe-code-modal__key w-full rounded-xl bg-asu-maroon text-2xl text-asu-gold brightness-100 transition active:scale-90 active:brightness-50"
                                    onClick={() => handleClick('backspace')}
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="mx-auto h-8 w-8"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.75"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                                        <path d="m18 9-6 6" />
                                        <path d="m12 9 6 6" />
                                    </svg>
                                </button>
                            </div>
                            <div className="grid w-full max-w-xs grid-cols-5 items-center gap-1">
                                {toeOptions.map((number) => (
                                    <Button
                                        key={number}
                                        prompt={number}
                                        handler={() => handleClick(number)}
                                        isSelected={selected[number]}
                                    />
                                ))}
                            </div>
                            <div className="mt-1 w-full max-w-xs">
                                <button
                                    type="button"
                                    disabled={!isValid}
                                    onClick={saveToeCodeEntry}
                                    className={`toe-code-modal__standard-control w-full rounded-xl px-2 text-xl capitalize text-asu-gold transition active:scale-90 active:brightness-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${
                                        hasUnusualPattern && confirmUnusual
                                            ? 'bg-amber-900'
                                            : 'bg-asu-maroon'
                                    }`}
                                >
                                    {hasUnusualPattern && confirmUnusual
                                        ? 'Confirm unusual code'
                                        : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

const Comments = ({ commentText }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <motion.div className="" onClick={() => setIsExpanded(!isExpanded)}>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            y: '-100%',
                        }}
                        exit={{
                            opacity: 0,
                            y: '-50%',
                            transition: {
                                y: {
                                    duration: 0.3,
                                },
                                opacity: {
                                    duration: 0.2,
                                },
                            },
                        }}
                        className="absolute border-2 border-asu-maroon z-10 bg-white rounded-sm p-1"
                    >
                        <p>{commentText}</p>
                    </motion.div>
                )}
            </AnimatePresence>
            <p>{commentText.length > 5 ? `${commentText.slice(0, 5)}...` : commentText}</p>
        </motion.div>
    );
};

const PortraitTable = ({
    recaptureHistoryVariant,
    currentData,
    speciesCode,
    toeCode,
    lizardHistoryLabelArray,
    previousLizardEntries,
    setRecaptureHistoryIsOpen,
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
                    <p className="text-sm text-black/75 italic leading-none">Site</p>
                    <motion.div className="w-full bg-black h-[1px]" />
                    <p className="text-md text-black font-semibold leading-tight">
                        {currentData.site}
                    </p>
                </motion.div>
                <motion.div className="flex w-20 flex-col items-center">
                    <p className="text-sm text-black/75 italic leading-none">Species</p>
                    <motion.div className="w-full bg-black h-[1px]" />
                    <p className="text-md text-black font-semibold leading-tight">
                        {speciesCode ?? 'N/A'}
                    </p>
                </motion.div>
                <motion.div className="flex w-28 flex-col items-center">
                    <p className="text-sm text-black/75 italic leading-none">Toe Clip Code</p>
                    <motion.div className="w-full bg-black h-[1px]" />
                    <p className="text-md text-black font-semibold leading-tight">{toeCode}</p>
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
                            {lizardHistoryLabelArray.map((item, labelIndex, array) => {
                                let key = '';
                                if (item === 'Date') key = 'dateTime';
                                if (item === 'Mass') key = 'massG';
                                if (item === 'SVL') key = 'svlMm';
                                if (item === 'OTL') key = 'otlMm';
                                if (item === 'VTL') key = 'vtlMm';
                                if (item === 'Recapture') key = 'recapture';
                                if (item === 'Dead') key = 'dead';
                                if (item === 'Hatchling') key = 'hatchling';
                                if (item === 'Regen Tail') key = 'regenTail';
                                if (item === 'Array') key = 'array';
                                if (item === 'Sex') key = 'sex';
                                if (item === 'Comments') key = 'comments';
                                let tdArray = [];
                                for (let i = 0; i < previousLizardEntries.length; i++) {
                                    let itemToDisplay = '';
                                    if (key === 'dateTime') {
                                        const date = new Date(
                                            previousLizardEntries[i][key]
                                        ).toLocaleDateString();
                                        itemToDisplay = date;
                                    } else {
                                        itemToDisplay = previousLizardEntries[i][key] ?? 'N/A';
                                        if (itemToDisplay === 'false') itemToDisplay = 'No';
                                        if (itemToDisplay === 'true') itemToDisplay = 'Yes';
                                    }

                                    if (item === 'Comments') {
                                        itemToDisplay = (
                                            <Comments
                                                commentText={previousLizardEntries[i][key] ?? 'N/A'}
                                            />
                                        );
                                    }

                                    if (i < previousLizardEntries.length - 1) {
                                        tdArray.push(
                                            <td
                                                key={`${itemToDisplay}${i}`}
                                                className={`${
                                                    labelIndex < array.length - 1
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
                                                    labelIndex < array.length - 1
                                                        ? 'border-b border-black'
                                                        : 'border-black'
                                                }`}
                                            >
                                                {itemToDisplay}
                                            </td>
                                        );
                                    }
                                }
                                return <tr key={`${labelIndex}label`}>{tdArray}</tr>;
                            })}
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
    );
};

const LandscapeTable = ({
    currentData,
    speciesCode,
    toeCode,
    lizardHistoryLabelArray,
    previousLizardEntries,
    lizardHistoryLabelKeys,
    setRecaptureHistoryIsOpen,
}) => (
    <motion.div className="absolute h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] shadow-2xl top-0 left-0 bg-white border-2 border-asu-maroon rounded-2xl m-5 p-1 flex flex-col items-center portrait:hidden">
        <h1 className="text-3xl">Recapture History</h1>

        <motion.div className="flex items-center space-x-2 justify-center w-full border-black border-0 justify-items-center max-w-md">
            <motion.div className="flex w-16 flex-col items-center">
                <p className="text-sm text-black/75 italic leading-none">Site</p>
                <motion.div className="w-full bg-black h-[1px]" />
                <p className="text-md text-black font-semibold leading-tight">{currentData.site}</p>
            </motion.div>
            <motion.div className="flex w-20 flex-col items-center">
                <p className="text-sm text-black/75 italic leading-none">Species</p>
                <motion.div className="w-full bg-black h-[1px]" />
                <p className="text-md text-black font-semibold leading-tight">
                    {speciesCode ?? 'N/A'}
                </p>
            </motion.div>
            <motion.div className="flex w-28 flex-col items-center">
                <p className="text-sm text-black/75 italic leading-none">Toe Clip Code</p>
                <motion.div className="w-full bg-black h-[1px]" />
                <p className="text-md text-black font-semibold leading-tight">{toeCode}</p>
            </motion.div>
        </motion.div>

        <motion.div className="border-2 border-black w-full h-full mb-2 rounded-xl shadow-lg overflow-y-auto">
            <table className="text-center text-sm w-full table-auto border-collapse">
                <thead>
                    <tr>
                        {lizardHistoryLabelArray.map((label, index, array) => (
                            <td
                                key={label}
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
                    {previousLizardEntries.map((entry, index, array) => {
                        return (
                            <tr key={index}>
                                {lizardHistoryLabelKeys.map((key, index, array) => {
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
                                            key={`${itemToDisplay}${index}`}
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
                        );
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
);

function Button({ prompt, handler, isSelected }) {
    return (
        <button
            className={
                isSelected
                    ? `toe-code-modal__key w-full rounded-xl bg-asu-maroon text-2xl capitalize text-asu-gold brightness-50 transition active:scale-90 active:brightness-50`
                    : `toe-code-modal__key w-full rounded-xl bg-asu-maroon text-2xl capitalize text-asu-gold brightness-100 transition active:scale-90 active:brightness-50`
            }
            onClick={handler}
        >
            {prompt}
        </button>
    );
}
