import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Form, FormLabel} from "react-bootstrap";
import {showErrorMessage, disableComponent} from "../../utils/utils";
import ErrorMessage from "../error-message/error-message";
import {UPDATE_CURRENT_FORM} from "../../redux/actions/session-actions";

const ShortTextWrapper = ({field}) => {
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
                    type='text'
                    component='input'
                    label={field.prompt}
                    placeholder={showValue() === '' ? 'Initials' : showValue()}
                    maxLength={3}
                    className='rounded-input-fields'
                    onChange={(e) => {
                        let value = e.target.value;
                        if (field.prompt === "Recorder" || field.prompt === "Handler") {
                            value = value.toUpperCase();
                        }
                        dispatch({
                            type: UPDATE_CURRENT_FORM,
                            payload: {[field.prompt]: value}
                        })
                    }}
                    required={field.required}
                    value={showValue()}
                    disabled={disableComponent(current_slice, field, relies_on)}
                />
            </Form.Group>
        </ErrorMessage>
    );
};

export default ShortTextWrapper;
