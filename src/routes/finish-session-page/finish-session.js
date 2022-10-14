import React, {useState, memo} from 'react';
import {
    Form,
    Button,
    Col,
    Container,
    FormGroup,
    FormLabel,
    Row
} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import FieldWrapper from "../../components/form-components/field-wrapper";
import {fieldHasError} from "../../utils/utils";
import * as ACTIONS from '../../redux/actions/session-actions'
import './finish-session.css';
import '../../App.css';

const FinishSession = (props) => {
    // Local State
    const [validated, setValidated] = useState(false);
    const [trapStatus, setTrapStatus] = useState('');
    const [comments, setComments] = useState('');
    const [errors, setError] = useState({});

    // Redux State
    const dataEntriesData = useSelector(state => state.Session_Info.data_entries)
    const trapStatusObjects = useSelector(state => state.Database.answer_sets);
    const trapAnswerArray = trapStatusObjects.filter(obj => obj.set_name === 'trap statuses')[0].answers;
    const rawTrapStatusOptions = trapAnswerArray.map(trap => trap.primary);
    const trapStatusOptions = ['', ...rawTrapStatusOptions];

    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        const validForm = validate();
        if (validForm) {
            // Addding N/A for every element in object where we have blank string to match old records
            dataEntriesData.forEach((entryInfo) => {
                for (const field in entryInfo.data) {
                    if (entryInfo.data[field] === "") {
                        entryInfo.data[field] = "N/A";
                    }
                }
            })
            dispatch(ACTIONS.closeSession(dataEntriesData, buildRequestObject()));
            props.history.push('/');
        }
    }

    const buildRequestObject = () => ({
        data: {
            "Trap Status": trapStatus,
            "Comments about the array": comments === "" ? "N/A" : comments
        }
    });

    const validate = () => {
        let errorObj = {};

        if (trapStatus === '') {
            errorObj = {...errorObj, trapStatus: 'Required'}
        }

        setError({...errorObj});
        setValidated(Object.keys(errorObj).length === 0);
        return Object.keys(errorObj).length === 0;
    }

    const removeFromErrors = (fieldName) => {
        delete errors[fieldName];
    };

    return (
        <div className='home-page-backing'>
            <div className="header">
                <h1>
                    <span className='spacer'>Finish Session</span>
                </h1>
            </div>
            <div className='center-column'>
                <Container id='finish-session-form'>
                    <Row>
                        <Col>
                            <Form
                                noValidate
                                validated={validated}
                                onSubmit={handleSubmit}
                            >
                                {
                                    fieldHasError('trapStatus') &&
                                    <p className='error-class'>
                                <span className='error-text'>
                                    {errors.trapStatus}
                                </span>
                                    </p>
                                }
                                <FormGroup controlId='trapStatus'>
                                    <FormLabel className='select-group'>
                                        <span>Trap Status</span>
                                        <Form.Control
                                            required
                                            as='select'
                                            custom
                                            onChange={(e) => {
                                                setTrapStatus(e.target.value);
                                                if (e.target.value) {
                                                    removeFromErrors('speciesCode');
                                                }
                                            }}
                                        >
                                            {
                                                trapStatusOptions.map((trap) => {
                                                    return (
                                                        <option
                                                            key={trap.toString()}
                                                            value={trap}
                                                            className='list-item'
                                                        >
                                                            {trap}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </Form.Control>
                                    </FormLabel>
                                </FormGroup>

                                <FieldWrapper
                                    id='comments'
                                    name='comments'
                                    type='textarea'
                                    component='textarea'
                                    label='Comments'
                                    maxLength={100}
                                    className='rounded-input-fields'
                                    onChange={(event) => {
                                        setComments(event.target.value);
                                    }}
                                />
                                <Button
                                    className='next-button'
                                    aria-label='Finish session.'
                                    type='submit'
                                >
                                    SUBMIT
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default memo(FinishSession);
