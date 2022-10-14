import {UPDATE_LOCATION, UPDATE_SITE} from "../actions/location-actions";

const initialState = {
    location: '',
    site: ''
}

const LocationReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_LOCATION:
            return {...state, location: action.payload};
        case UPDATE_SITE:
            return {...state, site: action.payload};
        default:
            return state;
    }
};

export default LocationReducer;