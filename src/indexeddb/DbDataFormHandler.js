import db from "./Db";
import APIAccessor from "./APIAccessor";

const getDataFormFromRemote = async () => {
    let bulkData = await APIAccessor.getDataForm();

    for (let jsonObject in bulkData) {
        let tempItem = bulkData[jsonObject];
        let nestedArray = tempItem["template_json"]

        if (Array.isArray(nestedArray)) {
            const result = {};
            for (let item in nestedArray) {
                let key = Object.keys(nestedArray[item])
                let value = nestedArray[item][key]
                result[key] = value;
            }
            bulkData[jsonObject]["template_json"] = result;
        }

    }
    await db.data_form.bulkPut(bulkData)

}

const getDataFormByName = async (name) =>{
    let form = await db.data_form.get({form_name: name});
    return form;
}

const getJsonFromFormByName = async (name) => {
    let json = await db.data_form.get({form_name: name});
    return json["template_json"]
}

const getAllForms = async () => {
    let answerSet = await db.data_form.toArray()
    return answerSet
}


export{
    getAllForms,
    getJsonFromFormByName,
    getDataFormByName,
    getDataFormFromRemote
}