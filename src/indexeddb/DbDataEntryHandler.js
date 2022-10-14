import db from "./Db";
import APIAccessor from "./APIAccessor";

const getDataEntryFromRemote = async () => {
    let bulkData = await APIAccessor.getDataEntry();

    for (let jsonObject in bulkData){
        let tempItem = bulkData[jsonObject];
        let nestedArray = tempItem["entry_json"]

        if(Array.isArray(nestedArray)) {
            const result = {};
            for (let item in nestedArray) {
                let key = Object.keys(nestedArray[item])
                let value = nestedArray[item][key]
                result[key] = value;
            }
            bulkData[jsonObject]["entry_json"] = result;
        }

    }

    await db.data_entry.bulkPut(bulkData)

}


const getDataEntry = async (entry_id) => {
    let data_entry = await db.data_entry.get(entry_id);
    return data_entry

}

const getSessionID = async (entry_id) => {
    let data = await db.data_entry.get(entry_id);
    return data.session_id

}


const getProjectID = async (entry_id) => {
    let data_entry = await db.data_entry.get(entry_id);
    let projectId = await (data_entry.project_id);
    return projectId
}

const getDateModified = async (entry_id) => {
    let data_entry = await db.data_entry.get(entry_id);
    let dateMod = await (data_entry.date_modified);
    return dateMod

}

const getDataEntryJson = async (entry_id) => {
    let data_entry = await db.data_entry.get(entry_id);
    let entryJson = await data_entry.entry_json;
    return await entryJson
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
    try {
        await db.data_entry.add(object, {Key: entry_id});
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
        await db.data_entry.put(object, {Key: entry_id});
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
        db.data_entry.delete(entry_id)
    } catch (err) {
        console.log(err);
        return err;
    }
}

const getDataBySessionId = async (session_id) =>{

    let dataEntries =  await db.data_entry.where("session_id").equals(session_id).toArray()
    return dataEntries
}

const getLizard = async (projectId) => {
    let lizards = await db.data_entry.where({project_id: projectId, form_id: 3}).toArray();
    return lizards
}

export{
    getLizard,
    getDataBySessionId,
    getDataEntryFromRemote,
    getDataEntry,
    getDateModified,
    getDataEntryJson,
    getProjectID,
    getSessionID,
    addDataEntry,
    updateDataEntry,
    deleteDataEntry
}
