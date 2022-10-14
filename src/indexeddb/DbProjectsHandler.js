import db from "./Db";
import APIAccessor from "./APIAccessor";

const getProjectsFromRemote = async () => {
    let bulkData = await APIAccessor.getProjects();

    await db.project.bulkPut(bulkData)

}
/**
 * returns all proejcts from indexedDB
 */
const getProjects = async ()  => {
    let projects =  await db.project.toArray()

    return projects;
}
const getProjectById = async (projectId) => {
    let project = await db.project.get({project_id: projectId})
    return project

}

const getProjectByName = async (projectName) => {
    let project = await db.project.get({project_name: projectName})
    return project
}

const getDateModifiedById = async (projectId) => {
    let project = await db.project.get({project_id: projectId})
    let date = project["date_modified"]
    return date
}

const getDateModifiedByName = async (projectName) => {
    let project = await db.project.get({project_name: projectName})
    let date = project["date_modified"]
    return date
}


export{
    getDateModifiedByName,
    getDateModifiedById,
    getProjectByName,
    getProjectById,
    getProjects,
    getProjectsFromRemote
}