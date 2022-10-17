import React, {useEffect, useState} from 'react';
import * as CONSTANTS from "../../constants";
import _ from 'lodash';
import {useSelector, useDispatch} from "react-redux";
import {disableComponent, showErrorMessage} from "../../utils/utils";
import {UPDATE_CURRENT_FORM, updateSiteAC} from "../../redux/actions/session-actions";
import Combobox from "./combo-box";
import ErrorMessage from "../error-message/error-message";

const ComboBoxWrapper = ({field}) => {
    const current_Location = useSelector(state => state.Location_Info.location);
    const current_site = useSelector(state => state.Location_Info.site);
    const all_answer_sets = useSelector(state => state.Database.answer_sets);
    const current_slice = useSelector(state => state.Session_Info.currentSession);
    const current_error_state = useSelector(state => state.Session_Info.currentErrorState);
    const redux_field = useSelector(state => state.Session_Info.currentSession.data);

    const dispatch = useDispatch();

    // Local State
    const [relies_on, setReliesOn] = useState([]);
    const [options, setOptions] = useState([]);

    // Check to see if there is an answer set for this
    const answer_set = field.hasOwnProperty(CONSTANTS.ANSWER_SET)
        ? field.answer_set.split("}")
        : [];

    // Separate the Pattern from the Answer_Set keyword
    const answerPatternArr = answer_set.filter(answer => answer.includes('{'))
        .map(option => option.substring(1));
    const answer_set_suffix = answer_set.filter(answer => !answer.includes('{'));

    // Build the Search String
    // i.e. GatewaySites or GatewayGWA1Array
    const stringBuilder = () => {
        const answerStringArr = answerPatternArr.map(pattern => {
            if (pattern === CONSTANTS.PROJECT) {
                return current_Location;
            } else if (pattern === CONSTANTS.SITE) {
                return current_site;
            } else {
                return '';
            }
        });
        return answerStringArr.join('').concat(answer_set_suffix[0]);
    }

    // Get the options for the Combo Box
    const comboOptions = () => {
        const searchString = stringBuilder();
        const resultObj = _.find(all_answer_sets, answer_set =>
            answer_set.set_name === searchString);

        return resultObj !== undefined ? resultObj.answers : [];
    };

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

    useEffect(() => {
        if (current_slice.form === "Arthropod") {
            setOptions(['A4', 'B4', 'C4'])
        } else {
            setOptions(comboOptions().map(option => option.primary));
        }
    }, [current_slice.data]);

    return (
        <ErrorMessage
            key={`${field.prompt}-error-message`}
            hasErrors={showErrorMessage(field.prompt, {...current_error_state})}
        >
            <Combobox
                key={field.prompt}
                prompt={field.prompt}
                onChange={e => {
                    if (field.prompt === CONSTANTS.SITE) {
                        dispatch(updateSiteAC(e.target.value));
                    } else {
                        dispatch({
                            type: UPDATE_CURRENT_FORM,
                            payload: {
                                [field.prompt]: e.target.value
                            }
                        })
                    }
                }}
                options={options}
                disabled={disableComponent(current_slice, field, relies_on)}
                required={field.required}
                defValue={showValue()}
            />
        </ErrorMessage>
    )
}

export default ComboBoxWrapper;
