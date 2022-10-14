import React, {useEffect, useState, memo} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Button, Container, Table, Spinner} from "react-bootstrap";
import UnsyncedModal from "../../components/un-synced-modal/un-synced-modal";
import DBConfig from "../../indexeddb/DBConfig";
import {getAllNewDataEntries} from "../../indexeddb/DbNewDataEntryHandler";
import * as ACTIONS from '../../redux/actions/session-actions';
import './un-sync-history.css';
import db from "../../indexeddb/Db";
import { UPDATE_NEW_TOE_CLIP_CODE} from "../../redux/actions/toe-clip-code-actions";
import * as CONSTANTS from "../../constants";

const UnsyncHistory = (props) => {
    const dispatch = useDispatch();

    // Redux
    const data = useSelector(state => state.Session_Info.savedSessions);
    const location = useSelector(state => state.Location_Info.location);
    const site = useSelector(state => state.Location_Info.site);
    const sessionData = useSelector(state => state.Session_Info);
    const dataForms = useSelector(state => state.Database.data_form);

    // Local State
    const [newDataArr, updateNewDataArr] = useState([]);
    const [modalShowing, setModalShowing] = useState(false);
    const [selectedSession, setSelectedSession] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionInfo, setSessionInfo] = useState([]);
    const [sessions, setSessions] = useState({})

    const hideModal = () => setModalShowing(false);
    const displaySessionLabels = data => {
        const getAnimalName = formID => dataForms.find(form => form.form_id === formID).form_name;
        return `Location: ${location}
            Site: ${sessions[data.session_id]}
            Animal: ${getAnimalName(data.form_id)}`
    };

    const displaySession = data => {
        const dateUTC = data[0].data.date_modified;
        const date = new Date(dateUTC * 1000)
        const dateString = date.toDateString();
        return `Date: ${dateString}
            Site: ${sessions[data[0].data.session_id]}
            No Captures: ${data[0].data["No Captures"]}`
    };

    useEffect(() => {
        getAllNewDataEntries().then(data => updateNewDataArr(newDataArr.concat(data)));
        let sessionsObj = {}
        setSessionInfo(sessionData.savedSessions.filter((sessionInfo) => {
                if (sessionInfo[0].form === "Session") {
                    let sessionID = sessionInfo[0].data.session_id;
                    sessionsObj[sessionID] = sessionInfo[0].data.Site;
                    return sessionInfo[0].data
                }
            })
        )
        setSessions(sessionsObj);
    }, []);

    async function handleUploadData(e) {
        e.preventDefault();
        setIsLoading(true);
        let newDataEntries = await db.new_data_entry.toArray()
        // For all new data entries about to sync, find the lizards and update their redux values
        // Updating entry ids for future lizard capture history lookups
        data.forEach((dataEntries) => {
            let currentSessionID = dataEntries[0].data.session_id;
            dataEntries.forEach((dataInfo) => {
                if (dataInfo.form === "Lizard") {
                    newDataEntries.forEach((dataEntryInfo) => {
                        if (dataEntryInfo.session_id.toString() === currentSessionID.toString()) {
                            let entry_id = dataEntryInfo.entry_id;
                            let toeClipCode = dataInfo.data["Toe-clip Code"];
                            let speciesCode = dataInfo.data["Species Code"];
                            let site = dataEntries[0].data.Site;
                            dispatch({
                                type: UPDATE_NEW_TOE_CLIP_CODE,
                                payload: {
                                    site: site,
                                    species: speciesCode,
                                    toeClipCode: toeClipCode,
                                    entry_id: entry_id
                                }
                            })
                        }
                    })
                }
            })
        })
        DBConfig.uploadNewEntries(data)
            .then(() => DBConfig.uploadNewEntries())
            .then(() => DBConfig.uploadNewEntries(sessionData))
            .then(() => setIsLoading(false))
            .then(() => {
                setSessionInfo([])
                updateNewDataArr([]
                )
            })
            .then(() => dispatch({
                type: ACTIONS.CLEAR_SAVED_SESSIONS
            }));
    }

    return (
        <div className='home-page-backing'>
            <div className="header">
                <h1>
                    <span className='spacer'>Un-Sync'ed Data</span>
                </h1>
            </div>
            <div className='center-column'>
                <Container
                    fluid
                >
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Number</th>
                            <th>Session Id</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            newDataArr.map((data, index) => {
                                return (
                                    <tr
                                        key={data.session_id}
                                    >
                                        <td>{index + 1}</td>
                                        <td>
                                            <a
                                                href={'#'}
                                                className='unsync-table-row'
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setModalShowing(true);
                                                    setSelectedSession(data);
                                                }}
                                            >
                                                {displaySessionLabels(data)}
                                            </a>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        {
                            sessionInfo.map((data) => {
                                return (
                                    <tr
                                        key={data[0].data.session_id}
                                    >
                                        <td>Session ID: {data[0].data.session_id}</td>
                                        <td>
                                            {displaySession(data)}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                    <div className='button-container'>
                        <Button
                            className='next-button'
                            onClick={e => handleUploadData(e)}
                            disabled={isLoading}
                        >
                            {
                                isLoading &&
                                <Spinner
                                    id='uploadSpinner'
                                    animation="border"
                                    role="status"
                                    size='lg'
                                    variant='light'
                                >
                                    <span className='sr-only'>Sending Data...</span>
                                </Spinner>
                            }
                            Upload New Data
                        </Button>
                        <Button
                            className='next-button'
                            onClick={e => {
                                e.preventDefault();
                                props.history.push('/');
                            }}
                        >
                            Return Home
                        </Button>
                    </div>
                </Container>
            </div>
            <UnsyncedModal
                show={modalShowing}
                onHide={hideModal}
                dataHistoryObject={selectedSession}
            />
        </div>
    );
}

export default memo(UnsyncHistory);
