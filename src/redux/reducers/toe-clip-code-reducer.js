import * as ACTIONS from '../actions/toe-clip-code-actions';

const initialState = {
    currentSpecies: '',
    lizardSpecies: {
        ASTI: [],
        ASVE: [],
        CADR: [],
        COVA: [],
        CRCO: [],
        GAWI: [],
        PHSO: [],
        SCMA: [],
        UNKL: [],
        URGR: [],
        UROR: [],
        UTST: [],
    }
}

const addToeClipCode = (state, action) => {
    return state;
}

const toeClipCodeReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.ADD_SPECIES:
            return {...state, ...action.payload};
        case ACTIONS.ADD_NEW_TOE_CLIP_CODE:
            let newState = {...state}
            newState[action.payload.site][action.payload.species].push({
                toeClipCode: action.payload.toeClipCode,
                entry_id: 0
            })
            return newState;
        case ACTIONS.UPDATE_NEW_TOE_CLIP_CODE:
            let newDateState = {...state}
            let entry_id = action.payload.entry_id;
            // FIND TOE CLIP CODE IN REDUX and updates it's entry_id
            for (let i = newDateState[action.payload.site][action.payload.species].length - 1; i >= 0; i--) {
                if (action.payload.toeClipCode === newDateState[action.payload.site][action.payload.species][i].toeClipCode) {
                    newDateState[action.payload.site][action.payload.species][i].entry_id = entry_id;
                    break;
                }
            }
            return newDateState;
        case ACTIONS.ADD_TOECLIP_CODE:
            return addToeClipCode();
        case ACTIONS.UPDATE_CURRENT_LIZARD_SPECIES:
            return {...state, currentSpecies: action.payload};
        case ACTIONS.ADD_USED_CODE:
            return {...state, currentSpecies: "used"};
        case ACTIONS.REMOVE_USED_CODE:
            return {...state, currentSpecies: ""};
        default:
            return state;
    }
};

export default toeClipCodeReducer;
