import React, {memo} from 'react';
import * as CONSTANTS from "../../constants";
import {Form} from "react-bootstrap";
import ShortTextWrapper from "../form-components/short-text-wrapper";
import LongTextWrapper from "../form-components/long-text-wrapper";
import ComboBoxWrapper from "../form-components/combo-box-wrapper";
import CheckboxWrapper from "../form-components/checkbox-wrapper";
import CounterWrapper from "../form-components/counter-wrapper";
import NumberWrapper from "../form-components/number-wrapper";
import ToeClipCodeWrapper from "../form-components/toe-clip-code";

const FormFactory = ({fields}) => {
    return (
        <Form>
            {
                fields.map(field => {
                        switch (field.type) {
                            case CONSTANTS.SHORT_TEXT:
                                if (field.prompt === "Toe-clip Code") {
                                    return <ToeClipCodeWrapper
                                        field={field}
                                        key={field.prompt}
                                    />
                                }
                                 return <ShortTextWrapper
                                    field={field}
                                    key={field.prompt}
                                />;
                            case CONSTANTS.LONG_TEXT:
                                return <LongTextWrapper
                                    key={field.prompt}
                                    field={field}
                                />;
                            case CONSTANTS.COMBO_BOX:
                                return <ComboBoxWrapper
                                    key={field.prompt}
                                    field={field}
                                />;
                            case CONSTANTS.CHECKBOX:
                                return <CheckboxWrapper
                                    key={field.prompt}
                                    field={field}
                                />;
                            case CONSTANTS.NUMERIC:
                                return <NumberWrapper
                                    key={field.prompt}
                                    field={field}
                                />;
                            case CONSTANTS.COUNTER:
                                return <CounterWrapper
                                    key={field.prompt}
                                    field={field}
                                />;
                            default:
                                return '';
                        }
                    }
                )
            }
        </Form>
    );
};

export default memo(FormFactory);
