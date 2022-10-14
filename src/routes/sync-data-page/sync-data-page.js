import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Container, Form, FormLabel, Row, Spinner} from "react-bootstrap";
import {
    getAllProjectIdsFromIndexedDB,
    getAnswerSetsFromIndexed,
    getDataFormByNameFromIndexed
} from "../../redux/actions/indexedDB-actions";
import {fieldHasError, getProjectId} from "../../utils/utils";
import DBConfig from "../../indexeddb/DBConfig";
import {UPDATE_LOCATION} from "../../redux/actions/location-actions";
import {ADD_SPECIES} from "../../redux/actions/toe-clip-code-actions";
import {getAnswerSets} from "../../indexeddb/DbAnswerSetHandler";
import '../../App.css';
import './sync-data-page.css';

const SyncData = (props) => {
    // Local State
    const [validated, setValidated] = useState(false);
    const [errors, setError] = useState({});
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redux State
    //const projects = useSelector(state => state.Database.projects);
    //const rawLocations = projects.map(project => project.project_name);


    const locations = ['', 'Gateway', 'San Pedro', 'Virgin River'];

    const dispatch = useDispatch();

    const validateThisForm = () => {
        let errors = {};
        if (location === '') {
            errors = {...errors, location: 'Required'}
        }
        setError({...errors});
        setValidated(Object.keys(errors).length === 0);
        return Object.keys(errors).length === 0;
    };

    const removeFromErrors = (fieldName) => {
        delete errors[fieldName];
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const validForm = validateThisForm();
        if (validForm) {
            await DBConfig.getAnswersFromDynamoDB();
            await handleLocationSelectionDuplicate(location);
            const projectId = getProjectId(location);
            let answerSet = await getAnswerSets();
            let lizardSpeciesByLocationAnswerData = answerSet.filter((answerSet) => {
                if (answerSet.set_name === `${location}LizardSpecies`) {
                    return answerSet.answers
                }
            })
            let lizardSpeciesByLocationAnswer = lizardSpeciesByLocationAnswerData[0].answers.map((answers) => {
                return answers.primary
            })

            let objectOfClipCodesEmptyArrays = {};

            answerSet.forEach((answerSet) => {
                if (answerSet.set_name.includes(location) && answerSet.set_name.includes("Array")) {
                    let objName = answerSet.set_name.split(location)[1].split("Array")[0]
                    let tempObject = {}
                    lizardSpeciesByLocationAnswer.forEach((speciesCode) => {
                        tempObject[speciesCode] = [];
                    })

                    objectOfClipCodesEmptyArrays[objName] = tempObject;

                    return objectOfClipCodesEmptyArrays
                }
            })
            getLizardEntriesFromDB(projectId, objectOfClipCodesEmptyArrays);
        }
    }

    const getLizardEntriesFromDB = async (projectId, objectOfClipCodesEmptyArrays) => {
        await DBConfig.filterLizardEntries(projectId, objectOfClipCodesEmptyArrays);
        console.log('ToeClipCodes based on Location sending to redux', objectOfClipCodesEmptyArrays)
        dispatch({
            type: ADD_SPECIES,
            payload: objectOfClipCodesEmptyArrays
        })
        props.history.push('/');
    }

    function handleLocationSelection(e) {
        //Update Redux with the Data Form questions
        //and answer sets
        getDataFormByNameFromIndexed()(dispatch);
        getAnswerSetsFromIndexed()(dispatch);
        getAllProjectIdsFromIndexedDB()(dispatch);

        //Update the Redux Store
        dispatch({
            type: UPDATE_LOCATION,
            payload: e.target.value
        });

        //Save in Session Storage
        const projectId = getProjectId(e.target.value);
        sessionStorage.setItem('location', e.target.value);
        sessionStorage.setItem('projectId', String(projectId));

        //Update the local state for validation
        setLocation(e.target.value);

        //Remove from Errors when valid
        if (e.target.value) {
            removeFromErrors('location');
        }
    }

    function handleLocationSelectionDuplicate(location) {
        //Update Redux with the Data Form questions
        //and answer sets
        getDataFormByNameFromIndexed()(dispatch);
        getAnswerSetsFromIndexed()(dispatch);
        getAllProjectIdsFromIndexedDB()(dispatch);

        //Update the Redux Store
        dispatch({
            type: UPDATE_LOCATION,
            payload: location
        });

        //Save in Session Storage
        const projectId = getProjectId(location);
        sessionStorage.setItem('location', location);
        sessionStorage.setItem('projectId', String(projectId));

        //Update the local state for validation
        setLocation(location);

        //Remove from Errors when valid
        if (location) {
            removeFromErrors('location');
        }
    }

    return (
        <div className='home-page-backing'>
            <div className="header">
                <h1><span className='spacer'>{location !== '' ? location + ' Data Sync' : 'Location Data Sync'}</span>
                </h1>
            </div>
            <div className='center-column'>
                <Container id='syncData'>
                    <Row>
                        <Col>
                            <Form
                                noValidate
                                validated={validated}
                                onSubmit={handleSubmit}
                            >
                                {
                                    fieldHasError('location') &&
                                    <p className='error-class'>
                                <span className='error-text'>
                                    {errors.location}
                                </span>
                                    </p>
                                }
                                <Form.Group controlId='location'>
                                    <FormLabel className='select-group'>
                                        Choose Location:
                                        <Form.Control
                                            required
                                            as='select'
                                            custom
                                            onChange={e => handleLocationSelection(e)}
                                        >
                                            {
                                                locations.map((location) => {
                                                    return (
                                                        <option
                                                            key={location}
                                                            value={location}
                                                            className='list-item'
                                                        >
                                                            {location}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </Form.Control>
                                    </FormLabel>
                                </Form.Group>

                                <div className='button-container'><Button
                                    className='next-button'
                                    aria-label='Sync Data.'
                                    type='submit'
                                    disabled={isLoading}
                                >
                                    {
                                        isLoading &&
                                        <Spinner
                                            id='syncSpinner'
                                            animation="border"
                                            role="status"
                                            size='lg'
                                            variant='light'
                                        >
                                            <span className='sr-only'>Loading</span>
                                        </Spinner>
                                    }
                                    Sync Data
                                </Button>
                                    <Button
                                        className='next-button'
                                        aria-label='Return Home.'
                                        type='button'
                                        onClick={() => props.history.push('/')}
                                    >
                                        Return Home
                                    </Button></div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default SyncData;
