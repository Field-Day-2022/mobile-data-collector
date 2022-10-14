import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Form, FormLabel} from "react-bootstrap";
import {showErrorMessage, disableComponent} from "../../utils/utils";
import ErrorMessage from "../error-message/error-message";
import {UPDATE_CURRENT_FORM} from "../../redux/actions/session-actions";


const LongTextWrapper = ({field}) => {
    const dispatch = useDispatch();

    // Redux Store
    const current_slice = useSelector(state => state.Session_Info.currentSession);
    const current_error_state = useSelector(state => state.Session_Info.currentErrorState);
    const redux_field = useSelector(state => state.Session_Info.currentSession.data);

    // Local State
    const [relies_on, setReliesOn] = useState([]);

    const showValue = () => {
        //return current_slice.data[field.prompt] ? current_slice.data[field.prompt] : '';

        let result = '';
        for (const prop in redux_field) {
            if (redux_field.hasOwnProperty(prop)) {
                if (field.prompt === String(prop)) {
                    result = String(redux_field[prop]);
                    break;
                }
            }
        }
        return result;
    };

    useEffect(() => {
        setReliesOn(current_slice.reliesOn);
    }, [current_slice.reliesOn]);

    return (
        //error message enabled
        <ErrorMessage
            key={`${field.prompt}-error-message`}
            hasErrors={showErrorMessage(field.prompt, {...current_error_state})}
        >

        <Form.Group
                controlId={field.prompt}
                key={field.prompt}
            >
                <FormLabel>{field.prompt}</FormLabel>
                <Form.Control
                    name={field.prompt}
                    type='text'
                    component='input'
                    label={field.prompt}
                    placeholder={''}
                    maxLength={100}
                    className='rounded-input-fields'
                    onChange={(e) => dispatch({
                        type: UPDATE_CURRENT_FORM,
                        payload: {[field.prompt]: e.target.value}
                    })}
                    disabled={disableComponent(current_slice, field, relies_on)}
                    value={showValue()}
                />
            </Form.Group>
        </ErrorMessage>
    );
};

export default LongTextWrapper;