import React from 'react';
import { Form, FormGroup, FormLabel } from 'react-bootstrap';

export default ({ prompt, onChange, options, disabled, defValue }) => (
    <FormGroup controlId={prompt}>
        <FormLabel className="select-group">
            <span>{prompt}</span>
            <Form.Control required as="select" custom onChange={onChange} disabled={disabled} defaultValue={defValue}>
                {[' ', ...options].map(option =>
                    <option key={option == ' ' ? 'empty' : option} className="list-item">{option}</option>
                )}
            </Form.Control>
        </FormLabel>
    </FormGroup>
);