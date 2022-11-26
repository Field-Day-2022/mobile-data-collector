import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default props => (
    <Modal show={props.show}>
        <Modal.Header>
            <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <p>{props.bodyText}</p>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={props.onCancel}>
                {props.cancelText}
            </Button>
            <Button variant="primary" onClick={props.onConfirm}>
                {props.confirmText}
            </Button>
        </Modal.Footer>
    </Modal>
);