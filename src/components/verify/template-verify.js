import React from "react";
import {
    Button,
    Col,
    Container,
    Row
} from "react-bootstrap";
import _ from 'lodash';
import {useSelector, useDispatch} from 'react-redux';
import * as ACTIONS from '../../redux/actions/session-actions';
import * as CONSTANTS from '../../constants';
import './template-verify.css';
import {ADD_NEW_TOE_CLIP_CODE, ADD_SPECIES, REMOVE_USED_CODE} from "../../redux/actions/toe-clip-code-actions";

const TemplateVerify = (props) => {
    const dispatch = useDispatch();

    // Redux Store
    const currentSite = useSelector(state => state.Location_Info.site);
    const dataEntries = useSelector(state => state.Session_Info.data_entries);
    const currentSession = useSelector(state => state.Session_Info.currentSession);

    const showTrueFalseValues = (value) => {
        if (value === true) {
            return 'Yes';
        } else if (value === false) {
            return 'No';
        }
        return value;
    }

    const fieldJSX = () => {
        const currentForm = _.findLast(dataEntries, entry => entry.form === props.formName);
        const currentFormData = currentForm.data;

        let arr = Object.keys(currentFormData)
            .map(key => ({key, value: currentFormData[key]}))
            .filter(el => (el.key !== CONSTANTS.DATE_CREATED
                && el.key !== CONSTANTS.DATE_MODIFIED
                && el.key !== CONSTANTS.PROJECT_ID
                && el.key !== CONSTANTS.FORM_ID));

        if (props.formName === CONSTANTS.ARTHROPOD) {
            arr = Object.keys(currentFormData)
                .map(key => ({key, value: currentFormData[key]}))
                .filter(el => (el.key !== CONSTANTS.DATE_CREATED
                    && el.key !== CONSTANTS.DATE_MODIFIED
                    && el.key !== CONSTANTS.PROJECT_ID
                    && el.key !== CONSTANTS.FORM_ID))
                .filter(keyObj => keyObj.key === CONSTANTS.FENCE_TRAP
                    || keyObj.key === CONSTANTS.PREDATOR
                    || Number(keyObj.value) > 0
                    || keyObj.key === CONSTANTS.COMMENTS);
        }

        return arr.map(el => {
                return (<div className='verify-section' key={el.key}>
                    <p className='verify-key'>
                        {el.key}
                    </p>
                    <p>{showTrueFalseValues(el.value)}</p>
                </div>)
            }
        )
    }

    return (
        <div className='home-page-backing'>
            <div className="header">
                <h1><span className='spacer'>Verify</span></h1>
            </div>
            <div className='center-column'>
                <Container id={`${props.formName}`}>
                    <Row>
                        <Col>
                            {
                                fieldJSX().map(field => field)
                            }
                        </Col>
                    </Row>
                </Container>
                <div className='button-container'>
                    <Button
                        className='next-button'
                        aria-label='Go to Species Selection Page.'
                        type='submit'
                        onClick={() => {
                            props.hideVerifyPage();
                            // Removes and takes the last entry from Session_Info.data_entries
                            // and repopulates the Session_Info.CurrentSession
                            dispatch(ACTIONS.resetForm());
                        }}
                    >
                        Go Back
                    </Button>
                    <Button
                        className='next-button'
                        aria-label='Go to Species Selection Page.'
                        type='submit'
                        onClick={() => {
                            if (currentSession.form === "Lizard") {
                                dispatch({
                                    type: ADD_NEW_TOE_CLIP_CODE,
                                    payload: {
                                        site: currentSite,
                                        species: currentSession.data[CONSTANTS.SPECIES_CODE],
                                        toeClipCode: currentSession.data[CONSTANTS.TOE_CLIP_CODE]
                                    }
                                })
                                dispatch({
                                    type: REMOVE_USED_CODE,
                                })
                            }
                            dispatch({
                                type: ACTIONS.CLEAR_CURRENT_SESSION_STATE
                            })
                            props.goToSelection();
                        }}
                    >
                        NEXT
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TemplateVerify;
