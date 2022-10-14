import Dexie from 'dexie';



const db = new Dexie('FieldDayLocal');
db.version(3).stores(
    {session: 'session_id, date_modified, project_id, date_created, form_id, session_json',
        data_entry: 'entry_id, date_modified, entry_json, form_id, project_id, session_id',
        answer_set: 'set_name, answers, date_modified, secondary_keys',
        data_form: 'form_id, date_modified, form_name, is_session_form, template_json',
        project: 'project_id, comments, date_modified, project_name',
        new_data_entry: 'entry_id, date_modified, entry_json, form_id, project_id, session_id',
        new_session: 'session_id, date_modified, project_id, date_created, form_id, session_json'
        })



export default db
