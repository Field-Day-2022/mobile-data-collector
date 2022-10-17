import React from "react";
import {Form, FormLabel} from "react-bootstrap";

const FieldWrapper = ({id, label, help, ...props}) => {
    return (
        <Form.Group controlId={id}>
            <FormLabel>{label}</FormLabel>
            <Form.Control {...props} />
        </Form.Group>
    );
};

export default FieldWrapper;
