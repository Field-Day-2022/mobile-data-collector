import axios from 'axios';
import {addSession} from '../../indexeddb/DbNewSessionHandler.js';
import {addDataEntry} from '../../indexeddb/DbNewDataEntryHandler.js';
import {UPDATE_SITE} from "./location-actions";
import * as CONSTANTS from "../../constants";

export const CREATE_SESSION = 'CREATE_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';
export const GET_ALL_SESSIONS = 'GET_ALL_SESSIONS';
export const CLOSE_SESSION = 'CLOSE_SESSION';
export const END_CURRENT_SESSION = 'END_CURRENT_SESSION';
export const UPDATE_ERROR_STATE = 'UPDATE_ERROR_STATE';
export const CLEAR_CURRENT_SESSION_STATE = 'CLEAR_CURRENT_SESSION_STATE';
export const CREATE_CURRENT_SLICE = 'CREATE_CURRENT_SLICE';
export const UPDATE_CURRENT_FORM = 'UPDATE_CURRENT_FORM';
export const CLEAR_CURRENT_SLICE = 'CLEAR_CURRENT_SLICE';
export const CLEAR_SAVED_SESSIONS = 'CLEAR_SAVED_SESSIONS';
export const POP_LAST_ENTRY_POPULATE_CURRENT_SESSION = 'POP_LAST_ENTRY_POPULATE_CURRENT_SESSION';
export const CLEAR_CURRENT_AND_ERROR = 'CLEAR_CURRENT_AND_ERROR';

export const createCurrentSliceAndErrorStates = (questionState, errorState) => {
    return dispatch => Promise.resolve(
        dispatch({
            type: CREATE_CURRENT_SLICE,
            payload: questionState
        })
    ).then(
        () => {
            dispatch({
                type: UPDATE_ERROR_STATE,
                payload: errorState
            })
        }
    );
}

export const resetForm = () => {
    return dispatch => Promise.resolve(
        dispatch({
            type: POP_LAST_ENTRY_POPULATE_CURRENT_SESSION
        })
    );
}

export const updateSiteAC = site => {
    return dispatch => Promise.resolve(
        dispatch({
            type: UPDATE_SITE,
            payload: site
        })
    ).then(
        () => {
            dispatch({
                type: UPDATE_CURRENT_FORM,
                payload: {
                    Site: site
                }
            })
        }
    );
}

export const closeSession = (dataEntries, trapStatus) => {
    return (dispatch, getState) => Promise.resolve(
        dispatch({
            type: CLOSE_SESSION,
            payload: {
                dataEntries,
                trapStatus
            }
        })
    ).then(() => {
        dispatch(endSession(getState().Session_Info.data_entries));
    })
}

export const getSessions = () => async (dispatch) => {
    await axios.get('https://ewmkzy8xka.execute-api.us-west-1.amazonaws.com/dev/session')
        .then(res => {
                dispatch({
                    type: GET_ALL_SESSIONS,
                    payload: res.data
                })
            }
        )
}

// Function Updated By Brent on 4/6/2021
// May require more fixin!
export const endSession = (dataEntries) => async (dispatch) => {
    let parsedSessionData = {};
    let formatedSessionData = {};

    let date = (Date.now() / 1000).toFixed();
    date = parseInt(date);

    // (WARNING) TODO:
    // We are currently saving the session information as the first data entry.
    // This is functional but extremely impractical and should be refactored!
    try {
        // Parse Session Data!
        parsedSessionData = dataEntries.find(entry => entry.form === CONSTANTS.SESSION);

        // Format Data for Index DB
        formatedSessionData = formatSessionData(parsedSessionData.data)

    } catch (err) {
        console.error('Cannot find the Session object in the Data Entries Array.')
    }

    // Remove the Session object from the data entries Redux Slice
    const sessionObjRemoved = dataEntries.filter(entry => entry.form !== CONSTANTS.SESSION);
    // Loop through all of the other data entries for the current session
    sessionObjRemoved.forEach(entry => {
        const filteredData = (dataObj) => {
            const keys = Object.keys(dataObj);
            return keys.filter(el => (
                el !== CONSTANTS.PROJECT_ID
                && el !== CONSTANTS.FORM_ID
                && el !== CONSTANTS.DATE_MODIFIED
                && el !== CONSTANTS.DATE_CREATED)
            ).reduce((acc, el) => {
                return ({
                    ...acc,
                    [el]: dataObj[el]
                });
            }, {});
        };

        let dataEntryObject = {
            session_id: parseInt(formatedSessionData.session_id),
            form_id: entry.data.form_id,
            date_modified: parseInt(entry.data.date_modified),
            entry_id: date,
            project_id: parseInt(formatedSessionData.project_id),
            entry_json: filteredData(entry.data)
        }

        date = date + 1 // TODO: Silly placeholder until we figure out the entry_id generation
        // Add Data entry to Index DB!
        addDataEntry(dataEntryObject, dataEntryObject.entry_id);
    })
    // Add Session to Index DB!
    await addSession(formatedSessionData, formatedSessionData.session_id)
    dispatch({
        type: END_CURRENT_SESSION
    })

}


///////////////////////////////////////////////////////
///////////////// HELPER FUNCTIONS ////////////////////
///////////////////////////////////////////////////////

const filterSessionJsonData = (dataObj) => {
    const keys = Object.keys(dataObj);

    return keys.filter(el => (
        el !== CONSTANTS.PROJECT_ID
        && el !== CONSTANTS.FORM_ID
        && el !== CONSTANTS.DATE_MODIFIED
        && el !== CONSTANTS.DATE_CREATED
        && el !== CONSTANTS.SESSION_ID)
    ).reduce((acc, el) => {
        return ({
            ...acc,
            [el]: dataObj[el]
        });
    }, {});
};

const formatSessionData = (sessionDataObj) => {
    let formatedSessionData = {}
    formatedSessionData.session_id = Number(sessionDataObj.session_id);
    formatedSessionData.project_id = Number(sessionDataObj.project_id);
    formatedSessionData.date_created = Number(sessionDataObj.date_created);
    formatedSessionData.date_modified = Number(sessionDataObj.date_modified);
    formatedSessionData.form_id = Number(sessionDataObj.form_id)
    formatedSessionData.session_json = filterSessionJsonData(sessionDataObj)
    return formatedSessionData
}
