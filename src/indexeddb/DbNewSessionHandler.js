import db from './Db';
import APIAccessor from "./APIAccessor";
import * as CONSTANTS from '../constants';


/**
 *
 * @param session_id
 * @param result
 * @returns {Promise<*>}
 */
const getSession = async (session_id, result) => {
    let session = await db.new_session.get(session_id);
    return session

}
/**
 *
 * @returns {Promise<void>}
 */
const sendSessionsToRemote = async () => {

    var sessions = await db.new_session.toArray()

    for (var i in sessions) {
        await APIAccessor.sendSession(sessions[i])
    }

    db.new_session.clear();


}

const clearTable = async () => {
    db.new_session.clear()
}

/**
 *
 * @param session_id
 * @returns {Promise<*>}
 */
const getDateCreated = async (session_id) => {
    let session = await db.new_session.get(session_id);
    let dateCreated = await (session.date_modified);

    return dateCreated
}
/**
 *
 * @param session_id
 * @returns {Promise<*>}
 */
const getProjectID = async (session_id) => {
    let session = await db.new_session.get(session_id);
    let projectId = await (session.project_id);
    return projectId
}
/**
 *
 * @param session_id
 * @returns {Promise<*>}
 */
const getDateModified = async (session_id) => {
    let session = await db.new_session.get(session_id);
    let dateMod = await (session.date_modified);
    return dateMod

}
/**
 *
 * @param session_id
 * @returns {Promise<*>}
 */
const getSessionJson = async (session_id) => {
    let session = await db.new_session.get(session_id);
    let sessJson = await session.session_json;
    return sessJson
}
/**
 *Adds a session to IndexedDb.
 *
 * Object needs to have the following parameters:
 * date_modified
 * project_id
 * date_created
 * form_id
 * session_json
 *
 * @param object
 * @param session_id
 * @returns {Promise<*>}
 *
 */
const addSession = async (object, session_id) => {
    let result = {...object};
    let sessionArr = [];

    // Gets the session_json array and converts it from
    // an object to an array.  Once that is done, then
    // it is merged (updates the session_json field) back into the response object that was passed in.
    for (const prop in result) {
        if (result.hasOwnProperty(prop)) {
            if (prop === CONSTANTS.SESSION_JSON) {
                const keys = Object.keys(result[CONSTANTS.SESSION_JSON]);
                const sessionJsonArrPath = result[CONSTANTS.SESSION_JSON];
                sessionArr = keys.map(key => ({[key]: sessionJsonArrPath[key]}));
            }
        }
    }

    // Update the session_json field to contain the array of objects
    // that was made above.
    result = {
        ...result,
        [CONSTANTS.SESSION_JSON]: sessionArr
    }

    try {
        await db.new_session.add(result, {Key: session_id});
    } catch (err) {
        console.log(err)
        return err
    }


}
/**
 * * Best practices for updating a session is to call getSession, then modify the object that is returned directly
 * then pass that object into updateSession.
 * Note the key needs to be passed as an object as well. For example {Key: object.session_id}
 *
 * @param object
 * @param session_id
 * @returns {Promise<*>}

 */
const updateSession = async (object, session_id) => {
    try {
        await db.new_session.put(object, {Key: session_id});
    } catch (err) {
        console.log(err)
        return err
    }
}
/**
 *Deletes session session entry from IndexedDb
 *
 * @param session_id
 * @returns {Promise<*>}
 */
const deleteSession = async (session_id) => {
    try {
        db.new_session.delete(session_id)
    } catch (err) {
        console.log(err);
        return err;
    }
}


export {
    clearTable,
    deleteSession,
    updateSession,
    addSession,
    getSessionJson,
    getDateModified,
    getProjectID,
    getSession,
    sendSessionsToRemote,
    getDateCreated
}
