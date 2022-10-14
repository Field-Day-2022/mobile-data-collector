import db from './Db';
import APIAccessor from "./APIAccessor";


/**
 *
 * @param session_id
 * @param result
 * @returns {Promise<*>}
 */
const getSession = async (session_id, result) => {
    let session = await db.session.get(session_id);
    return session

}
/**
 *
 * @returns {Promise<void>}
 */
const getSessionsFromRemote = async () => {
    let bulkData = await APIAccessor.getSessions();

    for (let jsonObject in bulkData){
        let tempItem = bulkData[jsonObject];
        let nestedArray = tempItem["session_json"]

        if(Array.isArray(nestedArray)) {


            const result = {};

            for (let item in nestedArray) {
                let key = Object.keys(nestedArray[item])
                let value = nestedArray[item][key]
                result[key] = value;
            }


            bulkData[jsonObject]["session_json"] = result;
        }



    }

    await db.session.bulkPut(bulkData)
}

/**
 *
 * @param session_id
 * @returns {Promise<*>}
 */
const getDateCreated = async (session_id) => {
    let session = await db.session.get(session_id);
    let dateCreated = await (session.date_modified);

    return dateCreated
}
/**
 *
 * @param session_id
 * @returns {Promise<*>}
 */
const getProjectID = async (session_id) => {
    let session = await db.session.get(session_id);
    let projectId = await (session.project_id);
    return projectId
}
/**
 *
 * @param session_id
 * @returns {Promise<*>}
 */
const getDateModified = async (session_id) => {
    let session = await db.session.get(session_id);
    let dateMod = await (session.date_modified);
    return dateMod

}
/**
 *
 * @param session_id
 * @returns {Promise<*>}
 */
const getSessionJson = async (session_id) => {
    let session = await db.session.get(session_id);
    if (session === undefined) {
        console.log('session ', session,' ', session_id)
        return
    }
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
    try {
        await db.session.add(object, {Key: session_id});
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
        await db.session.put(object, {Key: session_id});
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
        db.session.delete(session_id)
    } catch (err) {
        console.log(err);
        return err;
    }
}






export {
    deleteSession,
    updateSession,
    addSession,
    getSessionJson,
    getDateModified,
    getProjectID,
    getSession,
    getSessionsFromRemote,
    getDateCreated
}





