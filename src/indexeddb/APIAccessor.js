import axios from 'axios';

import { db } from '../utils/firebase';
import { collection, getDocsFromServer, query } from 'firebase/firestore';

const ApiURL = 'https://uljllddgme.execute-api.us-east-2.amazonaws.com/dev/';

//const ApiURL = 'http://localhost:3000/dev/'
class APIAccessor {
    static async sendSession(sessionObject) {
        await axios({
            method: 'post',
            url: `${ApiURL}session`,
            headers: {},
            data: {
                session_id: sessionObject.session_id,
                date_created: sessionObject.date_created,
                session_json: sessionObject.session_json,
                project_id: sessionObject.project_id,
                date_modified: sessionObject.date_modified,
                form_id: sessionObject.form_id,
            },
        });
    }

    static async sendDataEntry(dataEntryObject) {
        await axios({
            method: 'post',
            url: `${ApiURL}data_entry`,
            headers: {},
            data: {
                session_id: dataEntryObject.session_id,
                date_modified: dataEntryObject.date_modified,
                entry_id: dataEntryObject.entry_id,
                entry_json: dataEntryObject.entry_json,
                form_id: dataEntryObject.form_id,
                project_id: dataEntryObject.project_id,
            },
        });
    }

    static async getSessions() {
        const promise = await axios.get(ApiURL + 'session');

        const getAllSessionsQuery = query(collection(db, 'Session'));
        const querySnapshot = await getDocsFromServer(getAllSessionsQuery);
        let firebaseArr = [];
        querySnapshot.forEach((queryDocSnap) => {
            firebaseArr = [...firebaseArr, queryDocSnap.data()];
        });

        console.log('getting session data...');
        console.log('from aws:');
        console.log(promise.data);
        console.log('from firestore:');
        console.log(querySnapshot.docs);
        console.log(firebaseArr);

        return promise.data;
    }

    static async getDataEntry() {
        const promise = await axios.get(ApiURL + 'data_entry');
        return promise.data;
    }

    static async getAnswerSets() {
        const promise = await axios.get((await ApiURL) + 'answer_set');
        // const getAllAnswerSetsQuery = query(collection(db, 'Answer_Set'));
        // const querySnapshot = await getDocsFromServer(getAllAnswerSetsQuery);
        // let formattedData = [];
        // querySnapshot.forEach((queryDocSnap) => {
        //     formattedData = [...formattedData, queryDocSnap.data()];
        // })
        // console.log(formattedData);
        // console.log(promise.data);

        return promise.data;
    }

    static async getDataForm() {
        const promise = await axios.get((await ApiURL) + 'data_form');
        return promise.data;
    }

    static async getProjects() {
        const promise = await axios.get((await ApiURL) + 'project');
        return promise.data;
    }
}

export default APIAccessor;
