const SessionDb = require('./DbSessionHandler');
const DataEntryDb = require('./DbDataEntryHandler');
const AnswerSetDb = require('./DbAnswerSetHandler');
const DataFormDb = require('./DbDataFormHandler.js');
const ProjectDb = require('./DbProjectsHandler');
const NewSessionDb = require('./DbNewSessionHandler')
const NewDataEntryDb = require('./DbNewDataEntryHandler')

class DBConfig {
    static async getAnswersFromDynamoDB() {
         await SessionDb.getSessionsFromRemote(); // pulls entire Session table from Dynamo and stores in IndexedDb.
         await DataEntryDb.getDataEntryFromRemote(); // pulls entire Data entry table from Dynamo
         await DataFormDb.getDataFormFromRemote();
         await AnswerSetDb.getAnswerSetFromRemote();
         await ProjectDb.getProjectsFromRemote();
    }

    static async filterLizardEntries(projectId, objectOfClipCodesEmptyArrays) {

        let lizards = await DataEntryDb.getLizard(projectId); // Gets Lizards from Gateway 2 is gateway

        // Helper function takes in sessionId to find the site ex: GWA2
        const getSite = async (sessionId) => {
            const site = await SessionDb.getSessionJson(sessionId);
            if (site === undefined) {
                return
            }
            return site.Site
        }

        for (let lizard in lizards) {
            let entry_id = lizards[lizard]['entry_id'];
            let species = lizards[lizard]["entry_json"]["Species Code"]
            let toeClipCode = lizards[lizard]["entry_json"]["Toe-clip Code"];
            const sessionId = lizards[lizard]["session_id"];
            let site = await getSite(sessionId);
            if (site === undefined) {
                continue
            }
            objectOfClipCodesEmptyArrays[site][species].push({toeClipCode, entry_id})
        }
    };


    static async uploadNewEntries(sessionData) {

        await NewSessionDb.sendSessionsToRemote();
        await NewDataEntryDb.sendDataEntryToRemote();
        await NewDataEntryDb.clearTable();
        await NewSessionDb.clearTable();

    }

}

export default DBConfig;

export {SessionDb, DataEntryDb, AnswerSetDb, ProjectDb, DataFormDb}





