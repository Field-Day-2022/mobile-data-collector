import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {CLEAR_CURRENT_AND_ERROR} from "../../redux/actions/session-actions";
import {
    Form,
    Button,
    Col,
    Container,
    FormGroup,
    FormLabel,
    Row, Modal
} from "react-bootstrap";
import FieldWrapper from '../../components/form-components/field-wrapper';
import {fieldHasError} from "../../utils/utils";
import * as CONSTANTS from '../../constants';
import _ from 'lodash';
import './FieldDayFormSelectionForm.css';
import '../../App.css';


const NewDataEntry = (props) => {
    const dispatch = useDispatch();

    //Local State
    const [validated, setValidated] = useState(false);
    const [animal, setAnimal] = useState('');
    const [errors, setError] = useState({});
    const [endSession, setEndSession] = useState(false);
    const [showEndSessionModal, setShowEndSessionModal] = useState(false);

    //Redux State
    const currentLocation = useSelector(state => state.Location_Info.location);
    const currentSite = useSelector(state => state.Location_Info.site);
    const currentSession = useSelector(state => state.Session_Info.currentSession);
    const animalRegEx = new RegExp(`^${currentLocation}.*Species$`);
    const allCurrentSessions = useSelector(state => state.Session_Info.data_entries);
    const all_answer_sets = useSelector(state => state.Database.answer_sets);
    const animalsExtractedFromDataForms = [
        '',
        'Arthropod',
        ...all_answer_sets
            .filter(form => form.set_name.match(animalRegEx))
            .map(form => {
                const name = form.set_name;

                // Remove the location
                const regExLocation = `^${currentLocation}`;
                const prefix = new RegExp(regExLocation, 'i');
                const locationRemovedString = name.replace(prefix, '');

                // Remove species
                const regExSpecies = /Species$/;
                const suffix = new RegExp(regExSpecies, 'i');
                return locationRemovedString.replace(suffix, '');
            })
    ];

    //Counts
    const getCollectedSpeciesCount = animalName => {
        const currentFormsData = allCurrentSessions.filter(session => {
            return _.toLower(session.form) === _.toLower(animalName);
        });

        const arthropodArray = currentFormsData
            .filter(form => form.form === CONSTANTS.ARTHROPOD)
            .map(arthroForm => {
                let resultArr = [];

                for (const prop in arthroForm.data) {
                    if (arthroForm.data.hasOwnProperty(prop)) {
                        if (prop !== CONSTANTS.FENCE_TRAP
                            && prop !== CONSTANTS.PREDATOR
                            && prop !== CONSTANTS.DATE_MODIFIED
                            && prop !== CONSTANTS.DATE_CREATED
                            && prop !== CONSTANTS.PROJECT_ID
                            && prop !== CONSTANTS.FORM_ID
                            && prop !== CONSTANTS.COMMENTS) {

                            resultArr.push(arthroForm.data[prop]);
                        }
                    }
                }

                return resultArr;
            });

        if (animalName === CONSTANTS.ARTHROPOD) {
            let arthroCount = 0;

            arthropodArray
                .forEach(elem => {
                    arthroCount = elem.reduce(
                        (acc, curr) => Number(acc) + Number(curr), arthroCount
                    )
                });
            return arthroCount;
        } else {
            return currentFormsData.length;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const isFormValid = validate();
        if (endSession) {
            props.history.push('/finish-session')
        } else if (isFormValid) {
            const selectedAnimal = _.startCase(animal);
            props.history.push(`/${selectedAnimal}`);
        }
    };

    const validate = () => {
        let errorObj = {};
        if (animal === '') {
            errorObj = {...errorObj, animal: CONSTANTS.REQUIRED}
        }

        setError({...errorObj});
        setValidated(Object.keys(errorObj).length === 0);
        return Object.keys(errorObj).length === 0;
    };

    const removeFromErrors = (fieldName) => {
        delete errors[fieldName];
    };

    const handleShowModal = () => setShowEndSessionModal(true);
    const handleCloseModal = (checked) => {
        setShowEndSessionModal(false);
        setEndSession(checked);
    }

    useEffect(() => {

        const currentSessionDataObjKeyArray = Object.keys(currentSession.data);
        const clearedObject = currentSessionDataObjKeyArray.reduce(
            (acc, curr) => {
                return {
                    ...acc,
                    [curr] : ''
                }
        }, {});

        dispatch({
            type: CLEAR_CURRENT_AND_ERROR,
            payload: clearedObject
        });
    }, []);

    return (
        <div className='home-page-backing'>
            <div className="header">
                <h1><span className='spacer'>{currentSite} New Data Entry</span></h1>
            </div>
            <div className='center-column'>
                <Container id='newDateEntry'>
                    <Row>
                        <Col>
                            <Form
                                noValidate
                                validated={validated}
                                onSubmit={handleSubmit}
                            >
                                {
                                    fieldHasError('animal') &&
                                    <p className='error-class'>
                                <span className='error-text'>
                                    {errors.animal}
                                </span>
                                    </p>
                                }
                                <FormGroup controlId='animal'>
                                    <FormLabel className='select-group'>
                                        <span>Select from...</span>
                                        <Form.Control
                                            required
                                            as='select'
                                            custom
                                            onChange={(e) => {
                                                setAnimal(e.target.value);
                                                if (e.target.value) {
                                                    removeFromErrors('animal');
                                                }
                                            }}
                                        >
                                            {
                                                animalsExtractedFromDataForms.map((animal) => {
                                                    return (
                                                        <option
                                                            key={animal}
                                                            value={animal}
                                                            className='list-item'
                                                        >
                                                            {animal}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </Form.Control>
                                    </FormLabel>
                                </FormGroup>

                                <FieldWrapper
                                    id='endSessionCheck'
                                    type='checkbox'
                                    label='End Session?'
                                    onClick={() => {
                                        setEndSession(true);
                                        handleShowModal();
                                    }}
                                    onChange={() => {
                                    }}
                                    checked={endSession}
                                />

                                <div id='session-entry-counts'>
                                    <p>
                                        <b>Session Entry Counts</b>
                                    </p>
                                    {
                                        animalsExtractedFromDataForms.filter((animal, n) => n !== 0).map((animal, index) => {
                                            return (
                                                <div className={index % 2 === 0
                                                    ? 'session-count-row dark-table-row'
                                                    : 'session-count-row'}
                                                     key={`${animal}-count`}
                                                >
                                                    <div>{`${animal}:`}</div>
                                                    <div>{getCollectedSpeciesCount(animal)}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                <Button
                                    className='next-button'
                                    aria-label='Go to verify page.'
                                    type='submit'
                                >
                                    NEXT
                                </Button>

                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal
                show={showEndSessionModal}
            >
                <Modal.Header>
                    <Modal.Title>Ending a Session?</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>You are about to end a session, are you sure you want to continue?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => handleCloseModal(false)}
                    >
                        No
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleCloseModal(true)}
                    >
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default NewDataEntry;
