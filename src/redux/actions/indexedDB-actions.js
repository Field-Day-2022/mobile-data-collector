import {getAllForms} from "../../indexeddb/DbDataFormHandler";
import {getAnswerSets} from "../../indexeddb/DbAnswerSetHandler";
import {getProjects} from "../../indexeddb/DbProjectsHandler";

export const GET_ALL_LIZARDS = 'GET_ALL_LIZARDS';
export const GET_DATA_FORMS_BY_NAME_FROM_INDEXED = 'GET_DATA_FORMS_BY_NAME_FROM_INDEXED';
export const GET_ALL_ANSWER_SETS = 'GET_ALL_ANSWER_SETS';
export const GET_PROJECT_IDS = 'GET_PROJECT_IDS';

export const getDataFormByNameFromIndexed = () => {
    return async (dispatch) => {

        //Form Data from IndexedDB
        await getAllForms().then(response => {
            dispatch({
                type: GET_DATA_FORMS_BY_NAME_FROM_INDEXED,
                payload: response
            })
        })
    };
};

export const getAnswerSetsFromIndexed = () => {
    return async (dispatch) => {
        await getAnswerSets().then(response => {
            dispatch({
                type: GET_ALL_ANSWER_SETS,
                payload: response
            })
        })
    }
}

export const getAllProjectIdsFromIndexedDB = () => {
    return async dispatch => {
        await getProjects().then(response => {
            dispatch({
                type: GET_PROJECT_IDS,
                payload: response
            })
        })
    }
}

export const getAllLizards = () => async (dispatch) => {
    /*let lizards = await getLizard(currentSessions.project_id);
  for (let lizard in lizards) {
      let species = lizards[lizard]["entry_json"]["Species Code"];
      let toeClipCode = lizards[lizard]["entry_json"]["Toe-clip Code"];
      const sessionId = lizards[lizard]["session_id"];
      const siteCall = await SessionDb.getSessionJson(sessionId);
      const site = siteCall.Site
      if (site === currentSessions.session_json[2].Site) {
          // console.log("FOUND LIZARD AT Site: " + currentSessions.session_json[2].Site + " WITH SPECIES" + species + " toeClipCode" + toeClipCode);


      dispatch({
          type:  ACTIONS.GET_ALL_LIZARDS,
          payload: res
      })
  });*/
}
