import { combineReducers } from 'redux';
import SessionReducer from './session-reducer';
import ToeClipCodeReducer from './toe-clip-code-reducer';
import LocationReducer from './location-reducer';
import IndexedDBReducer from './indexedDB-reducer';

// this is what "state" is in useSelector
export const rootReducer = combineReducers({
    Location_Info: LocationReducer,
    Session_Info: SessionReducer,
    Toe_Clip_Code: ToeClipCodeReducer,
    Database: IndexedDBReducer,
});
