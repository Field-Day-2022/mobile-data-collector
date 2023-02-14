import { collection, getDocsFromCache, where, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../index';

import { useAtom } from 'jotai';
import { currentFormName, currentSessionData } from '../utils/jotai';
import TextInput from '../components/TextInput';

export default function NewData() {
    const [currentProject, setCurrentProject] = useState('Project');
    const [currentSite, setCurrentSite] = useState('Site');
    const [currentArray, setCurrentArray] = useState('Array');
    const [recorder, setRecorder] = useState('');
    const [handler, setHandler] = useState('');

    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);

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
    }, []);

    const [sites, setSites] = useState();
    const [arrays, setArrays] = useState();

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
        const date = new Date();
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
                sessionDateTime: date.toUTCString(),
            });
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
                sessionDateTime: date.toUTCString(),
            });
        }
        setCurrentForm('New Data Entry');
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
            {/* <label className="input-group input-group-vertical justify-center m-1 w-28">
                <span className="bg-white/50 border-2 border-gray-500 text-xl text-asu-maroon justify-center">
                    Recorder
                </span>
                <input
                    maxLength="3"
                    type="text"
                    placeholder="Initials"
                    className="text-center input glass text-xl text-asu-maroon placeholder:text-black/50 tracking-widest placeholder:tracking-wide"
                    value={recorder}
                    onChange={(e) => {
                        if (/^[A-Za-z]+$/.test(e.target.value) || e.target.value === '') {
                            setRecorder(e.target.value.toUpperCase());
                        }
                    }}
                />
            </label> */}
            <TextInput 
                maxLength={3}
                prompt="Recorder"
                placeholder="Initials"
                value={recorder}
                onChangeHandler={val => {
                    if ((/^[A-Za-z]+$/.test(val) || val === '' )) {
                        setRecorder(val.toUpperCase());
                    }
                }}
            />
            <TextInput 
                maxLength={3}
                prompt="Handler"
                placeholder="Initials"
                value={handler}
                onChangeHandler={val => {
                    if ((/^[A-Za-z]+$/.test(val) || val === '' )) {
                        setHandler(val.toUpperCase());
                    }
                }}
            />
            {/* <label className="input-group input-group-vertical justify-center m-1 w-28">
                <span className="glass text-xl text-asu-maroon justify-center">Handler</span>
                <input
                    maxLength="3"
                    type="text"
                    placeholder="Initials"
                    className="text-center input glass text-xl text-asu-maroon placeholder:text-black/50 tracking-widest placeholder:tracking-wide w-full"
                    value={handler}
                    onChange={(e) => {
                        if (/^[A-Za-z]+$/.test(e.target.value) || e.target.value === '') {
                            setHandler(e.target.value.toUpperCase());
                        }
                    }}
                />
            </label> */}
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
          bg-gradient-radial
          from-white
          to-white/75
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
            {sites && (
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
                    <ul
                        tabIndex={0}
                        className="
            dropdown-content 
            -bottom-[25%]
            pl-2
            pr-2
            shadow 
            bg-gradient-radial
            from-white
            to-white/75
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
                </div>
            )}
            {arrays && (
                <div className="dropdown flex justify-center">
                    <label
                        tabIndex={0}
                        className="btn glass m-1 text-asu-maroon text-xl capitalize font-medium"
                    >
                        {currentArray !== 'Array' ? `Array ${currentArray}` : currentArray}
                    </label>
                    <ul
                        tabIndex={0}
                        className="
            dropdown-content 
            menu 
            -bottom-[25%]
            p-2 
            shadow 
            bg-gradient-radial
            from-white
            to-white/75
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
                </div>
            )}
            {currentArray !== 'Array' && (
                <div className="flex flex-col justify-center items-center border-black border-0">
                    <p className="text-xl mb-1 text-asu-maroon font-semibold">Any captures?</p>
                    <div className="flex">
                        <button
                            onClick={() => finishForm('withCaptures')}
                            className="btn w-28 mr-2 glass text-asu-maroon text-xl capitalize"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => finishForm('withoutCaptures')}
                            className="btn w-28 glass text-asu-maroon text-xl capitalize"
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
