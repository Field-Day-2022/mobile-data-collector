import React, {memo, useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Container, Row} from "react-bootstrap";
import _ from 'lodash';
import {
    UPDATE_SESSION,
    CLEAR_CURRENT_SESSION_STATE,
    UPDATE_ERROR_STATE,
    createCurrentSliceAndErrorStates
} from "../../redux/actions/session-actions";
import * as CONSTANTS from "../../constants";
import FormFactory from "../form-factory/form-factory";
import TemplateVerify from "../verify/template-verify";
import './template-page.css';

const TemplatePage = props => {
    const dispatch = useDispatch();
    const date_modified = (Date.now() / 1000).toFixed();

    // React Router automatically passes two props to each routed component
    // "match" and "location"
    // We want to use the form name that is pass dynamically into
    // the template page by the router.
    // <Route path="/:form_name_n" component={TemplatePage} exact /> in App.js
    // Where the dynamic var is form_name_n
    const {
        params: {form_name_n},
    } = props.match;

    // Redux Store
    const all_data_forms = useSelector(state => state.Database.data_form);
    const all_projects = useSelector(state => state.Database.projects);
    const currentLocation = useSelector(state => state.Location_Info.location);
    const currentSite = useSelector(state => state.Location_Info.site);
    const usedToeClipCode = useSelector(state => state.Toe_Clip_Code.currentSpecies)

    // Use the dynamic route to find the specific data form
    const locationDataForm = _.find(all_data_forms,
        data_form => data_form.form_name === form_name_n);

    // Extract the fields to build out the forms
    const fields = form_name_n === CONSTANTS.SESSION
        ? locationDataForm.template_json.start.fields
        : locationDataForm.template_json.fields;

    // The Next array for the progress to the next page.
    const nextArr = form_name_n === CONSTANTS.SESSION
        ? locationDataForm.start.next
        : locationDataForm.next;
    //console.log("Next Array: ", nextArr);

    const currentSession = useSelector(state => state.Session_Info.currentSession.data);
    const reduxErrorState = useSelector(state => state.Session_Info.currentErrorState.data);

    // Local State
    const [onVerifyPage, setOnVerifyPage] = useState(false);

    // Check to see if there are any relies_on fields
    const reliesOnContainerArr = fields.filter(field => field.hasOwnProperty(CONSTANTS.RELIES_ON));

    const validate = () => {
        let errState = {...reduxErrorState};
        errState["OTL(mm)"] = false;
        for (const prop in reduxErrorState) {
            if (reduxErrorState.hasOwnProperty(prop)) {
                if (currentSession[prop] === '' ||
                    currentSession[prop] === undefined ||
                    currentSession[prop] === null) {

                    errState[prop] = CONSTANTS.REQUIRED;
                } else {

                    errState[prop] = false;
                }
                if (prop === "Regen Tail?") {
                    if (parseFloat(currentSession["OTL(mm)"]) > parseFloat(currentSession["VTL(mm)"])) {
                        errState["OTL(mm)"] = CONSTANTS.REQUIRED;
                    } else {
                        errState["OTL(mm)"] = false;
                    }
                }
                //Lizard Handler For Species Code
                if (prop === "Recapture") {
                    if (usedToeClipCode === "used" && currentSession[prop] !== true) {
                        errState["toeClipCode"] = CONSTANTS.REQUIRED;
                        errState[prop] = CONSTANTS.REQUIRED;
                    } else if (usedToeClipCode !== "used" && currentSession[prop] === true) {
                        currentSession[prop] = false;
                        errState["toeClipCode"] = CONSTANTS.REQUIRED;
                        errState[prop] = CONSTANTS.REQUIRED;
                    } else {
                        errState["toeClipCode"] = false;
                        errState[prop] = false;
                    }
                }
            }
        }

        if (Object.values(errState).length > 0) {
            // Update Redux so the components can show their
            // error message
            dispatch({
                type: UPDATE_ERROR_STATE,
                payload: {...errState}
            });
        }

        return (
            Object.values(errState).filter(
                val => _.toLower(String(val)) === _.toLower(CONSTANTS.REQUIRED)).length <= 0
        );
    }

    const onHandleSubmit = (event) => {
        event.preventDefault();
        const isFormValid = validate();
        if (isFormValid) {
            if (onVerifyPage) {
                setOnVerifyPage(false);
                dispatch({
                    type: CLEAR_CURRENT_SESSION_STATE
                });
                props.history.push(`/${CONSTANTS.SPECIES_SELECTION}`);
            } else {
                setOnVerifyPage(true);
                const getProject_Id = _.find(all_projects, project => project.project_name === currentLocation);

                if (form_name_n === CONSTANTS.SESSION) {
                    dispatch({
                        type: UPDATE_SESSION,
                        payload: {
                            form: form_name_n,
                            data: {
                                ...currentSession,
                                date_modified: date_modified,
                                project_id: getProject_Id.project_id,
                                form_id: locationDataForm.form_id,
                                date_created: date_modified,
                                session_id: date_modified
                            }
                        }
                    });

                    if(currentSession.hasOwnProperty(CONSTANTS.NO_CAPTURES)){
                        return currentSession[CONSTANTS.NO_CAPTURES]
                            ? props.history.push(`/${CONSTANTS.FINISH_SESSION}`)
                            : props.history.push(`/${CONSTANTS.SPECIES_SELECTION}`)
                    }

                    props.history.push(`/${CONSTANTS.SPECIES_SELECTION}`);
                } else {
                    dispatch({
                        type: UPDATE_SESSION,
                        payload: {
                            form: form_name_n,
                            data: {
                                ...currentSession,
                                date_modified: date_modified,
                                project_id: getProject_Id.project_id,
                                form_id: locationDataForm.form_id,
                                date_created: date_modified
                            }
                        }
                    });
                }
            }
        }
    }

    const buildQuestionState = (fields, questionState = {}) => {
        let qState = {...questionState};
        fields.forEach(field => {
            qState = {...qState, [field.prompt]: ''};
        })

        return {
            form: form_name_n,
            reliesOn: [...reliesOnContainerArr],
            data: {...qState}
        };
    }

    const buildErrorState = (fields, errorState = {}) => {
        let errState = {...errorState};
        fields.forEach(field => {
            if (field.required) {
                errState = {...errState, [field.prompt]: false};
            }
        })

        return {
            form: form_name_n,
            data: {...errState}
        };
    }

    const initReduxQandErrStates = fields => {
        const qState = buildQuestionState(fields);
        const errState = buildErrorState(fields);

        dispatch(createCurrentSliceAndErrorStates(qState, errState));
    }

    const buildDynamicForm = fields => {
        return (<FormFactory
            fields={fields}
        />);
    };

    const hideVerify = () => setOnVerifyPage(false);

    useEffect(() => {
        // Prevents the page from a re-render unless the
        // the form name changes
        initReduxQandErrStates(fields);
    }, [form_name_n]);

    return (
        <div className='home-page-backing'>
            {onVerifyPage
                ?
                <div>
                    <TemplateVerify
                        formName={form_name_n}
                        goToSelection={() => props.history.push(`/${CONSTANTS.SPECIES_SELECTION}`)}
                        hideVerifyPage={hideVerify}
                    />
                </div>
                :
                <div>
                    <div className="header">
                        <h1><span className='spacer'>{form_name_n === "Session" ? `${currentLocation} New Data` : `${currentSite} New ${form_name_n} Data`}</span></h1>
                    </div>
                    <div className='center-column'>
                        <Container className='amphibian-form'>
                            <Row>
                                <Col>
                                    {buildDynamicForm(fields)}
                                </Col>
                            </Row>
                            <div className='button-container'>
                                {
                                    form_name_n !== CONSTANTS.SESSION &&
                                    <Button
                                        className='next-button'
                                        aria-label='Go to Species Selection Form'
                                        type='button'
                                        onClick={() => props.history.push(`/${CONSTANTS.SPECIES_SELECTION}`)}
                                    >
                                        Go Back
                                    </Button>
                                }
                                <Button
                                    className='next-button'
                                    aria-label='Go to verify page.'
                                    type='submit'
                                    onClick={event => onHandleSubmit(event)}
                                >
                                    NEXT
                                </Button>
                            </div>
                        </Container>
                    </div>
                </div>
            }
        </div>
    )
};

export default memo(TemplatePage);
