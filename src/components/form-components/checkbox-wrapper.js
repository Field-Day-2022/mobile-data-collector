import React, {useEffect, useState} from 'react';
import ErrorMessage from "../error-message/error-message";
import {Form} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {showErrorMessage, disableComponent} from "../../utils/utils";
import {UPDATE_CURRENT_FORM} from "../../redux/actions/session-actions";

const CheckboxWrapper = ({field}) => {
    const dispatch = useDispatch();

    // Redux Store
    const current_slice = useSelector(state => state.Session_Info.currentSession);
    const current_error_state = useSelector(state => state.Session_Info.currentErrorState);
    const redux_field = useSelector(state => state.Session_Info.currentSession.data);

    // Local State
    const [relies_on, setReliesOn] = useState([]);
    const [checkState, setCheckState] = useState(false);

    useEffect(() => {
        setReliesOn(current_slice.reliesOn);

        dispatch({
            type: UPDATE_CURRENT_FORM,
            payload: {
                [field.prompt]: checkState
            }
        });
    }, [current_slice.reliesOn, field.prompt, dispatch]);

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

    const handleCheckState = () => {
        const toggled = !checkState
        setCheckState(toggled);

        dispatch({
            type: UPDATE_CURRENT_FORM,
            payload: {[field.prompt]: toggled}
        });
    }

    return (
        <ErrorMessage
            key={`${field.prompt}-error-message`}
            hasErrors={showErrorMessage(field.prompt, {...current_error_state})}
        >
            <Form.Group
                controlId={field.prompt}
                key={field.prompt}
                id={`${field.prompt}-check`}
                className="checkbox-container"
            >
                <label htmlFor={field.prompt}>
                    {field.prompt}
                </label>
                <Form.Check
                    type="checkbox"
                    id={field.prompt}
                    onChange={handleCheckState}
                    defaultChecked={checkState}
                    disabled={disableComponent(current_slice, field, relies_on)}
                />
            </Form.Group>
        </ErrorMessage>
    );
};

export default (CheckboxWrapper);