import * as ACTIONS from '../actions/indexedDB-actions';

const initialState = {
    allLizards: [],
    data_form: [],
    answer_sets: [],
    projects: []
};

const IndexedDBReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.GET_ALL_LIZARDS:
            return {
                ...state,
                allLizards: action.payload
            };
        case ACTIONS.GET_DATA_FORMS_BY_NAME_FROM_INDEXED:
            return {
                ...state,
                data_form: [...action.payload]
            }
        case ACTIONS.GET_ALL_ANSWER_SETS:
            return {
                ...state,
                answer_sets: [...action.payload]
            }
        case ACTIONS.GET_PROJECT_IDS:
            return {
                ...state,
                projects: action.payload
            }
        default:
            return state;
    }
};

export default IndexedDBReducer;
