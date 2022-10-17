import db from "./Db";
import APIAccessor from "./APIAccessor";
import * as CONSTANTS from "../constants";

const sendDataEntryToRemote = async () => {
    var dataEntry = await db.new_data_entry.toArray()

    for (var i in dataEntry) {
        await APIAccessor.sendDataEntry(dataEntry[i])
    }

    db.new_data_entry.clear();


}

const clearTable = async () => {
    db.new_data_entry.clear()
}


const getDataEntry = async (entry_id) => {
    let data_entry = await db.new_data_entry.get(entry_id);
    return data_entry

}

const getSessionID = async (entry_id) => {
    let data = await db.new_data_entry.get(entry_id);
    return data.session_id

}


const getProjectID = async (entry_id) => {
    let data_entry = await db.new_data_entry.get(entry_id);
    let projectId = await (data_entry.project_id);
    return projectId
}

const getDateModified = async (entry_id) => {
    let data_entry = await db.new_data_entry.get(entry_id);
    let dateMod = await (data_entry.date_modified);
    return dateMod

}

const getDataEntryJson = async (entry_id) => {
    let data_entry = await db.new_data_entry.get(entry_id);
    let entryJson = await data_entry.entry_json;
    return await entryJson
}

const getAllNewDataEntries = async () => {
    return await db.new_data_entry.toArray();
}

/**
 *Adds a data entry to IndexedDb.
 *
 * Object needs to have the following parameters:
 * date_modified
 * project_id
 * form_id
 * session_json
 * session_id
 * @param object
 * @param entry_id
 * @returns {Promise<*>}
 *
 */
const addDataEntry = async (object, entry_id) => {
    let result = {...object};
    let sessionArr = [];

    // Gets the session_json array and converts it from
    // an object to an array.  Once that is done, then
    // it is merged (updates the session_json field) back into the response object that was passed in.
    for (const prop in result) {
        if (result.hasOwnProperty(prop)) {
            if (prop === CONSTANTS.ENTRY_JSON) {
                const keys = Object.keys(result[CONSTANTS.ENTRY_JSON]);
                const sessionJsonArrPath = result[CONSTANTS.ENTRY_JSON];
                sessionArr = keys.map(key => ({[key]: sessionJsonArrPath[key]}));
            }
        }
    }

    // Update the session_json field to contain the array of objects
    // that was made above.
    result = {
        ...result,
        [CONSTANTS.ENTRY_JSON]: sessionArr
    }
    try {
        await db.new_data_entry.add(result, {Key: entry_id});
    } catch (err) {
        console.log(err)
        return err
    }
}
/**
 * * Best practices for updating a data entry is to call getDataEntry, then modify the object that is returned directly
 * then pass that object into updateDataEntry.
 * Note the key needs to be passed as an object as well. For example {Key: object.entry_id}
 *
 * @param object
 * @param entry_id
 * @returns {Promise<*>}

 */
const updateDataEntry = async (object, entry_id) => {
    try {
        await db.new_data_entry.put(object, {Key: entry_id});
    } catch (err) {
        console.log(err)
        return err
    }
}
/**
 *Deletes data entry from IndexedDb
 *
 * @param entry_id
 * @returns {Promise<*>}
 */
const deleteDataEntry = async (entry_id) => {
    try {
        db.new_data_entry.delete(entry_id)
    } catch (err) {
        console.log(err);
        return err;
    }
}

const getDataBySessionId = async (session_id) => {

    let dataEntries = await db.new_data_entry.where("session_id").equals(session_id).toArray()
    return dataEntries
}

const getLizard = async (projectId) => {
    let lizards = await db.new_data_entry.where({project_id: projectId, form_id: 3}).toArray();
    return lizards
}

export {
    clearTable,
    getLizard,
    getDataBySessionId,
    sendDataEntryToRemote,
    getDataEntry,
    getDateModified,
    getDataEntryJson,
    getProjectID,
    getSessionID,
    addDataEntry,
    updateDataEntry,
    deleteDataEntry,
    getAllNewDataEntries
}
