import axios from "axios";


const ApiURL = 'https://uljllddgme.execute-api.us-east-2.amazonaws.com/dev/';

//const ApiURL = 'http://localhost:3000/dev/'
class APIAccessor {

    static async sendSession(sessionObject) {
        await axios({
            method: 'post',
            url: `${ApiURL}session`,
            headers: {},
            data: {
                "session_id": sessionObject.session_id,
                "date_created": sessionObject.date_created,
                "session_json": sessionObject.session_json,
                "project_id": sessionObject.project_id,
                "date_modified": sessionObject.date_modified,
                "form_id": sessionObject.form_id
            }
        });
    }

    static async sendDataEntry(dataEntryObject) {
        await axios({
            method: 'post',
            url: `${ApiURL}data_entry`,
            headers: {},
            data: {
                "session_id": dataEntryObject.session_id,
                "date_modified": dataEntryObject.date_modified,
                "entry_id": dataEntryObject.entry_id,
                "entry_json": dataEntryObject.entry_json,
                "form_id": dataEntryObject.form_id,
                "project_id": dataEntryObject.project_id
            }


        });
    }


    static async getSessions() {
        const promise = await axios.get(ApiURL + "session")


        return promise.data

    }

    static async getDataEntry() {
        const promise = await axios.get(ApiURL + "data_entry")
        return promise.data
    }

    static async getAnswerSets() {
        const promise = await axios.get(await ApiURL + "answer_set")
        return promise.data
    }

    static async getDataForm() {
        const promise = await axios.get(await ApiURL + "data_form")
        return promise.data
    }

    static async getProjects() {
        const promise = await axios.get(await ApiURL + "project")
        return promise.data
    }


}

export default APIAccessor
