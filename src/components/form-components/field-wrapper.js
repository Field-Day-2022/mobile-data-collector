import React from 'react';
import { Form, FormLabel } from 'react-bootstrap';

export default ({ id, label, help, ...props }) => (
    <Form.Group controlId={id}>
        <FormLabel>{label}</FormLabel>
        <Form.Control {...props} />
    </Form.Group>
);
