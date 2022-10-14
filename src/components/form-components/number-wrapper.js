import React, {useEffect, useState} from 'react';
import ErrorMessage from "../error-message/error-message";
import {Form, FormLabel} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {disableComponent, showErrorMessage} from "../../utils/utils";
import {UPDATE_CURRENT_FORM} from "../../redux/actions/session-actions";

const NumberWrapper = ({field}) => {
    const dispatch = useDispatch();
    // Redux Store
    const current_slice = useSelector(state => state.Session_Info.currentSession);
    const current_error_state = useSelector(state => state.Session_Info.currentErrorState);
    const redux_field = useSelector(state => state.Session_Info.currentSession.data);

    // Local State
    const [relies_on, setReliesOn] = useState([]);

    const showValue = () => {
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
    }

    useEffect(() => {
        setReliesOn(current_slice.reliesOn);
    }, [current_slice.reliesOn]);

    return (
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
                    type='number'
                    component='input'
                    label={field.prompt}
                    placeholder={showValue() === '' ? '00.0' : showValue()}
                    maxLength={3}
                    className='rounded-input-fields'
                    onChange={(e) => {
                        if (!(Number.isInteger(Number(e.target.value)))) {
                            e.target.value = Number(e.target.value).toFixed(1) > 0
                                ? Number(e.target.value).toFixed(1)
                                : 0;
                        }
                        dispatch({
                            type: UPDATE_CURRENT_FORM,
                            payload: {[field.prompt]: e.target.value}
                        })
                    }}
                    required={field.required}
                    disabled={disableComponent(current_slice, field, relies_on)}
                />
            </Form.Group>
        </ErrorMessage>
    );
}

export default NumberWrapper;
