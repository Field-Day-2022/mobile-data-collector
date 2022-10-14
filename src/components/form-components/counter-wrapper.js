import React, {useEffect, useState} from 'react';
import ErrorMessage from "../error-message/error-message";
import CounterWithLabel from "../animal-counter-with-label/animal-counter-with-label";
import {useSelector, useDispatch} from "react-redux";
import {UPDATE_CURRENT_FORM} from "../../redux/actions/session-actions";
import {disableComponent, showErrorMessage} from "../../utils/utils";

const CounterWrapper = ({field}) => {
    const dispatch = useDispatch();

    // Redux Store
    const current_slice = useSelector(state => state.Session_Info.currentSession);
    const current_error_state = useSelector(state => state.Session_Info.currentErrorState);

    // Local State
    const [relies_on, setReliesOn] = useState([]);

    useEffect(() => {
        setReliesOn(current_slice.reliesOn);
    }, [current_slice.reliesOn]);

    useEffect(() => {
        setReliesOn(current_slice.reliesOn);
        dispatch({
            type: UPDATE_CURRENT_FORM,
            payload: {
                [field.prompt]: 0
            }
        });
    }, [current_slice.reliesOn, field.prompt, dispatch]);

    return (
        <ErrorMessage
            key={`${field.prompt}-error-message`}
            hasErrors={showErrorMessage(field.prompt, {...current_error_state})}
        >
            <CounterWithLabel
                label={field.prompt}
                key={field.prompt}
                increment={(label, num) => {
                    dispatch({
                        type: UPDATE_CURRENT_FORM,
                        payload: {[label]: num}
                    })
                }}
                decrement={(label, num) => {
                    dispatch({
                        type: UPDATE_CURRENT_FORM,
                        payload: {[label]: num}
                    })
                }}
                field={field}
                required={field.required}
                disabled={disableComponent(current_slice, field, relies_on)}
            />
        </ErrorMessage>);
};

export default CounterWrapper;