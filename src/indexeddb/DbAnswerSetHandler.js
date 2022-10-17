import db from "./Db";
import APIAccessor from "./APIAccessor";

const getAnswerSetFromRemote = async () => {
    let bulkData = await APIAccessor.getAnswerSets();


    await db.answer_set.bulkPut(bulkData)

}

const getAnswerSetByName = async (name) => {
    let set = await db.answer_set.get({set_name: name});

    return set


}


const getAnswerSets = async () => {
    let answerSet = await db.answer_set.toArray()
    return answerSet
}


export {
    getAnswerSetByName,
    getAnswerSets,
    getAnswerSetFromRemote
}
