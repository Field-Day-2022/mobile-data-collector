//Form Utils
import _ from "lodash";
import {REQUIRED} from "../constants";

export const fieldHasError = (errorObj, fieldName) => {
    return errorObj[fieldName] !== '' || !errorObj[fieldName];
};

export const getProjectId = (location) => {
    switch (location) {
        case "San Pedro":
            return 1;
        case "Gateway":
            return 2;
        case "Virgin River":
            return 3;
        default:
            return 0;
    }
}

export const showErrorMessage = (fieldName, errorState) => {
    for (const prop in errorState) {
        if (errorState.hasOwnProperty(prop)) {
            if (_.toLower(prop) === _.toLower(fieldName)
                && (errorState[prop] === REQUIRED)
            ) {
                return true
            }
        }
    }
    return false;
}

/**
 * Disables component based on the Relies On Array
 */
export const disableComponent = (currentState, field, reliesOnArray) => {
    if (reliesOnArray
        && reliesOnArray !== []) {

        // If the dependent field is this field
        const thisFieldReliesOn = reliesOnArray.filter(el => {
            return el.prompt === field.prompt;
        });

        if (thisFieldReliesOn.length === 1) {
            let result = false;

            thisFieldReliesOn.forEach(field => {
                const innerReliesOn = field.relies_on;

                innerReliesOn.forEach(innerField => {
                    const currentFieldState = currentState.data[innerField];
                    result = !(currentFieldState !== '' &&
                        currentFieldState !== null &&
                        currentFieldState !== undefined &&
                        currentFieldState !== false);
                })
            });

            return result;
        }
        return false;
    }
    return false;
}