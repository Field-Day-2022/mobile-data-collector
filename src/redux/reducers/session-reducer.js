import * as actionTypes from '../actions/session-actions';
import * as CONSTANTS from '../../constants';

const initialState = {
    savedSessions: [],
    data_entries: [],
    currentSession: {},
    currentErrorState: {}
}

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CLEAR_SAVED_SESSIONS:
            return {
                ...state,
                savedSessions: []
            }
        case actionTypes.POP_LAST_ENTRY_POPULATE_CURRENT_SESSION:
            const currentDataEntries = [...state.data_entries];

            // Take the last data entry that will populate the
            // the Session_Info.CurrentSession slice
            let updateCurrentSession = {
                ...currentDataEntries[currentDataEntries.length - 1]
            };

            // Remove the last element in the data entries and
            // store it updatedDataEntries local variable
            const updatedDataEntries = currentDataEntries.filter((entry, index) => index <= currentDataEntries.length - 2);

            return {
                ...state,
                data_entries: updatedDataEntries,
                currentSession: updateCurrentSession
            }
        case actionTypes.UPDATE_SESSION:
            return {
                ...state,
                data_entries: state.data_entries.concat({...action.payload})
            }
        case actionTypes.CREATE_SESSION:
            return {
                ...state,
                currentSession: {...state.currentSession, ...action.payload}
            }
        case actionTypes.GET_ALL_SESSIONS:
            return {
                ...state,
                savedSessions: state.savedSessions.concat(action.payload)
            }
        case actionTypes.END_CURRENT_SESSION:
            const dataEntriesCopy = [...state.data_entries];
            return {
                ...state,
                savedSessions: [...state.savedSessions, dataEntriesCopy],
                currentSession: {},
                data_entries: []
            }
        case actionTypes.UPDATE_ERROR_STATE :
            return {
                ...state,
                currentErrorState: {...state.currentErrorState, ...action.payload}
            };
        case actionTypes.CLEAR_CURRENT_SESSION_STATE :
            return {
                ...state,
                //currentSession: {},
                currentErrorState: {}
            }
        case actionTypes.CREATE_CURRENT_SLICE:
            return {
                ...state,
                currentSession: {...action.payload}
            }
        case actionTypes.UPDATE_CURRENT_FORM:
            return {
                ...state,
                currentSession: {
                    ...state.currentSession,
                    data: {
                        ...state.currentSession.data,
                        ...action.payload
                    }
                }
            }
        case actionTypes.CLOSE_SESSION:
            // Get the Session Object
            const sessionObj = action.payload.dataEntries.find(ent => ent.form === CONSTANTS.SESSION);

            // Filter the Data Entries to remove the Session Object
            const removeSessionFromDataEntry = action.payload.dataEntries.filter(ent => ent.form !== CONSTANTS.SESSION);

            // Create a new Session Object with updated Trap Status
            const updatedSession = {
                form: CONSTANTS.SESSION,
                data: {
                    ...sessionObj.data,
                    ...action.payload.trapStatus.data
                }
            }

            // Merge the Session Object back in with the Data Entries
            const joined = [updatedSession, ...removeSessionFromDataEntry];

            return {
                ...state,
                data_entries: joined
            };
        case actionTypes.CLEAR_CURRENT_SLICE:
            return state;
        case actionTypes.CLEAR_CURRENT_AND_ERROR:
            return {
                ...state,
                currentSession: {
                    ...state.currentSession,
                    data: {
                        ...state.currentSession.data,
                        ...action.payload
                    }
                },
                currentErrorState: {
                    ...state.currentErrorState,
                    data: {}
                }
            }
        default:
            return state;
    }
};

export default sessionReducer;