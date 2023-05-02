import { collection, getDocsFromCache, where, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../index';

import { useAtom } from 'jotai';
import { currentFormName, currentSessionData, notificationText } from '../utils/jotai';
import TextInput from '../components/TextInput';
import { error } from 'daisyui/src/colors/colorNames';
import { getStandardizedDateTimeString } from '../utils/functions';

export default function NewData() {
    const [currentProject, setCurrentProject] = useState('Project');
    const [currentSite, setCurrentSite] = useState('Site');
    const [currentArray, setCurrentArray] = useState('Array');
    const [recorder, setRecorder] = useState('');
    const [handler, setHandler] = useState('');
    const [errors, setErrors] = useState({
        recorder: '',
        handler: '',
    });
    const [sites, setSites] = useState();
    const [arrays, setArrays] = useState();

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);
    const [notification, setNotification] = useAtom(notificationText);

    useEffect(() => {
        setCurrentData({
            captureStatus: '',
            array: '',
            project: '',
            site: '',
            handler: '',
            recorder: '',
            arthropod: [],
            amphibian: [],
            lizard: [],
            mammal: [],
            snake: [],
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getSites = async (projectName) => {
        if (projectName !== currentProject) setCurrentSite('Site');
        let sitesSnapshot = null;
        if (projectName === 'Gateway') {
            sitesSnapshot = await getDocsFromCache(
                query(collection(db, 'AnswerSet'), where('set_name', '==', 'GatewaySites'))
            );
        } else if (projectName === 'San Pedro') {
            sitesSnapshot = await getDocsFromCache(
                query(collection(db, 'AnswerSet'), where('set_name', '==', 'San PedroSites'))
            );
        } else if (projectName === 'Virgin River') {
            sitesSnapshot = await getDocsFromCache(
                query(collection(db, 'AnswerSet'), where('set_name', '==', 'Virgin RiverSites'))
            );
        }
        if (sitesSnapshot) {
            let tempSites = [];
            for (const site of sitesSnapshot.docs[0].data().answers) {
                tempSites.push(site.primary);
            }
            setSites(tempSites);
        }
    };

    const getArrays = async (projectName, siteName) => {
        if (projectName !== currentProject || siteName !== currentSite) setCurrentArray('Array');
        let arraysSnapshot = null;
        const set_name = `${projectName}${siteName}Array`;
        arraysSnapshot = await getDocsFromCache(
            query(collection(db, 'AnswerSet'), where('set_name', '==', set_name))
        );
        if (arraysSnapshot.docs[0]) {
            let tempArrays = [];
            for (const array of arraysSnapshot.docs[0].data().answers) {
                tempArrays.push(array.primary);
            }
            setArrays(tempArrays);
        }
    };

    const finishForm = (captureStatus) => {
        let tempErrors = {
            recorder: '',
            handler: '',
        };
        if (handler.length < 2) tempErrors.handler = 'Must be 2-3 letters';
        if (recorder.length < 2) tempErrors.recorder = 'Must be 2-3 letters';
        let errorExists = false;
        for (const key in tempErrors) {
            if (tempErrors[key] !== '') errorExists = true;
        }
        if (errorExists) {
            console.log(handler.length)
            console.log(tempErrors)
            setErrors(tempErrors);
            setNotification('Errors present');
            return;
        } else {
            setErrors(tempErrors);
        }

        if (captureStatus === 'withCaptures') {
            setCurrentData({
                arthropod: [],
                amphibian: [],
                lizard: [],
                mammal: [],
                snake: [],
                recorder,
                handler,
                project: currentProject,
                site: currentSite,
                array: currentArray,
                captureStatus: 'withCaptures',
<<<<<<< HEAD
                sessionDateTime: getStandardizedDateTimeString(new Date()),
=======
                sessionEpochTime: date.getTime(),
>>>>>>> main
            });
            setCurrentForm('New Data Entry');
        } else if (captureStatus === 'withoutCaptures') {
            setCurrentData({
                arthropod: [],
                amphibian: [],
                lizard: [],
                mammal: [],
                snake: [],
                recorder,
                handler,
                project: currentProject,
                site: currentSite,
                array: currentArray,
                captureStatus: 'withoutCaptures',
<<<<<<< HEAD
                sessionDateTime: getStandardizedDateTimeString(new Date())
=======
                sessionEpochTime: date.getTime(),
>>>>>>> main
            });
            setCurrentForm('Finish Session');
        }
    };

    return (
        <div
            id="wrapper"
            className="
      text-center 
      form-control 
      items-center 
      justify-start 
      overflow-x-hidden 
      overflow-y-auto
      scrollbar-thin 
      scrollbar-thumb-asu-maroon 
      scrollbar-thumb-rounded-full 
      rounded-lg 
      w-full 
      h-full"
        >
            <TextInput
                maxLength={3}
                prompt="Recorder"
                placeholder="Initials"
                value={recorder}
                onChangeHandler={(val) => {
                    if (/^[A-Za-z]+$/.test(val) || val === '') {
                        setRecorder(val.toUpperCase());
                    }
                }}
                error={errors.recorder}
            />
            <TextInput
                maxLength={3}
                prompt="Handler"
                placeholder="Initials"
                value={handler}
                onChangeHandler={(val) => {
                    if (/^[A-Za-z]+$/.test(val) || val === '') {
                        setHandler(val.toUpperCase());
                    }
                }}
                error={errors.handler}
            />
            <div className="dropdown flex justify-center items-center">
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
          menu 
          p-2 
          shadow 
          bg-white
          rounded-box 
          w-48
          text-asu-maroon
          "
                >
                    <li
                        onClick={() => {
                            if (currentProject !== 'Gateway') {
                                setArrays(null);
                                setCurrentArray('Array');
                            }
                            setCurrentProject('Gateway');
                            getSites('Gateway');
                            document.activeElement.blur();
                        }}
                        className="border-b-2 border-black/25"
                    >
                        <a className="flex justify-center text-xl">Gateway</a>
                    </li>
                    <li
                        onClick={() => {
                            if (currentProject !== 'San Pedro') {
                                setArrays(null);
                                setCurrentArray('Array');
                            }
                            setCurrentProject('San Pedro');
                            getSites('San Pedro');
                            document.activeElement.blur();
                        }}
                        className="border-b-2 border-black/25"
                    >
                        <a className="flex justify-center text-xl">San Pedro</a>
                    </li>
                    <li
                        onClick={() => {
                            if (currentProject !== 'Virgin River') {
                                setArrays(null);
                                setCurrentArray('Array');
                            }
                            setCurrentProject('Virgin River');
                            getSites('Virgin River');
                            document.activeElement.blur();
                        }}
                    >
                        <a className="flex justify-center text-xl">Virgin River</a>
                    </li>
                </ul>
            </div>
                <div
                    className="
          dropdown
          flex
          justify-center
          "
                >
                    <label
                        tabIndex={0}
                        className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
                    >
                        {currentSite !== 'Site' ? `Site ${currentSite}` : currentSite}
                    </label>
                    {sites && 
                    <ul
                        tabIndex={0}
                        className="
            dropdown-content 
            -bottom-[25%]
            pl-2
            pr-2
            shadow 
            bg-white
            overflow-y-auto
            max-h-72
            text-asu-maroon 
            rounded-box
            w-36
            "
                    >
                        {sites.map((site, index) => (
                            <li
                                onClick={() => {
                                    setCurrentSite(site);
                                    getArrays(currentProject, site);
                                    document.activeElement.blur();
                                }}
                                className={
                                    index < sites.length - 1 ? 'border-b-2 border-black/50' : ''
                                }
                                key={site}
                            >
                                <a className="flex flex-col justify-center text-xl p-2">{site}</a>
                            </li>
                        ))}
                    </ul>
                    }
                </div>
                <div className="dropdown flex justify-center">
                    <label
                        tabIndex={0}
                        className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
                    >
                        {currentArray !== 'Array' ? `Array ${currentArray}` : currentArray}
                    </label>
                {arrays && 
                    <ul
                        tabIndex={0}
                        className="
            dropdown-content 
            menu 
            -bottom-[25%]
            p-2 
            shadow 
            bg-white
            text-asu-maroon
            rounded-box 
            w-28"
                    >
                        {arrays.map((array, index) => (
                            <li
                                onClick={() => {
                                    setCurrentArray(array);
                                    document.activeElement.blur();
                                }}
                                className={
                                    index < arrays.length - 1 ? 'border-b-2 border-black/50' : ''
                                }
                                key={array}
                            >
                                <a className="flex justify-center text-xl">{array}</a>
                            </li>
                        ))}
                    </ul>
                    }
                </div>
                <div className="flex flex-col justify-center items-center border-black border-0">
                    <p className="text-xl mb-1 text-asu-maroon font-semibold">Any captures?</p>
                    <div className="flex">
                        <button
                            onClick={() => currentArray !== 'Array' && finishForm('withCaptures')}
                            className="btn w-28 mr-2 glass text-asu-maroon text-xl capitalize"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => currentArray !== 'Array' && finishForm('withoutCaptures')}
                            className="btn w-28 glass text-asu-maroon text-xl capitalize"
                        >
                            No
                        </button>
                    </div>
                </div>
        </div>
    );
}
